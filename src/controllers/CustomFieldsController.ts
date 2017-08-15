import { Controller, Body, Get, ForbiddenError } from "routing-controllers";
import { HttpCode, Ctx } from "routing-controllers";
import { Repository } from "../repository/Repository";
import { CustomField } from "../models/CustomField";
import { ProductVersion } from "../models/ProductVersion";
import { Product } from "../models/Product";

@Controller("/custom-fields")
export class CustomFieldsController {
    customFieldRepository: any;
    productVersionRepository: any;
    productRepository: any;

    constructor(private repository: Repository) {
        this.customFieldRepository = this.repository.getRepository(CustomField);
        this.productVersionRepository = this.repository.getRepository(ProductVersion);
        this.productRepository = this.repository.getRepository(Product);
    }

    @Get()
    @HttpCode(201)
    async getCount( @Ctx() ctx: any, @Body() viewModel: any) {
        const product: Product = this.productRepository.create({name : "product1"});
        product.tenantId = 1;
        await this.productRepository.save(product);
        const productVersion: ProductVersion = this.productVersionRepository.create({name : "version1"});
        productVersion.product = product;
        productVersion.tenantId = 1;
        await this.productVersionRepository.save(productVersion);
        const customFieldCount = await this.customFieldRepository.count({ productVersionId: productVersion.id });
        if (customFieldCount === 10) {
            throw new ForbiddenError("maximum custom fields limit reached!");
        }
        return { count: customFieldCount };
    }
}
