import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refreshtoken.dto';
import { hasSubscribers } from 'diagnostics_channel';
import { CreateAdminDto } from './dto/admin-create.dto';
import { UserRole } from '@prisma/client';

export enum userrole {
  CASHER = 'CASHER',
  WAITER = 'WAITER',
  OWNER = 'OWNER',
}
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  generateAccessToken(payload: { id: string; role: string }): string {
    return this.jwt.sign(payload, {
      expiresIn: '15m',
    });
  }

  generateRefreshToken(payload: { id: string; role: string }): string {
    return this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
  }

  verifyRefreshToken(tokenDto: RefreshTokenDto) {
    try {
      const data = this.jwt.verify(tokenDto.token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const payload = { id: data.id, role: data.role };
      const accessToken = this.generateAccessToken(payload);
      return { accessToken };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async checkPhone(phone: string) {
    try {
      let user = this.prisma.user.findFirst({ where: { phone } });
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async register(data: CreateUserDto) {
    try {
      if (data.role == 'ADMIN' || data.role == 'SUPERADMIN') {
        throw new BadRequestException(
          'Please change role, only allow WAITER, CASHER and WAITER',
        );
      }
      let user = await this.checkPhone(data.phone);
      if (user) {
        throw new BadRequestException('User already exists!');
      }
      let hash = bcrypt.hashSync(data.password, 10);
      let newUser = await this.prisma.user.create({
        data: { ...data, password: hash },
      });
      return newUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(data: LoginUserDto) {
    try {
      let user = await this.checkPhone(data.phone);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      let isMatch = bcrypt.compare(data.password, user.password);
      if (!isMatch) {
        throw new BadRequestException('Wrong creadentials!');
      }

      let payload = { id: user.id, role: user.role };
      let accessToken = this.generateAccessToken(payload);
      let refreshToken = this.generateRefreshToken(payload);

      return { accessToken, refreshToken };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(
    page = 1,
    limit = 10,
    sortBy: string = 'createdAt',
    order: 'asc' | 'desc' = 'asc',
    name?: string,
    role?: UserRole,
    restaurantId?: string,
  ) {
    try {
      const where: any = {};
      if (name) where.firstName = { contains: name, mode: 'insensitive' };

      if (role) where.role = role;

      if (restaurantId) {
        where.restaurantId = restaurantId;
      }

      const total = await this.prisma.user.count({ where });
      const users = await this.prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where,
        orderBy: { [sortBy]: order },
      });

      return {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        users,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAllForOwner(
    page = 1,
    limit = 10,
    sortBy: string = 'createdAt',
    order: 'asc' | 'desc' = 'asc',
    name?: string,
    role?: userrole,
    ownerId?: string,
  ) {
    try {
      const where: any = {};
      if (name) where.firstName = { contains: name, mode: 'insensitive' };

      if (role) {
        where.role = role;
      }

      if (ownerId) {
        let owner = await this.prisma.user.findFirst({
          where: { id: ownerId },
        });
        where.restaurantId = owner?.restaurantId;
      }

      const total = await this.prisma.user.count({ where });
      const users = await this.prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where,
        orderBy: { [sortBy]: order },
      });

      return {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        users,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      let user = await this.prisma.user.findFirst({
        where: { id },
        include: { restaurant: true },
      });
      if (!user) {
        throw new BadRequestException('user not found');
      }
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async me(id: string) {
    try {
      let user = await this.prisma.user.findFirst({
        where: { id },
        include: { restaurant: true },
      });
      if (!user) {
        throw new BadRequestException('user not found');
      }
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, data: UpdateUserDto) {
    try {
      if (data.role == 'ADMIN' || data.role == 'SUPERADMIN') {
        throw new BadRequestException(
          'Please change role, only allow WAITER, CASHER and WAITER',
        );
      }
      let user = await this.prisma.user.update({ where: { id }, data });
      if (!user) {
        throw new BadRequestException('user not found');
      }
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      let user = await this.prisma.user.delete({ where: { id } });
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createAdmin(data: CreateAdminDto) {
    try {
      const exists = await this.checkPhone(data.phone);
      if (exists) throw new BadRequestException('Phone already exists');

      let hash = bcrypt.hashSync(data.password, 10);
      const admin = await this.prisma.user.create({
        data: { ...data, password: hash },
      });

      return admin;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteAdmin(id: string) {
    try {
      const user = await this.findOne(id);
      if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
        throw new BadRequestException('User is not an admin');
      }

      return await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
