import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RegionService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateRegionDto) {
    try {
      return await this.prisma.region.create({ data });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findAll(params: {
    name?: string;
    order: 'asc' | 'desc';
    page: number;
    limit: number;
  }) {
    const { name, order, page, limit } = params;
    const skip = (page - 1) * limit;

    try {
      const where: any = {};
      if (name) {
        where.name = { contains: name, mode: 'insensitive' };
      }

      const data = await this.prisma.region.findMany({
        where,
        orderBy: { name: order },
        skip,
        take: limit,
      });

      const total = await this.prisma.region.count({ where });

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
      return await this.prisma.region.findFirst({ where: { id } });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async update(id: string, data: UpdateRegionDto) {
    try {
      return await this.prisma.region.update({ where: { id }, data });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.region.delete({ where: { id } });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
