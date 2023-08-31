import { IsInt, IsMongoId, IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";

export class CreateWishDto {
    @IsMongoId()
    readonly offer: string;

    @IsMongoId()
    readonly price: string;

    @IsMongoId()
    readonly user: string;

    @IsMongoId()
    @IsOptional()
    readonly picture?: string;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    readonly amount: number;
}
