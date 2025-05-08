import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsString()
  address: string;
  @ApiProperty()
  @IsString()
  phone: string;
  @ApiProperty()
  @IsNumber()
  tip: number;
  @ApiProperty()
  @IsString()
  regionId: string;
  @ApiProperty({ example: 'true' })
  @IsBoolean()
  isActive: boolean;
}
