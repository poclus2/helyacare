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
      relations: [
        "wallet", 
        "wallet.transactions", 
        "downlines",
        "downlines.downlines",
        "downlines.downlines.downlines"
      ]
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

    // Flatten downlines
    const flatDownlines: any[] = []
    
    const processDownlines = (dls: any[], level: number) => {
      if (!dls || !Array.isArray(dls)) return;
      for (const d of dls) {
        flatDownlines.push({
          id: d.id,
          customer_id: d.customer_id,
          referral_code: d.referral_code,
          created_at: d.created_at,
          level
        })
        if (d.downlines && d.downlines.length > 0 && level < 3) {
          processDownlines(d.downlines, level + 1)
        }
      }
    }

    processDownlines((ambassador as any).downlines, 1)

    const ambassadorData = {
      ...ambassador,
      downlines: flatDownlines
    }

    return res.json({
      ambassador: ambassadorData,
      stats: {
        available_balance: availableBalance,
        pending_balance: pendingBalance,
        paid_out: paidOut,
        total_transactions: transactions.length,
        downline_count: flatDownlines.length,
      }
    })
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message })
  }
}
