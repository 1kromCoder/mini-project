import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsUUID, MIN_LENGTH, Min, MinLength } from "class-validator";
import { CreateOrderItemDto } from "./create-orderitem.dto";

export class CreateOrderDto {
    @ApiProperty({example:"UUID"})
    @IsUUID()
    restaurantId: string

    @ApiProperty({example: 'Table 7'})
    @IsString()
    @IsNotEmpty()
    table:string

    @ApiProperty({
        type: [CreateOrderItemDto],
        description: "list order items"
    })
    orderItem:CreateOrderItemDto[]
}