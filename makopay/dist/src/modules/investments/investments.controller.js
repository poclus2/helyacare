"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentsController = void 0;
const common_1 = require("@nestjs/common");
const investments_service_1 = require("./investments.service");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../../core/guards/roles/roles.guard");
const roles_decorator_1 = require("../../core/decorators/roles/roles.decorator");
const client_1 = require("@prisma/client");
const create_investment_plan_dto_1 = require("./dto/create-investment-plan.dto");
const update_investment_plan_dto_1 = require("./dto/update-investment-plan.dto");
let InvestmentsController = class InvestmentsController {
    investmentsService;
    constructor(investmentsService) {
        this.investmentsService = investmentsService;
    }
    createPlan(body) {
        return this.investmentsService.createPlan(body);
    }
    updatePlan(id, body) {
        return this.investmentsService.updatePlan(id, body);
    }
    deletePlan(id) {
        return this.investmentsService.deletePlan(id);
    }
    findAllPlans() {
        return this.investmentsService.findAllPlans();
    }
    myInvestments(req) {
        return this.investmentsService.findAllInvestments(req.user.userId);
    }
    getAllInvestments(req) {
        const search = req.query.search || '';
        const status = req.query.status;
        return this.investmentsService.findAllInvestmentsAdmin(search, status);
    }
    getInvestmentStats() {
        return this.investmentsService.getInvestmentStats();
    }
};
exports.InvestmentsController = InvestmentsController;
__decorate([
    (0, common_1.Post)('plans'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_investment_plan_dto_1.CreateInvestmentPlanDto]),
    __metadata("design:returntype", void 0)
], InvestmentsController.prototype, "createPlan", null);
__decorate([
    (0, common_1.Patch)('plans/:id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_investment_plan_dto_1.UpdateInvestmentPlanDto]),
    __metadata("design:returntype", void 0)
], InvestmentsController.prototype, "updatePlan", null);
__decorate([
    (0, common_1.Delete)('plans/:id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InvestmentsController.prototype, "deletePlan", null);
__decorate([
    (0, common_1.Get)('plans'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InvestmentsController.prototype, "findAllPlans", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InvestmentsController.prototype, "myInvestments", null);
__decorate([
    (0, common_1.Get)('admin/all'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InvestmentsController.prototype, "getAllInvestments", null);
__decorate([
    (0, common_1.Get)('admin/stats'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InvestmentsController.prototype, "getInvestmentStats", null);
exports.InvestmentsController = InvestmentsController = __decorate([
    (0, common_1.Controller)('investments'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [investments_service_1.InvestmentsService])
], InvestmentsController);
//# sourceMappingURL=investments.controller.js.map