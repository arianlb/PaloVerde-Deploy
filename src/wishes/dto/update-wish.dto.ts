/*import { PartialType } from '@nestjs/swagger';
import { CreateWishDto } from './create-wish.dto';*/
import { ApiProperty } from "@nestjs/swagger";

import { IsInt, Min } from "class-validator";

export class UpdateWishDto {
    @ApiProperty()
    @IsInt()
    @Min(1)
    readonly amount: number;
}
