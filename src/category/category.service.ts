import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({ data });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findAll(params: {
    name?: string;
    restaurantId?: string;
    order: 'asc' | 'desc';
    page: number;
    limit: number;
  }) {
    const { name, restaurantId, order, page, limit } = params;
    const skip = (page - 1) * limit;

    try {
      const where: any = {};
      if (name) {
        where.name = { contains: name, mode: 'insensitive' };
      }
      if (restaurantId) {
        where.restaurantId = restaurantId;
      }

      const data = await this.prisma.category.findMany({
        where,
        orderBy: { name: order },
        skip,
        take: limit,
        include: {
          restaurant: true,
        },
      });

      const total = await this.prisma.category.count({ where });

      return {
        data,
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
      return await this.prisma.category.findFirst({ where: { id } });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async update(id: string, data: UpdateCategoryDto) {
    try {
      return await this.prisma.category.update({ where: { id }, data });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.category.delete({ where: { id } });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
