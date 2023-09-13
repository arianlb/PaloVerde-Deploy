import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

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

    @ApiProperty()
    @Type(() => Boolean)
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
