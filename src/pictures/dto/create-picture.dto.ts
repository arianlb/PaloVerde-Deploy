import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreatePictureDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    url?: string;

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price: number;
}
