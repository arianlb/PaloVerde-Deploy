import { Model } from 'mongoose';
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Offer } from './schemas/offer.schema';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PaginationOfferDto } from './dto/pagination-offer.dto';

@Injectable()
export class OffersService {
  private readonly logger = new Logger('OffersService');
  constructor(
    @InjectModel(Offer.name)
    private readonly offerModel: Model<Offer>,
    private readonly cloudinaryService: CloudinaryService
  ) { }

  async create(createOfferDto: CreateOfferDto, file: Express.Multer.File): Promise<Offer> {
    try {
      if (file) {
        const { secure_url } = await this.cloudinaryService.uploadFile(file);
        createOfferDto.image = secure_url;
      }
      return this.offerModel.create(createOfferDto);

    } catch (error) {
      this.handelDBException(error);
    }
  }

  async findAll(paginationOfferDto: PaginationOfferDto, isClient: boolean = true) {
    const { limit = 10, page = 1, material = 'Paper' } = paginationOfferDto;
    const skip = (page - 1) * limit;
    const [offers, total] = await Promise.all([
      isClient
        ? this.offerModel.find({ isActive: true, material }).skip(skip).limit(limit).exec()
        : this.offerModel.find({ material }).skip(skip).limit(limit).exec(),
      isClient
        ? this.offerModel.countDocuments({ isActive: true, material })
        : this.offerModel.countDocuments({ material })
    ]);
    if (!offers.length) {
      throw new NotFoundException('No offers found');
    }
    return {
      data: offers,
      totalPages: Math.ceil(total / limit)
    }
  }

  async findOne(id: string, isClient: boolean = true): Promise<Offer> {
    const offer = await this.offerModel.findById(id).exec();
    if (!offer) {
      throw new NotFoundException(`Offer with id: '${id}' not found`);
    }
    if (isClient && !offer.isActive) {
      throw new BadRequestException(`Offer with id: '${id}' is not active`);
    }
    return offer;
  }

  async update(id: string, updateOfferDto: UpdateOfferDto): Promise<Offer> {
    const offer = await this.offerModel.findByIdAndUpdate(id, updateOfferDto, { new: true }).exec();
    if (!offer) {
      throw new NotFoundException(`Offer with id: '${id}' not found`);
    }
    return offer;
  }

  async remove(id: string) {
    const offer = await this.findOne(id);

    if (offer.image !== 'No_image') {
      const publicId = offer.image.split('/').pop().split('.')[0];
      await this.cloudinaryService.deleteFile(publicId);
    }

    await this.offerModel.findByIdAndDelete(id).exec();

    return `Offer with the id: '${id}' was removed`;
  }

  private handelDBException(error: any): never {
    if (error.code === 11000) {
      throw new BadRequestException(`Offer already exists, ${JSON.stringify(error.keyValue)}`);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
