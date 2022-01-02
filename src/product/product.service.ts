import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService extends TypeOrmCrudService<Product> {
  constructor(@InjectRepository(Product) repo) {
    super(repo);
  }

  async findAllPaged(take: number = 10, skip: number = 0) {
    const [data, total] = await this.repo.findAndCount({ take, skip });
    return { data, total };
  }
}
