import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateWithdrawDto } from './create-withdraw.dto';
import { IsEnum, IsString } from 'class-validator';
import { PayType, WithDrawType } from '@prisma/client';

export class UpdateWithdrawDto extends PartialType(CreateWithdrawDto) {
  @ApiProperty()
  @IsString()
  restaurantId?: string;
  @ApiProperty({ enum: WithDrawType })
  @IsEnum(WithDrawType)
  type?: WithDrawType;
  @ApiProperty({ enum: PayType })
  @IsEnum(PayType)
  payType?: PayType;
  casherId?: string;
  @ApiProperty()
  @IsString()
  description?: string;
}
