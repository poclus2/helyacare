import { MedusaService } from "@medusajs/framework/utils"
import { Ambassador } from "./models/ambassador"
import { Wallet } from "./models/wallet"
import { LedgerEntry } from "./models/ledger-entry"

class MlmModuleService extends MedusaService({
  Ambassador,
  Wallet,
  LedgerEntry,
}) {
  // Custom logic for auto-generating referral codes
  async generateDefaultReferralCode(firstName: string, lastName: string): Promise<string> {
    const baseCode = `HELYA-${firstName.toUpperCase()}${lastName.charAt(0).toUpperCase()}`
    
    // Check if this baseCode exists
    const [existing] = await this.listAmbassadors({
      referral_code: baseCode,
    })
    
    if (!existing) {
      return baseCode
    }
    
    // Add numerical suffix if exists
    let offset = 2
    while (true) {
      const codeToTest = `${baseCode}-${offset}`
      const [existingOffset] = await this.listAmbassadors({
        referral_code: codeToTest,
      })
      if (!existingOffset) {
        return codeToTest
      }
      offset++
    }
  }

  // Set the custom alias logic
  async setCustomAlias(ambassadorId: string, customAlias: string): Promise<void> {
    const aliasToSet = customAlias.toUpperCase()
    
    // Uniqueness validation
    const [existing] = await this.listAmbassadors({
      referral_code: aliasToSet,
    })
    
    if (existing && existing.id !== ambassadorId) {
      throw new Error(`The referral alias ${aliasToSet} is already taken.`)
    }
    
    await this.updateAmbassadors({
      id: ambassadorId,
      referral_code: aliasToSet
    })
  }

  // --- HYBRID BINARY LOGIC ---

  /**
   * Finds the next available spot in the binary tree based on the sponsor's preference
   */
  async assignBinaryPlacement(sponsorId: string): Promise<{ placement_id: string, binary_position: "LEFT" | "RIGHT" }> {
    const sponsor = await this.retrieveAmbassador(sponsorId)
    
    const preference = sponsor.placement_preference || "AUTOMATIC"
    // TODO: For "AUTOMATIC", determine the weaker leg by comparing left_bv and right_bv
    let targetDirection: "LEFT" | "RIGHT" = preference === "RIGHT" ? "RIGHT" : "LEFT"
    
    let currentNodeId = sponsor.id

    while (true) {
      // Find children of currentNodeId
      const children = await this.listAmbassadors({
        placement: { id: currentNodeId }
      })

      const targetChild = children.find(c => c.binary_position === targetDirection)

      if (!targetChild) {
        // We found an empty spot!
        return { placement_id: currentNodeId, binary_position: targetDirection }
      }

      // If the spot is taken, move down to that child and continue
      currentNodeId = targetChild.id
    }
  }

  /**
   * Accumulates BV up the binary tree when a purchase is made
   */
  async addBinaryVolume(startingAmbassadorId: string, volumeToAdd: number): Promise<void> {
    let current = await this.retrieveAmbassador(startingAmbassadorId, { relations: ["placement"] })

    while (current && current.placement) {
      const parentId = current.placement.id
      const position = current.binary_position

      const parent = await this.retrieveAmbassador(parentId)

      if (position === "LEFT") {
        await this.updateAmbassadors({
          id: parentId,
          left_bv: Number(parent.left_bv || 0) + volumeToAdd
        })
      } else if (position === "RIGHT") {
        await this.updateAmbassadors({
          id: parentId,
          right_bv: Number(parent.right_bv || 0) + volumeToAdd
        })
      }

      // Move up to the next parent
      current = await this.retrieveAmbassador(parentId, { relations: ["placement"] })
    }
  }
}

export default MlmModuleService
