import { model } from "@medusajs/framework/utils"
import { Ambassador } from "./ambassador"
import { LedgerEntry } from "./ledger-entry"

export const Wallet = model.define("wallet", {
  id: model.id().primaryKey(),
  
  // Real-time balance computed/cached
  balance: model.bigNumber().default(0),

  ambassador: model.belongsTo(() => Ambassador, { mappedBy: "wallet" }),
  
  // All transactions impacting this wallet
  transactions: model.hasMany(() => LedgerEntry, { mappedBy: "wallet" })
})
