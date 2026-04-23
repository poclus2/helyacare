import { model } from "@medusajs/framework/utils"
import { Wallet } from "./wallet"

export const LedgerEntry = model.define("ledger_entry", {
  id: model.id().primaryKey(),
  
  // Amount to credit/debit 
  amount: model.bigNumber(),
  
  // Link to the wallet
  wallet: model.belongsTo(() => Wallet, { mappedBy: "transactions" }),
  
  // Audit trail: The specific Medusa Order ID that triggered this commission
  order_id: model.text().index(),
  
  // Status mapping for fraud checks & refund windows
  status: model.enum(["pending", "available", "paid"]).default("pending")
})
