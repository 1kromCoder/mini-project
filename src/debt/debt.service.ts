import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { Prisma } from '@prisma/client';

@Injectable()
export class DebtService {
  constructor(private readonly prisma: PrismaService) {}

  // Create Debt
  async create(createDebtDto: CreateDebtDto, req: Request) {
    try {
      const debt = await this.prisma.debt.create({
        data: {
          ...createDebtDto,
          casherId: req['user-id'], 
        },
      });

      await this.prisma.order.update({
        where: { id: createDebtDto.orderId }, 
        data: { status: 'DEBTED' }, 
      });

      return debt;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Get all Debts with optional filtering, sorting, and pagination
  async findAll(
    page: number = 1,
    pageSize: number = 10,
    restaurantId?: string,
    orderId?: string,
    client?: string,
    casherId?: string,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    try {
      const filters: Prisma.DebtWhereInput = {};

      if (restaurantId) {
        filters.restaurantId = restaurantId;
      }
      if (orderId) {
        filters.orderId = orderId;
      }
      if (client) {
        filters.client = { contains: client, mode: 'insensitive' };
      }
      if (casherId) {
        filters.casherId = casherId;
      }

      const debts = await this.prisma.debt.findMany({
        where: filters,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          restaurant: true,
        },
      });

      const totalDebts = await this.prisma.debt.count({ where: filters });

      return { debts, totalDebts };
    } catch (error) {
      throw new BadGatewayException('Error fetching debts: ' + error.message);
    }
  }

  // Get one Debt by ID
  async findOne(id: string) {
    try {
      const debt = await this.prisma.debt.findUnique({
        where: { id },
        include: {
          restaurant: true,
          order: true,
          user: true,
        },
      });

      if (!debt) {
        throw new BadRequestException(`Debt with ID ${id} not found`);
      }

      return debt;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Update Debt
  async update(id: string, updateDebtDto: UpdateDebtDto) {
    try {
      const debt = await this.prisma.debt.update({
        where: { id },
        data: updateDebtDto,
      });

      return debt;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Delete Debt by ID
  async remove(id: string) {
    try {
      const debt = await this.prisma.debt.delete({
        where: { id },
      });

      return debt;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
