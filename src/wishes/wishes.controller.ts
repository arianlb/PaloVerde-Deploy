import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/schemas/user.schema';

@ApiTags('Wishes')
@ApiBearerAuth()
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) { }

  @Post()
  @Auth()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @GetUser() user: User,
    @Body() createWishDto: CreateWishDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.wishesService.create(user, createWishDto, file);
  }

  @Get()
  @Auth()
  findAll(@GetUser() user: User) {
    return this.wishesService.findAll(user._id);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  update(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.update(id, updateWishDto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.wishesService.remove(id);
  }
}
