import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRegionDto } from './create-region.dto';

export class UpdateRegionDto extends PartialType(CreateRegionDto) {
  @ApiProperty()
  name?: string;
}
