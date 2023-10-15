import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

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

    @ApiProperty()
    @Type(() => Number)
    @Min(0)
    price: number;

    @ApiProperty()
    @IsOptional()
    @Type(() => Number)
    @Min(0)
    discount?: number;
}
