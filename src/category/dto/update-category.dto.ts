import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { IsBoolean, IsString } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty()
  @IsString()
  name?: string;
  @ApiProperty()
  @IsString()
  restaurantId?: string;
  @ApiProperty({ example: 'true' })
  @IsBoolean()
  isActive?: boolean;
}
