import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Render,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { ProductsService } from './product/product.service';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly productsService: ProductsService,
  ) {}

  @Get('/')
  @Render('market')
  index() {
    return {};
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('product/paged')
  async findAllPaged(@Query() { take, skip }) {
    return this.productsService.findAllPaged(take, skip);
  }
}
