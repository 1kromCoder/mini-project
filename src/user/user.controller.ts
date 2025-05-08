import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RefreshTokenDto } from './dto/refreshtoken.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuard } from 'src/guard/role.guard';
import { Roles } from './decorators/role.decorator';
import { UserRole } from '@prisma/client';

enum sortEnum {
  id = 'id',
  name = 'firstName',
  createdAt = 'CreatedAt',
}
enum orderEnum {
  asc = 'asc',
  desc = 'desc',
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Post('RefreshToken')
  refresh(@Body() token: RefreshTokenDto) {
    return this.userService.verifyRefreshToken(token);
  }

  @Post('login')
  login(@Body() data: LoginUserDto) {
    return this.userService.login(data);
  }


  @Roles(UserRole.ADMIN,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get()
  @ApiQuery({
    example: 1,
    name: 'page',
  })
  @ApiQuery({
    example: 10,
    name: 'limit',
  })
  @ApiQuery({
    name: 'sortBy',
    enum: sortEnum,
    required: false,
  })
  @ApiQuery({
    name: 'order',
    enum: orderEnum,
    required: false,
  })
  @ApiQuery({
    name: 'firstName',
    required: false,
  })
  @ApiQuery({
    name: 'lastName',
    required: false,
  })
  @ApiQuery({
    name: 'year',
    required: false,
  })
  @ApiQuery({
    name: 'region',
    required: false,
  })
  @ApiQuery({
    name: 'email',
    required: false,
  })
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: sortEnum,
    @Query('order') order: orderEnum,
    @Query('name') name: string,
  ) {
    return this.userService.findAll(
      Number(page),
      Number(limit),
      sortBy,
      order,
      name,
    );
  }


  @UseGuards(AuthGuard)
  @Get('/me')
  me(@Req() req: Request) {
    const userId = req['user-id'];
    return this.userService.me(userId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Roles(UserRole.ADMIN,UserRole.OWNER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Roles(UserRole.ADMIN,UserRole.OWNER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
