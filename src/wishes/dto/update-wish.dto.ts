/*import { PartialType } from '@nestjs/swagger';
import { CreateWishDto } from './create-wish.dto';*/

import { IsInt, Min } from "class-validator";

export class UpdateWishDto {
    @IsInt()
    @Min(1)
    readonly amount: number;
}
