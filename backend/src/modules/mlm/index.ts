import { Module } from "@medusajs/framework/utils"
import MlmModuleService from "./service"

export const MLM_MODULE = "mlm"

export default Module(MLM_MODULE, {
  service: MlmModuleService,
})
