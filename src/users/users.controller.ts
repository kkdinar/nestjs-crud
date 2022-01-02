import { Controller } from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { Crud, CrudController } from '@nestjsx/crud';

@Crud({
  model: {
    type: User,
  },
})
@Controller('user')
export class UsersController implements CrudController<User> {
  constructor(public service: UsersService) {}
}
