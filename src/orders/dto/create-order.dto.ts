import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsIn, IsMongoId, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateOrderDto {
    @ApiProperty()
    @IsOptional()
    @IsDate()
    createdAt?: Date;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    paid: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @IsIn(['Pending', 'Accepted', 'Rejected', 'Ready', 'Delivered'])
    status?: string;

    @ApiProperty()
    @IsMongoId()
    user: string;

    @ApiProperty()
    @IsArray()
    @IsMongoId({ each: true })
    wishes: string[];
}
