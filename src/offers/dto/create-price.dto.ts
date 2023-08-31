import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Min, IsString, MinLength } from "class-validator";

export class CreatePriceDto {
    @ApiProperty()
    @IsNumber()
    @Min(0)
    value: number;

    @ApiProperty()
    @IsString()
    @MinLength(3)
    size: string;
}