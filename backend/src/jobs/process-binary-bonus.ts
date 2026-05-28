import { MedusaContainer } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function processBinaryBonusJob(container: MedusaContainer) {
  const storeModuleService = container.resolve(Modules.STORE);
  const mlmService = container.resolve("mlmModuleService");

  const [store] = await storeModuleService.listStores();
  if (!store || !store.metadata?.binary_bonus_settings) {
    return;
  }

  const settings: any = store.metadata.binary_bonus_settings;
  
  if (!settings.auto_execution) {
    return;
  }

  const interval = settings.execution_interval || "monthly";
  const now = new Date();

  // Determine if we should run today based on the interval
  let shouldRun = false;
  if (interval === "daily") {
    shouldRun = true;
  } else if (interval === "weekly") {
    // Run on Sunday (0)
    if (now.getDay() === 0) shouldRun = true;
  } else if (interval === "monthly") {
    // Run on the 1st of the month
    if (now.getDate() === 1) shouldRun = true;
  }

  if (!shouldRun) {
    return;
  }

  const percentage = Number(settings.percentage) || 10;
  const rate = Number(settings.bv_to_xof_rate) || 1;

  console.log(`[process-binary-bonus] Running automated binary match (${interval}). Percentage: ${percentage}%, Rate: ${rate}`);

  // Execute matching logic
  const ambassadors = await mlmService.listAmbassadors({}, { relations: ["wallet"] });

  let processedCount = 0;
  let totalPaid = 0;

  for (const ambassador of ambassadors) {
    const leftBv = Number(ambassador.left_bv || 0);
    const rightBv = Number(ambassador.right_bv || 0);
    
    const minBv = Math.min(leftBv, rightBv);
    
    if (minBv > 0) {
      const commissionAmount = minBv * (percentage / 100) * rate;
      
      // Update Ambassador legs
      await mlmService.updateAmbassadors({
        id: ambassador.id,
        left_bv: leftBv - minBv,
        right_bv: rightBv - minBv
      });

      // Update Wallet
      const [wallet] = await mlmService.listWallets({ ambassador: ambassador.id });
      
      if (wallet) {
          await mlmService.updateWallets({
              id: wallet.id,
              balance: Number(wallet.balance || 0) + commissionAmount
          });

          await mlmService.createLedgerEntries({
              wallet_id: wallet.id,
              amount: commissionAmount,
              status: "available",
              order_id: "BINARY_MATCH_AUTO_" + Date.now(),
          });
          
          processedCount++;
          totalPaid += commissionAmount;
      }
    }
  }
  
  console.log(`[process-binary-bonus] Finished automated binary match. Processed: ${processedCount}, Total Paid: ${totalPaid} XOF`);
}

export const config = {
  name: "process-binary-bonus",
  schedule: "0 0 * * *", // Runs every day at midnight (server time)
};
