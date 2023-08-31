import { Model } from 'mongoose';
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePictureDto } from './dto/create-picture.dto';
import { UpdatePictureDto } from './dto/update-picture.dto';
import { Picture } from './schemas/picture.schema';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class PicturesService {
  private readonly logger = new Logger('PicturesService');
  constructor(
    @InjectModel(Picture.name)
    private readonly pictureModel: Model<Picture>,
    private readonly cloudinaryService: CloudinaryService
  ) { }

  async create(createPictureDto: CreatePictureDto, file: Express.Multer.File): Promise<Picture> {
    try {
      if (file) {
        const { secure_url } = await this.cloudinaryService.uploadFile(file);
        createPictureDto.url = secure_url;
      }
      return this.pictureModel.create(createPictureDto);

    } catch (error) {
      this.handelDBException(error);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Picture[]> {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.pictureModel.find().limit(limit).skip(offset).exec();
  }

  async findOne(id: string): Promise<Picture> {
    const picture = await this.pictureModel.findById(id).exec();
    if (!picture) {
      throw new BadRequestException(`Picture with id: '${id}' not found`);
    }
    return picture;
  }

  async update(id: string, updatePictureDto: UpdatePictureDto): Promise<Picture> {
    const picture = await this.pictureModel.findByIdAndUpdate(id, updatePictureDto, { new: true }).exec();
    if (!picture) {
      throw new BadRequestException(`Picture with id: '${id}' not found`);
    }
    return picture;
  }

  async remove(id: string): Promise<string> {
    const picture = await this.findOne(id);

    //TODO: Hacer esto mejor
    if (picture.url !== 'No_image') {
      const publicId = picture.url.split('/').pop().split('.')[0];
      await this.cloudinaryService.deleteFile(publicId);
    }

    await this.pictureModel.findByIdAndDelete(id).exec();
    return `Picture with the id: '${id}' was removed`;
  }

  private handelDBException(error: any): never {
    if (error.code === 11000) {
      throw new BadRequestException(`Picture already exists, ${JSON.stringify(error.keyValue)}`);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
