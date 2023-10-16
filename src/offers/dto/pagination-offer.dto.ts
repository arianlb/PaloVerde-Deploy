import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";

export class PaginationOfferDto {
    @ApiProperty({
        default: 10,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    limit?: number;

    @ApiProperty({
        default: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    page?: number;

    @ApiProperty({
        default: 'Paper',
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    readonly material?: string;
}