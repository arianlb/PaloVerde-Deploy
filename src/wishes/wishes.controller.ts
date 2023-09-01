import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@ApiTags('Wishes')
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createWishDto: CreateWishDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.wishesService.create(createWishDto, file);
  }

  @Get()
  findAll() {
    return this.wishesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.update(id, updateWishDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wishesService.remove(id);
  }
}
