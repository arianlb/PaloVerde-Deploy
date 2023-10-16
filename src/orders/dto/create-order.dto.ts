import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsMongoId, IsPositive, Min } from "class-validator";

export class CreateOrderDto {
    @ApiProperty()
    @IsMongoId()
    readonly offer: string;

    @ApiProperty()
    @Type(() => Number)
    @IsPositive()
    readonly height: number;

    @ApiProperty()
    @Type(() => Number)
    @IsPositive()
    readonly width: number;

    @ApiProperty()
    @IsMongoId()
    readonly picture: string;

    @ApiProperty()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    readonly quantity: number;
}
