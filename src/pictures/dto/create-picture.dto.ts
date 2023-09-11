import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, Min } from "class-validator";

export class CreatePictureDto {
    /*@ApiProperty()
    @IsOptional()
    @IsString()
    url?: string;*/

    @ApiProperty()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    price?: number;

    @ApiProperty()
    @IsBoolean()
    own: boolean;
}
