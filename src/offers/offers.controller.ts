import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { PaginationOfferDto } from './dto/pagination-offer.dto';

@ApiTags('Offers')
@ApiBearerAuth()
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) { }

  @Post()
  @Auth(ValidRoles.admin)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createOfferDto: CreateOfferDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.offersService.create(createOfferDto, file);
  }

  @Get()
  findAll(
    @Query() paginationOfferDto: PaginationOfferDto,
  ) {
    return this.offersService.findAll(paginationOfferDto);
  }

  @Get('admin')
  @Auth(ValidRoles.admin)
  findAllAdmin(
    @Query() paginationOfferDto: PaginationOfferDto,
  ) {
    return this.offersService.findAll(paginationOfferDto, false);
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.offersService.findOne(id);
  }

  @Get('admin/:id')
  @Auth(ValidRoles.admin)
  findOneAdmin(@Param('id', ParseMongoIdPipe) id: string) {
    return this.offersService.findOne(id, false);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(@Param('id', ParseMongoIdPipe) id: string, @Body() updateOfferDto: UpdateOfferDto) {
    return this.offersService.update(id, updateOfferDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.offersService.remove(id);
  }
}
