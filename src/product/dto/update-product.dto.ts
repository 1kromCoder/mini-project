import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty()
  @IsString()
  name?: string;
  @ApiProperty()
  @IsNumber()
  price?: number;
  @ApiProperty()
  @IsString()
  categoryId?: string;
  @ApiProperty()
  @IsBoolean()
  isActive?: boolean;
}
