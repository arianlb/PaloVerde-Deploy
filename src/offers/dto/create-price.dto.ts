import { ApiProperty } from "@nestjs/swagger";
import { Min, IsString, MinLength, IsInt } from "class-validator";

export class CreatePriceDto {
    @ApiProperty()
    @IsInt()
    @Min(0)
    value: number;

    @ApiProperty()
    @IsString()
    @MinLength(3)
    size: string;
}