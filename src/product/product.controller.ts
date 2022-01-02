import {
  Controller,
  Query,
  Get,
  UseInterceptors,
  CacheInterceptor,
} from '@nestjs/common';
import { Product } from './product.entity';
import { ProductsService } from './product.service';
import { Crud, CrudController } from '@nestjsx/crud';

@Crud({
  model: {
    type: Product,
  },
})
@Controller('product')
export class ProductController implements CrudController<Product> {
  constructor(public service: ProductsService) {}

  @UseInterceptors(CacheInterceptor)
  @Get(':id')
  get(@Query() { id }) {
    return this.service.findOne(id);
  }
}
