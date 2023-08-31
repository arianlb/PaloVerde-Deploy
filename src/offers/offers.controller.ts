import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { CreatePriceDto } from './dto/create-price.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Offers')
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createOfferDto: CreateOfferDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.offersService.create(createOfferDto, file);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.offersService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.offersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseMongoIdPipe) id: string, @Body() updateOfferDto: UpdateOfferDto) {
    return this.offersService.update(id, updateOfferDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.offersService.remove(id);
  }

  @Post(':id/prices')
  addPrice(@Param('id', ParseMongoIdPipe) id: string, @Body() createPriceDto: CreatePriceDto) {
    return this.offersService.addPrice(id, createPriceDto);
  }
}
