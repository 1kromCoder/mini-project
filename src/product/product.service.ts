import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateProductDto) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) throw new BadRequestException('Category not found');

      return await this.prisma.product.create({ data });
    } catch (err) {
      console.log(err)
      throw new BadRequestException(err.message);
    }
  }

  async findAll(params: {
    categoryId?: string;
    name?: string;
    price?: string;
    sortBy: string;
    order: 'asc' | 'desc';
    page: number;
    limit: number;
  }) {
    const { categoryId, name, sortBy, price, order, page, limit } = params;
    const skip = (page - 1) * limit;

    try {
      const where: any = {};

      if (categoryId) where.categoryId = categoryId;
      if (name) where.name = { contains: name, mode: 'insensitive' };
      if (price) where.price = Number(price);

      const products = await this.prisma.product.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip,
        take: limit,
        include: { category: true },
      });

      const total = await this.prisma.product.count({ where });

      return {
        data: products,
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
      const restaurant = await this.prisma.product.findFirst({
        where: { id },
      });
      if (!restaurant) throw new NotFoundException('Product not found');
      return restaurant;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async update(id: string, data: UpdateProductDto) {
    try {
      const exists = await this.prisma.product.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Product not found');

      return await this.prisma.product.update({ where: { id }, data });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: string) {
    try {
      const exists = await this.prisma.product.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Product not found');

      return await this.prisma.product.delete({ where: { id } });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
