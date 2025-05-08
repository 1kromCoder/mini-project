import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsEnum, IsNumber, IsPhoneNumber, IsString, IsUUID, MaxLength, MinLength, minLength } from "class-validator";

export class LoginUserDto {


    @ApiProperty({example:"+998998774512"})
    @IsString()
    @IsPhoneNumber("UZ")
    phone: string

    @ApiProperty({example: "StrongPass123"})
    @MinLength(8)
    @MaxLength(16)
    password: string
}