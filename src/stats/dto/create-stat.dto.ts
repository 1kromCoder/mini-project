import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class CreateStatDto {
    @ApiProperty({example:"UUID"})
    // @IsUUID()
    restaurantId: string
}
