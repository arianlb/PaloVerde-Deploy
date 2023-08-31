import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { Wish, WishSchema } from './schemas/wish.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { OffersModule } from '../offers/offers.module';
import { PicturesModule } from '../pictures/pictures.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [WishesController],
  providers: [WishesService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Wish.name,
        schema: WishSchema,
      }
    ]),
    CloudinaryModule,
    OffersModule,
    PicturesModule,
    UsersModule,
  ],
})
export class WishesModule { }
