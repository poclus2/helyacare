import { model } from "@medusajs/framework/utils"
import { Wallet } from "./wallet"

export const Ambassador = model.define("ambassador", {
  id: model.id().primaryKey(),
  
  // Link to the native Customer
  customer_id: model.text().unique(),
  
  // Custom unique referral code (e.g. HELYA-MARCD, COACH-MARC)
  referral_code: model.text().unique(),
  
  // Self-referencing link for the MLM tree (Multi-level mapping)
  // Maps to another ambassador.id
  sponsor: model.belongsTo(() => Ambassador, { mappedBy: "downlines" }).nullable(),
  downlines: model.hasMany(() => Ambassador, { mappedBy: "sponsor" }),
  
  // One-to-One mapping: An ambassador has exactly one Wallet
  wallet: model.hasOne(() => Wallet, { mappedBy: "ambassador" })
})
