import { ApiProperty } from '@nestjs/swagger';
import { PayType, WithDrawType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateDebtDto {
  @ApiProperty({example:"UUID"})
  @IsUUID()
  restaurantId: string;

  @ApiProperty({example:"UUID"})
  @IsUUID()
  orderId: string;

  @ApiProperty({example:652000})
  @IsNumber()
  amount: number;

  @ApiProperty({example:"Dilshodbek t"})
  @IsString()
  @IsNotEmpty()
  client: string

  @ApiProperty({example: "Puli qolib ketgan"})
  @IsString()
  @MinLength(3)
  description: string;
}
