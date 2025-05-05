import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductBodyDto, UpdateProductBodyDto } from './product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SearchProductDto } from './product.dto';
// @UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getProducts(@Query() query: SearchProductDto) {
    return this.productsService.getProducts(query);
  }

  @Get(':id')
  getProduct(@Param('id') id: string) {
    return this.productsService.getProduct(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createProduct(@Body() body: CreateProductBodyDto) {
    return this.productsService.createProduct(body);
  }

  @Patch(':id')
  updateProduct(
    @Param('id') id: string,
    @Body() productData: UpdateProductBodyDto,
  ) {
    return this.productsService.updateProduct(id, productData);
  }
}
