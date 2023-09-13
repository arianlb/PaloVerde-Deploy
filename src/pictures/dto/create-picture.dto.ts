import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, Min } from "class-validator";

export class CreatePictureDto {

    @ApiProperty()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    price?: number;

    @ApiProperty()
    @Type(() => Boolean)
    @IsBoolean()
    own: boolean;
}
