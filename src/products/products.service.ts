import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductBodyDto } from './product.dto';
import { LotService } from '../lot/lot.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private lotService: LotService,
  ) {}

  async getProducts(): Promise<Product[]> {
    return this.productsRepository.find({ relations: ['lot'] });
  }

  async getProduct(id: string): Promise<Product> {
    return this.productsRepository.findOne({ where: { id: parseInt(id) } });
  }

  async getProductByName(name: string): Promise<Product> {
    return this.productsRepository.findOne({ where: { name } });
  }

  async createProduct(body: CreateProductBodyDto): Promise<Product> {
    const product = await this.getProductByName(body.name);
    if (product) {
      throw new Error('Product already exists');
    }

    const lot = await this.lotService.createLot(body.lot);
    const newProduct = this.productsRepository.create(<Product>{
      name: body.name,
      price: body.price,
      description: body.description,
      category: body.category,
      lot: lot,
    });
    return this.productsRepository.save(newProduct);
  }

  async updateProduct(
    id: string,
    productData: Partial<Product>,
  ): Promise<Product> {
    await this.productsRepository.update(id, productData);
    return this.getProduct(id);
  }
}
