import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MLM_MODULE } from "../../../../modules/mlm"
import MlmModuleService from "../../../../modules/mlm/service"
import { Modules } from "@medusajs/framework/utils"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { customer_id, order_id, amount, bonus_points } = req.body as {
    customer_id: string
    order_id: string
    amount: number
    bonus_points: number
  }

  if (!customer_id || !order_id) {
    return res.status(400).json({ message: "customer_id and order_id are required" })
  }

  const mlmService: MlmModuleService = req.scope.resolve(MLM_MODULE)
  const customerService = req.scope.resolve(Modules.CUSTOMER)

  try {
    // 1. Prevent duplicate processing
    const existingEntries = await mlmService.listLedgerEntries({ order_id })
    if (existingEntries && existingEntries.length > 0) {
      return res.status(200).json({ message: "Commissions already processed for this order" })
    }

    // 2. Find starting point in the MLM tree and Level 1 sponsor
    let sponsorL1: any = null
    let startingAmbassadorId: string | null = null

    const [purchaserAmbassador] = await mlmService.listAmbassadors(
      { customer_id },
      { relations: ["sponsor"] }
    )

    if (purchaserAmbassador) {
      startingAmbassadorId = purchaserAmbassador.id
      if (purchaserAmbassador.sponsor) {
        const sponsorL1Id = typeof purchaserAmbassador.sponsor === "string" 
          ? purchaserAmbassador.sponsor 
          : purchaserAmbassador.sponsor.id
        const [sponsor] = await mlmService.listAmbassadors(
          { id: sponsorL1Id },
          { relations: ["sponsor"] }
        )
        sponsorL1 = sponsor
      }
    } else {
      // Not an ambassador, check customer metadata
      const customer = await customerService.retrieveCustomer(customer_id)
      const referralCode = customer.metadata?.referral_code
      if (referralCode) {
        const [sponsor] = await mlmService.listAmbassadors(
          { referral_code: (referralCode as string).toUpperCase() },
          { relations: ["sponsor"] }
        )
        if (sponsor) {
          sponsorL1 = sponsor
          startingAmbassadorId = sponsor.id // For binary volume, start from the sponsor
        }
      }
    }

    // 3. Find Level 2 and Level 3 sponsors
    let sponsorL2: any = null
    let sponsorL3: any = null

    if (sponsorL1) {
      if (sponsorL1.sponsor) {
        const sponsorL1ParentId = typeof sponsorL1.sponsor === "string" 
          ? sponsorL1.sponsor 
          : sponsorL1.sponsor.id
        const [sponsor2] = await mlmService.listAmbassadors(
          { id: sponsorL1ParentId },
          { relations: ["sponsor"] }
        )
        sponsorL2 = sponsor2
        
        if (sponsor2 && sponsor2.sponsor) {
          const sponsorL2ParentId = typeof sponsor2.sponsor === "string" 
            ? sponsor2.sponsor 
            : sponsor2.sponsor.id
          const [sponsor3] = await mlmService.listAmbassadors(
            { id: sponsorL2ParentId },
            { relations: ["sponsor"] }
          )
          sponsorL3 = sponsor3
        }
      }
    }

    // 4. Distribute commissions
    const commissions: Array<{ ambassadorId: string; amount: number; level: number }> = []

    if (sponsorL1 && amount > 0) {
      commissions.push({ ambassadorId: sponsorL1.id, amount: amount * 0.10, level: 1 })
    }
    if (sponsorL2 && amount > 0) {
      commissions.push({ ambassadorId: sponsorL2.id, amount: amount * 0.05, level: 2 })
    }
    if (sponsorL3 && amount > 0) {
      commissions.push({ ambassadorId: sponsorL3.id, amount: amount * 0.02, level: 3 })
    }

    for (const comm of commissions) {
      const [wallet] = await mlmService.listWallets({ ambassador: comm.ambassadorId })
      if (wallet) {
        // Create LedgerEntry
        await mlmService.createLedgerEntries({
          amount: comm.amount,
          wallet: wallet.id,
          order_id: order_id,
          status: "pending"
        } as any)

        // Update Wallet Balance
        await mlmService.updateWallets({
          id: wallet.id,
          balance: Number(wallet.balance || 0) + comm.amount
        })
      }
    }

    // 5. Accumulate binary volume (BV)
    if (startingAmbassadorId && bonus_points > 0) {
      await mlmService.addBinaryVolume(startingAmbassadorId, bonus_points)
    }

    return res.status(200).json({ 
      success: true, 
      processed: true,
      commissions_distributed: commissions.length,
      binary_volume_added: bonus_points 
    })
  } catch (error: any) {
    console.error("[store/ambassadors/commission] Error processing commission:", error)
    return res.status(500).json({ message: "Internal server error", error: error.message })
  }
}
