import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { MongooseModule } from '@nestjs/mongoose';
import { OffersModule } from '../offers/offers.module';
import { PicturesModule } from '../pictures/pictures.module';
import { UsersModule } from '../users/users.module';

import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { Wish, WishSchema } from './schemas/wish.schema';

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
    AuthModule
  ],
})
export class WishesModule { }
