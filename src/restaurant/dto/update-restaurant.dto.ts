import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRestaurantDto } from './create-restaurant.dto';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
  @ApiProperty()
  @IsString()
  name?: string;
  @ApiProperty()
  @IsString()
  address?: string;
  @ApiProperty()
  @IsString()
  phone?: string;
  @ApiProperty()
  @IsNumber()
  tip?: number;
  @ApiProperty()
  @IsString()
  regionId?: string;
  @ApiProperty({ example: 'true' })
  @IsBoolean()
  isActive?: boolean;
}
