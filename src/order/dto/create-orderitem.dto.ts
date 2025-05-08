import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsUUID, Min } from "class-validator"

export class CreateOrderItemDto {
    @ApiProperty({example:"UUID"})
    @IsUUID()
    productId: string

    @ApiProperty({example: 2})
    @IsNumber()
    @Min(1)
    quantity: number
}
