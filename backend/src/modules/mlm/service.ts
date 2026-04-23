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
}

export default MlmModuleService
