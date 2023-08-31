import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
    @ApiProperty({
        default: 10,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    limit?: number;

    @ApiProperty({
        default: 0,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    offset?: number;
}