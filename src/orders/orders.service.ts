import { Model } from 'mongoose';
import Stripe from 'stripe';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './schemas/order.schema';
import { PaginationDto } from '../common/dto/pagination.dto';
import { User } from '../users/schemas/user.schema';
import { Item } from './interfaces/item.interface';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger('OrdersService');
  private readonly stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-08-16',
  });
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) { }

  async create(user: User): Promise<Order> {
    try {
      const { wishes } = await this.userModel.findById(user._id, 'wishes').populate('wishes').exec();
      const items: Item[] = wishes.map(wish => ({
        price_data: {
          product_data: {
            name: wish.material,
            description: 'Print on ' + wish.material,
          },
          currency: 'usd',
          unit_amount: (wish.sizePrice + wish.photoPrice) * 100,
        },
        quantity: wish.amount,
      }));

      const session = await this.stripe.checkout.sessions.create({
        line_items: items,
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
      });

      const order = {
        createdAt: new Date(),
        paid: session.amount_total / 100,
        status: 'Pending',
        paymentLink: session.url,
        user: user._id,
        wishes: wishes.map(wish => wish._id),
      };
      return this.orderModel.create(order);

    } catch (error) {
      this.handelDBException(error);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Order[]> {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.orderModel.find().limit(limit).skip(offset).exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new BadRequestException(`Order with id: '${id}' not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true }).exec();
    if (!order) {
      throw new BadRequestException(`Order with id: '${id}' not found`);
    }
    return order;
  }

  async remove(id: string): Promise<string> {
    const order = await this.orderModel.findByIdAndDelete(id).exec();
    if (!order) {
      throw new BadRequestException(`Order with id: '${id}' not found`);
    }
    return `Order with the id: '${id}' was removed`;
  }

  private handelDBException(error: any): never {
    if (error.code === 11000) {
      throw new BadRequestException(`Order already exists, ${JSON.stringify(error.keyValue)}`);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
