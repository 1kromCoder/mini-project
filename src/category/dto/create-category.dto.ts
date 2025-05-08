import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsString()
  restaurantId: string;
  @ApiProperty({ example: 'true' })
  @IsBoolean()
  isActive: boolean;
}
