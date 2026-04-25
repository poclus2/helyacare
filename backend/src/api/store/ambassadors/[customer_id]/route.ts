import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MLM_MODULE } from "../../../../modules/mlm"
import MlmModuleService from "../../../../modules/mlm/service"

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
      relations: ["wallet", "wallet.transactions", "downlines"]
    })

    if (!ambassadors || ambassadors.length === 0) {
      return res.status(404).json({ message: "Customer is not an ambassador" })
    }

    const ambassador = ambassadors[0]

    // Calculate commission stats from ledger
    const transactions = (ambassador as any).wallet?.transactions || []
    const availableBalance = transactions
      .filter((t: any) => t.status === "available")
      .reduce((sum: number, t: any) => sum + (t.amount || 0), 0)
    const pendingBalance = transactions
      .filter((t: any) => t.status === "pending")
      .reduce((sum: number, t: any) => sum + (t.amount || 0), 0)
    const paidOut = transactions
      .filter((t: any) => t.status === "paid")
      .reduce((sum: number, t: any) => sum + (t.amount || 0), 0)

    return res.json({
      ambassador,
      stats: {
        available_balance: availableBalance,
        pending_balance: pendingBalance,
        paid_out: paidOut,
        total_transactions: transactions.length,
        downline_count: (ambassador as any).downlines?.length || 0,
      }
    })
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message })
  }
}
