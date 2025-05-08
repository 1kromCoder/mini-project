import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { IsEmpty, IsEnum, IsNumber, IsPhoneNumber, IsString, IsUUID, MaxLength, MinLength, minLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({example:"Jeckson"})
    @IsString()
    @MinLength(3)
    name: string

    @ApiProperty({example:"+998998774512"})
    @IsString()
    @IsPhoneNumber("UZ")
    phone: string

    @ApiProperty({example:"UUID"})
    @IsUUID()
    restaurantId: string

    @ApiProperty({example: "StrongPass123"})
    @MinLength(8)
    @MaxLength(16)
    password: string

    @ApiProperty({enum: UserRole,example: "WAITER"})
    @IsEnum(UserRole)
    role: UserRole

    @ApiProperty({example: 12365452})
    @IsNumber()
    tgId:number
}
