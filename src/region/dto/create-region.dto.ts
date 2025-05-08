import { ApiProperty } from '@nestjs/swagger';

export class CreateRegionDto {
  @ApiProperty()
  name: string;
}
