import { Injectable } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RegionService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateRegionDto) {
    let post = await this.prisma.region.create({ data });
    return post;
  }

  async findAll() {
    return `This action returns all region`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} region`;
  }

  async update(id: number, updateRegionDto: UpdateRegionDto) {
    return `This action updates a #${id} region`;
  }

  async remove(id: number) {
    return `This action removes a #${id} region`;
  }
}
