import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsNumber()
  price: number;
  @ApiProperty()
  @IsString()
  categoryId: string;
  @ApiProperty()
  @IsString()
  restaurantId: string;
  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}
