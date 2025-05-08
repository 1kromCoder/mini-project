import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { subDays, startOfWeek, endOfWeek } from 'date-fns';
import { CreateStatDto } from './dto/create-stat.dto';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTopProducts(dto: CreateStatDto) {
    try {
      const { restaurantId } = dto;
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  
      const grouped = await this.prisma.orderItems.groupBy({
        by: ['productId'],
        where: {
          order: {
            restaurantId: restaurantId,
            createdAt: {
              gte: weekStart,
              lte: weekEnd,
            },
          },
        },
        _sum: {
          quantity: true,
        },
        orderBy: {
          _sum: {
            quantity: 'desc',
          },
        },
        take: 10,
      });
  
      // product ma'lumotlarini olish
      const productIds = grouped.map(g => g.productId);
      const products = await this.prisma.product.findMany({
        where: {
          id: { in: productIds },
        },
      });
  
      // productlarni ularning IDsi bo‘yicha xaritada saqlash
      const productMap = new Map(products.map(p => [p.id, p]));
  
      // yakuniy natija: product + quantity
      return grouped.map(item => ({
        product: productMap.get(item.productId),
        totalQuantity: item._sum.quantity,
      }));
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
  
  async getTopWaiters(dto: CreateStatDto) {
    try {
      const { restaurantId } = dto;
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

      const groupedOrders = await this.prisma.order.groupBy({
        by: ['waiterId'],
        where: {
          restaurantId,
          createdAt: {
            gte: weekStart,
            lte: weekEnd,
          },
        },
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
        take: 10,
      });

      const waiterIds = groupedOrders.map(item => item.waiterId);
      const waiters = await this.prisma.user.findMany({
        where: {
          id: {
            in: waiterIds,
          },
        },
        select: {
          id: true,
          name: true,
          tgId: true,
          phone: true,
        },
      });

      const waiterMap = new Map(waiters.map(user => [user.id, user]));

      return groupedOrders.map(item => ({
        waiter: waiterMap.get(item.waiterId),
        orderCount: item._count.id,
      }));
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Statistikani olishda xatolik yuz berdi');
    }
  }
}  