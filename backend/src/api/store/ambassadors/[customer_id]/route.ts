import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MLM_MODULE } from "../../../../modules/mlm"
import MlmModuleService from "../../../../modules/mlm/service"
import { Modules } from "@medusajs/framework/utils"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const customerId = req.params.customer_id
  const mlmService: MlmModuleService = req.scope.resolve(MLM_MODULE)
  const customerService = req.scope.resolve(Modules.CUSTOMER)

  try {
    // Fetch the ambassador (sans relations imbriquées — MikroORM ne charge pas
    // fiablement les self-ref récursifs avec downlines.downlines)
    const ambassadors = await mlmService.listAmbassadors(
      { customer_id: customerId },
      { relations: ["wallet", "wallet.transactions"] }
    )

    if (!ambassadors || ambassadors.length === 0) {
      return res.status(404).json({ message: "Customer is not an ambassador" })
    }

    const ambassador = ambassadors[0]

    // ── 3 requêtes séquentielles pour construire l'arbre MLM ─────────────────
    // Niveau 1 : filleuls directs
    const level1 = await mlmService.listAmbassadors(
      { sponsor: ambassador.id } as any,
      { select: ["id", "customer_id", "referral_code", "created_at"] }
    )

    const flatDownlines: any[] = level1.map(d => ({
      id: d.id,
      customer_id: d.customer_id,
      referral_code: d.referral_code,
      created_at: (d as any).created_at,
      level: 1,
    }))

    // Niveau 2 : filleuls des filleuls
    if (level1.length > 0) {
      const level1Ids = level1.map(d => d.id)
      const level2 = await mlmService.listAmbassadors(
        { sponsor: level1Ids } as any,
        { select: ["id", "customer_id", "referral_code", "created_at"] }
      )

      for (const d of level2) {
        flatDownlines.push({
          id: d.id,
          customer_id: d.customer_id,
          referral_code: d.referral_code,
          created_at: (d as any).created_at,
          level: 2,
        })
      }

      // Niveau 3 : 3ème génération
      if (level2.length > 0) {
        const level2Ids = level2.map(d => d.id)
        const level3 = await mlmService.listAmbassadors(
          { sponsor: level2Ids } as any,
          { select: ["id", "customer_id", "referral_code", "created_at"] }
        )

        for (const d of level3) {
          flatDownlines.push({
            id: d.id,
            customer_id: d.customer_id,
            referral_code: d.referral_code,
            created_at: (d as any).created_at,
            level: 3,
          })
        }
      }
    }

    // ── Enrichissement : récupérer les noms depuis le module Customer ─────────
    if (flatDownlines.length > 0) {
      const customerIds = flatDownlines.map(d => d.customer_id).filter(Boolean)
      try {
        const customers = await customerService.listCustomers(
          { id: customerIds },
          { select: ["id", "first_name", "last_name", "email"] }
        )
        const customerMap = new Map(customers.map((c: any) => [c.id, c]))

        for (const dl of flatDownlines) {
          const customer = customerMap.get(dl.customer_id)
          if (customer) {
            dl.first_name = customer.first_name || ""
            dl.last_name = customer.last_name || ""
            dl.email = customer.email || ""
          }
        }
      } catch (e) {
        // Si le module Customer n'est pas accessible, on continue sans les noms
        console.warn("Could not enrich downlines with customer names:", e)
      }
    }

    // ── Stats depuis le ledger ────────────────────────────────────────────────
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

    const ambassadorData = {
      ...ambassador,
      downlines: flatDownlines,
    }

    return res.json({
      ambassador: ambassadorData,
      stats: {
        available_balance: availableBalance,
        pending_balance: pendingBalance,
        paid_out: paidOut,
        total_transactions: transactions.length,
        downline_count: flatDownlines.length,
      },
    })
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message })
  }
}
