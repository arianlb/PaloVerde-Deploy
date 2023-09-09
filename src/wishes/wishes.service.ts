import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './schemas/wish.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { OffersService } from '../offers/offers.service';
import { PicturesService } from '../pictures/pictures.service';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class WishesService {
  constructor(
    @InjectModel(Wish.name)
    private readonly wishModel: Model<Wish>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly offersService: OffersService,
    private readonly picturesService: PicturesService,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) { }

  async create(user: User, createWishDto: CreateWishDto, file: Express.Multer.File): Promise<Wish> {
    const offer = await this.offersService.findOne(createWishDto.offer);
    const price = offer.prices.find(price => price._id == createWishDto.price);
    if (!price) throw new NotFoundException('Price not found');

    const wishDto = {
      createdAt: new Date(),
      material: offer.material,
      image: null,
      ownImage: file ? true : false,
      sizePrice: price.value,
      photoPrice: 0,
      amount: createWishDto.amount,
      size: price.size
    };

    if (file) {
      const { secure_url } = await this.cloudinaryService.uploadFile(file);
      wishDto.image = secure_url;

    } else {
      const picture = await this.picturesService.findOne(createWishDto.picture);
      wishDto.image = picture.url;
      wishDto.photoPrice = picture.price;
    }

    const wish = await this.wishModel.create(wishDto);
    user.wishes.push(wish);
    await user.save();
    return wish;
  }

  async findAll(uid: string) {
    const user = await this.userModel.findById(uid, 'wishes').populate('wishes').exec();
    return user.wishes;
  }

  async findOne(id: string) {
    const wish = await this.wishModel.findById(id).exec();
    if (!wish) throw new NotFoundException(`Wish with id: '${id}' not found`);
    return wish;
  }

  async update(id: string, updateWishDto: UpdateWishDto) {
    const wish = await this.wishModel.findByIdAndUpdate(id, updateWishDto, { new: true }).exec();
    if (!wish) throw new NotFoundException(`Wish with id: '${id}' not found`);
    return wish;
  }

  async remove(id: string) {
    const wish = await this.findOne(id);
    if (wish.ownImage) {
      const publicId = wish.image.split('/').pop().split('.')[0];
      await this.cloudinaryService.deleteFile(publicId);
    }
    await this.wishModel.findByIdAndDelete(id).exec();
    return `Wish with the id: '${id}' was removed`;
  }
}
