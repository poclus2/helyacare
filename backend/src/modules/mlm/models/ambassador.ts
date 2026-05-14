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
  wallet: model.hasOne(() => Wallet, { mappedBy: "ambassador" }),

  // --- HYBRID BINARY PLAN FIELDS ---
  // Placement in the binary tree
  placement: model.belongsTo(() => Ambassador, { mappedBy: "binary_downlines" }).nullable(),
  binary_downlines: model.hasMany(() => Ambassador, { mappedBy: "placement" }),
  
  // Which leg is this ambassador on under their placement parent?
  binary_position: model.enum(["LEFT", "RIGHT"]).nullable(),
  
  // Business Volume (BV) accumulated on the left and right legs
  left_bv: model.bigNumber().default(0),
  right_bv: model.bigNumber().default(0),
  
  // Ambassador's preference for placing new recruits
  placement_preference: model.enum(["LEFT", "RIGHT", "WEAKER_LEG", "AUTOMATIC"]).default("AUTOMATIC")
})
