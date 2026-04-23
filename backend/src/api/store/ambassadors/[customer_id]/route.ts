import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MLM_MODULE } from "../../../../../modules/mlm"
import MlmModuleService from "../../../../../modules/mlm/service"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const customerId = req.params.customer_id
  const mlmService: MlmModuleService = req.scope.resolve(MLM_MODULE)

  try {
    const ambassadors = await mlmService.listAmbassadors({
      customer_id: customerId
    }, {
      relations: ["wallet", "downlines"]
    })

    if (!ambassadors || ambassadors.length === 0) {
      return res.status(404).json({ message: "Customer is not an ambassador" })
    }

    return res.json({ ambassador: ambassadors[0] })
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message })
  }
}
