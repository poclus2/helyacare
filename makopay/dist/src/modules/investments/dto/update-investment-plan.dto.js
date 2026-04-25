"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInvestmentPlanDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_investment_plan_dto_1 = require("./create-investment-plan.dto");
class UpdateInvestmentPlanDto extends (0, mapped_types_1.PartialType)(create_investment_plan_dto_1.CreateInvestmentPlanDto) {
}
exports.UpdateInvestmentPlanDto = UpdateInvestmentPlanDto;
//# sourceMappingURL=update-investment-plan.dto.js.map