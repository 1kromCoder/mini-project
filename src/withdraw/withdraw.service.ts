import {
  BadRequestException,
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
  async create(createWithdrawDto: CreateWithdrawDto, id: string) {
    try {
      let order = await this.prisma.order.findFirst({where:{id:createWithdrawDto.orderId}});
      if(!order){
        throw new NotFoundException("order not found")
      }

      const orderItems = await this.prisma.orderItems.findMany({
        where: { orderId: order.id },
        include: { product: true },
      });
      
      if (!orderItems || orderItems.length === 0) {
        throw new NotFoundException('OrderItems topilmadi');
      }
      
      const totalAmount = orderItems.reduce((acc, item) => {
        return acc + item.quantity * item.product.price;
      }, 0);

      const user = await this.prisma.user.findFirst({
        where: { id: order.waiterId },
        include: { restaurant: true },
      });

      if (!user) {
        throw new NotFoundException('Waiter topilmadi');
      }

      let restaurant = await this.prisma.restaurant.findFirst({where:{id:createWithdrawDto.restaurantId}})
      if(!restaurant){
        throw new NotFoundException("restaurant not found")
      }
      let updatedBalance = (totalAmount / 100) * Number(restaurant.tip)

      const withdraw = await this.prisma.withDraw.create({
        data: {
          ...createWithdrawDto,
          casherId: id,
        },
      });

      await this.prisma.user.update({
        where: { id: user.id },
        data: { balance: updatedBalance },
      });

      await this.prisma.order.update({
        where: { id: order.id },
        data: { status: "PAYED" },
      });
      
      return withdraw;
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(
        'Withdraw yaratishda xatolik yuz berdi',
      );
    }
  }

  async getWithdrawStats(restaurantId: string) {
    try {
      if (restaurantId) {
        const restaurant = await this.prisma.restaurant.findUnique({
          where: { id: restaurantId },
        });
        if (!restaurant) {
          throw new NotFoundException('Restaurant topilmadi');
        }
      }

      const where = restaurantId ? { restaurantId } : {};

      const income = await this.prisma.withDraw.aggregate({
        _count: true,
        _sum: { amount: true },
        where: {
          ...where,
          type: 'INCOME',
        },
      });

      const outcome = await this.prisma.withDraw.aggregate({
        _count: true,
        _sum: { amount: true },
        where: {
          ...where,
          type: 'OUTCOME',
        },
      });

      const balance = (income._sum.amount || 0) - (outcome._sum.amount || 0);

      return {
        totalIncome: income._sum.amount || 0,
        totalOutcome: outcome._sum.amount || 0,
        balance,
        totalIncomeCount: income._count,
        totalOutcomeCount: outcome._count,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Statistikani hisoblashda xatolik yuz berdi',
      );
    }
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    type?: 'INCOME' | 'OUTCOME';
    restaurantId?: string;
  }) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        type,
        restaurantId,
      } = query;

      const where: any = {};
      if (type) where.type = type;
      if (restaurantId) where.restaurantId = restaurantId;

      const total = await this.prisma.withDraw.count({ where });

      const data = await this.prisma.withDraw.findMany({
        where,
        include: {
          restaurant: true,
          user: true,
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        total,
        page,
        limit,
        data,
      };
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
          order: true,
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
