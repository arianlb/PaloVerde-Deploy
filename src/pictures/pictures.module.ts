import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PicturesService } from './pictures.service';
import { PicturesController } from './pictures.controller';
import { Picture, PictureSchema } from './schemas/picture.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  controllers: [PicturesController],
  providers: [PicturesService],
  exports: [PicturesService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Picture.name,
        schema: PictureSchema
      }
    ]),
    CloudinaryModule
  ],
})
export class PicturesModule { }
