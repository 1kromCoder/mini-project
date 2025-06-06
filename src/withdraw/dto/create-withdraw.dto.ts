import { ApiProperty } from '@nestjs/swagger';
import { PayType, WithDrawType } from '@prisma/client';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateWithdrawDto {
  @ApiProperty()
  @IsString()
  restaurantId: string;
  @ApiProperty({ enum: WithDrawType })
  @IsEnum(WithDrawType)
  type: WithDrawType;
  @ApiProperty({ enum: PayType })
  @IsEnum(PayType)
  payType: PayType;
  casherId: string;
  @ApiProperty()
  @IsString()
  description?: string;
  @ApiProperty()
  @IsString()
  orderId: string;
  @ApiProperty()
  @IsNumber()
  amount: number;
}
