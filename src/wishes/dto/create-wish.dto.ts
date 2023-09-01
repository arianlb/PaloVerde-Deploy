import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsMongoId, IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";

export class CreateWishDto {
    @ApiProperty()
    @IsMongoId()
    readonly offer: string;

    @ApiProperty()
    @IsMongoId()
    readonly price: string;

    @ApiProperty()
    @IsMongoId()
    readonly user: string;

    @ApiProperty()
    @IsMongoId()
    @IsOptional()
    readonly picture?: string;

    @ApiProperty()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    readonly amount: number;
}
