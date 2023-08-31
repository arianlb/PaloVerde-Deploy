import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PicturesService } from './pictures.service';
import { CreatePictureDto } from './dto/create-picture.dto';
import { UpdatePictureDto } from './dto/update-picture.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Pictures')
@Controller('pictures')
export class PicturesController {
  constructor(
    private readonly picturesService: PicturesService
  ) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createPictureDto: CreatePictureDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.picturesService.create(createPictureDto, file);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.picturesService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.picturesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseMongoIdPipe) id: string, @Body() updatePictureDto: UpdatePictureDto) {
    return this.picturesService.update(id, updatePictureDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.picturesService.remove(id);
  }
}
