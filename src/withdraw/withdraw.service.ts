import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WithdrawService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createWithdrawDto: CreateWithdrawDto) {
    try {
      return await this.prisma.withDraw.create({
        data: {
          ...createWithdrawDto,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Withdraw yaratishda xatolik yuz berdi',
      );
    }
  }
  async findAll() {
    try {
      return await this.prisma.withDraw.findMany({
        include: {
          restaurant: true,
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Withdrawlarni olishda xatolik yuz berdi',
      );
    }
  }

  async findOne(id: string) {
    try {
      const withdraw = await this.prisma.withDraw.findUnique({
        where: { id },
        include: {
          restaurant: true,
          user: true,
        },
      });

      if (!withdraw) {
        throw new NotFoundException(`Withdraw ID ${id} topilmadi`);
      }

      return withdraw;
    } catch (error) {
      throw new InternalServerErrorException(
        'Withdrawni olishda xatolik yuz berdi',
      );
    }
  }

  async update(id: string, updateWithdrawDto: UpdateWithdrawDto) {
    try {
      const existing = await this.prisma.withDraw.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Withdraw ID ${id} topilmadi`);
      }

      return await this.prisma.withDraw.update({
        where: { id },
        data: updateWithdrawDto,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Withdrawni yangilashda xatolik yuz berdi',
      );
    }
  }

  async remove(id: string) {
    try {
      const existing = await this.prisma.withDraw.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Withdraw ID ${id} topilmadi`);
      }

      return await this.prisma.withDraw.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Withdrawni o‘chirishda xatolik yuz berdi',
      );
    }
  }
}
