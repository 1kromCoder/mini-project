import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RestaurantService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateRestaurantDto) {
    try {
      const region = await this.prisma.region.findUnique({
        where: { id: data.regionId },
      });
      if (!region) throw new BadRequestException('Region not found');

      return await this.prisma.restaurant.create({ data });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findAll(params: {
    regionId?: string;
    name?: string;
    address?: string;
    phone?: string;
    tip?: number;
    sortBy: string;
    order: 'asc' | 'desc';
    page: number;
    limit: number;
  }) {
    const { regionId, name, address, phone, tip, sortBy, order, page, limit } =
      params;
    const skip = (page - 1) * limit;

    try {
      const where: any = {};

      if (regionId) where.regionId = regionId;
      if (name) where.name = { contains: name, mode: 'insensitive' };
      if (address) where.address = { contains: address, mode: 'insensitive' };
      if (phone) where.phone = { contains: phone, mode: 'insensitive' };
      if (tip !== undefined) where.tip = tip;

      const restaurants = await this.prisma.restaurant.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip,
        take: limit,
        include: { Region: true, Category: true, Order: true, User: true },
      });

      const total = await this.prisma.restaurant.count({ where });

      return {
        data: restaurants,
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findOne(id: string) {
    try {
      const restaurant = await this.prisma.restaurant.findFirst({
        where: { id },
      });
      if (!restaurant) throw new NotFoundException('Restaurant not found');
      return restaurant;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async update(id: string, data: UpdateRestaurantDto) {
    try {
      const exists = await this.prisma.restaurant.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Restaurant not found');

      return await this.prisma.restaurant.update({ where: { id }, data });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: string) {
    try {
      const exists = await this.prisma.restaurant.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Restaurant not found');

      return await this.prisma.restaurant.delete({ where: { id } });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
