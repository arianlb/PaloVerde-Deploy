import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsIn, IsInt, IsMongoId, IsOptional, IsString, Min } from 'class-validator';

export class UpdateOrderDto {
    @ApiProperty()
    @IsOptional()
    @IsDate()
    createdAt?: Date;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    @Min(0)
    paid?: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @IsIn(['Pending', 'Accepted', 'Rejected', 'Ready', 'Delivered'])
    status?: string;

    @ApiProperty()
    @IsOptional()
    @IsMongoId()
    user?: string;
}