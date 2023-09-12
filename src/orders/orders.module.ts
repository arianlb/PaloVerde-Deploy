import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { OffersModule } from '../offers/offers.module';
import { PicturesModule } from '../pictures/pictures.module';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './schemas/order.schema';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      }
    ]),
    AuthModule,
    OffersModule,
    PicturesModule,
    UsersModule
  ]
})
export class OrdersModule { }
