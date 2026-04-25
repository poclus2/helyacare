import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MLM_MODULE } from "../../../modules/mlm"
import MlmModuleService from "../../../modules/mlm/service"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { customer_id, referral_code, sponsor_referral_code } = req.body as {
    customer_id: string
    referral_code: string
    sponsor_referral_code?: string
  }

  if (!customer_id || !referral_code) {
    return res.status(400).json({ message: "customer_id and referral_code are required" })
  }

  const mlmService: MlmModuleService = req.scope.resolve(MLM_MODULE)

  try {
    // Check if ambassador already exists for this customer
    const existing = await mlmService.listAmbassadors({ customer_id })
    if (existing && existing.length > 0) {
      return res.json({ ambassador: existing[0], already_exists: true })
    }

    // Check referral code uniqueness
    const existingCode = await mlmService.listAmbassadors({ referral_code })
    if (existingCode && existingCode.length > 0) {
      // Append suffix to make it unique
      const uniqueCode = `${referral_code}-${Date.now().toString(36).toUpperCase()}`
      return createAmbassador(mlmService, res, customer_id, uniqueCode, sponsor_referral_code)
    }

    return createAmbassador(mlmService, res, customer_id, referral_code, sponsor_referral_code)
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error", error: error.message })
  }
}

async function createAmbassador(
  mlmService: MlmModuleService,
  res: MedusaResponse,
  customer_id: string,
  referral_code: string,
  sponsor_referral_code?: string
) {
  // Find sponsor if referral code was provided
  let sponsorId: string | undefined = undefined
  if (sponsor_referral_code) {
    try {
      const [sponsor] = await mlmService.listAmbassadors({ referral_code: sponsor_referral_code.toUpperCase() })
      if (sponsor) {
        sponsorId = sponsor.id
      }
    } catch {
      // Sponsor not found — proceed without linking
    }
  }

  // Create the ambassador record
  const ambassador = await mlmService.createAmbassadors({
    customer_id,
    referral_code: referral_code.toUpperCase(),
    ...(sponsorId && { sponsor: sponsorId }),
  } as any)

  // Create the wallet for this ambassador
  await mlmService.createWallets({
    ambassador: (ambassador as any).id,
    balance: 0,
  } as any)

  // Return fresh data with relations
  const [freshAmbassador] = await mlmService.listAmbassadors(
    { customer_id },
    { relations: ["wallet"] }
  )

  return res.status(201).json({ ambassador: freshAmbassador })
}
