import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateOfferDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    material: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    image?: string;
}
