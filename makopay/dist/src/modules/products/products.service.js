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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/database/prisma/prisma.service");
const client_1 = require("@prisma/client");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createProductDto) {
        return this.prisma.product.create({
            data: {
                ...createProductDto,
                price: new client_1.Prisma.Decimal(createProductDto.price),
            },
        });
    }
    async findAll(minPrice, maxPrice, planId) {
        const where = { deletedAt: null };
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined)
                where.price.gte = new client_1.Prisma.Decimal(minPrice);
            if (maxPrice !== undefined)
                where.price.lte = new client_1.Prisma.Decimal(maxPrice);
        }
        if (planId) {
            where.investmentPlanId = planId;
        }
        return this.prisma.product.findMany({
            where,
            include: { investmentPlan: true },
            orderBy: { price: 'asc' },
        });
    }
    async findOne(id) {
        return this.prisma.product.findFirst({
            where: { id, deletedAt: null },
            include: { investmentPlan: true },
        });
    }
    async update(id, updateProductDto) {
        const data = { ...updateProductDto };
        if (updateProductDto.price !== undefined) {
            data.price = new client_1.Prisma.Decimal(updateProductDto.price);
        }
        return this.prisma.product.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        return this.prisma.product.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map