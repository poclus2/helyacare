import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const mlmService: any = req.scope.resolve("mlmModuleService");
    const storeModuleService: any = req.scope.resolve(Modules.STORE);

    const [store] = await storeModuleService.listStores();
    if (!store) {
      return res.status(400).json({ success: false, error: "Store not found" });
    }

    const binarySettings = store.metadata?.binary_bonus_settings || {
      percentage: 10,
      bv_to_xof_rate: 1,
      auto_execution: false,
      execution_interval: "monthly",
    };

    const percentage = Number(binarySettings.percentage) || 10;
    const rate = Number(binarySettings.bv_to_xof_rate) || 1;

    // Get all ambassadors
    const ambassadors = await mlmService.listAmbassadors({}, { relations: ["wallet"] });

    let processedCount = 0;
    let totalPaid = 0;

    for (const ambassador of ambassadors) {
      const leftBv = Number(ambassador.left_bv || 0);
      const rightBv = Number(ambassador.right_bv || 0);
      
      const minBv = Math.min(leftBv, rightBv);
      
      if (minBv > 0) {
        // Calculate the bonus
        const commissionAmount = minBv * (percentage / 100) * rate;
        
        // Update Ambassador's legs (subtract the matched volume)
        await mlmService.updateAmbassadors({
          id: ambassador.id,
          left_bv: leftBv - minBv,
          right_bv: rightBv - minBv
        });

        // Add to wallet
        // Wait, the wallet is a one-to-one relation. Sometimes it's loaded as an object.
        const walletObj = ambassador.wallet;
        
        // If walletObj doesn't exist directly on ambassador, try to fetch it
        const [wallet] = await mlmService.listWallets({ ambassador: ambassador.id });
        
        if (wallet) {
            // Update balance
            await mlmService.updateWallets({
                id: wallet.id,
                balance: Number(wallet.balance || 0) + commissionAmount
            });

            // Create ledger entry
            await mlmService.createLedgerEntries({
                wallet_id: wallet.id,
                amount: commissionAmount,
                status: "available",
                order_id: "BINARY_MATCH_" + Date.now(),
            });

            processedCount++;
            totalPaid += commissionAmount;
        }
      }
    }

    return res.status(200).json({ 
        success: true, 
        processed: processedCount, 
        total_paid: totalPaid,
        settings_used: { percentage, rate }
    });
  } catch (error: any) {
    console.error("[binary-match]", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
