import { Model } from 'mongoose';
import Stripe from 'stripe';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { OffersService } from 'src/offers/offers.service';
import { PicturesService } from 'src/pictures/pictures.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './schemas/order.schema';
import { PaginationDto } from '../common/dto/pagination.dto';
import { User } from '../users/schemas/user.schema';
import { Item } from './interfaces/item.interface';
import { Wish } from './interfaces/wish.interface';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger('OrdersService');
  private readonly stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-08-16',
  });
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
    private readonly offersService: OffersService,
    private readonly picturesService: PicturesService,
  ) { }

  async create(user: User, createOrderDto: CreateOrderDto[]): Promise<Order> {
    const wishes: Wish[] = await this.createWishlist(createOrderDto);
    const items: Item[] = this.createItemsForStripe(wishes);

    try {
      const session = await this.stripe.checkout.sessions.create({
        line_items: items,
        mode: 'payment',
        success_url: 'https://paloverdeprint.netlify.app',
        cancel_url: 'https://paloverdeprint.netlify.app',
      });

      const order = {
        createdAt: new Date(),
        paid: session.amount_total,
        status: 'Pending',
        paymentLink: session.url,
        sessionId: session.id,
        user: user._id,
        wishes
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

  async findAllByUser(user: User, paginationDto: PaginationDto): Promise<Order[]> {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.orderModel.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException(`Order with id: '${id}' not found`);
    }
    if (order.status === 'Pending') {
      const { payment_status } = await this.stripe.checkout.sessions.retrieve(order.sessionId);
      if (payment_status === 'paid') {
        order.status = 'Paid';
        order.save();
      }
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true }).exec();
    if (!order) {
      throw new NotFoundException(`Order with id: '${id}' not found`);
    }
    return order;
  }

  async remove(id: string): Promise<string> {
    const order = await this.orderModel.findByIdAndDelete(id).exec();
    if (!order) {
      throw new NotFoundException(`Order with id: '${id}' not found`);
    }
    return `Order with the id: '${id}' was removed`;
  }

  private async createWishlist(createOrderDto: CreateOrderDto[]): Promise<Wish[]> {

    const wishes = await Promise.all(createOrderDto.map(async wish => {
      const [offer, picture] = await Promise.all([
        this.offersService.findOne(wish.offer),
        this.picturesService.findOne(wish.picture),
      ]);
      const price = offer.prices.find(price => price._id == wish.price);
      if (!price) throw new NotFoundException('Price not found');

      return {
        material: offer.material,
        image: picture.url,
        sizePrice: price.value,
        photoPrice: picture.price,
        quantity: wish.quantity,
        size: price.size
      };
    }));

    return wishes;
  }

  private createItemsForStripe(wishes: Wish[]): Item[] {
    return wishes.map(wish => ({
      price_data: {
        product_data: {
          name: wish.material,
          description: 'Print on ' + wish.material,
        },
        currency: 'usd',
        unit_amount: wish.sizePrice + wish.photoPrice,
      },
      quantity: wish.quantity,
    }));
  }

  private handelDBException(error: any): never {
    if (error.code === 11000) {
      throw new BadRequestException(`Order already exists, ${JSON.stringify(error.keyValue)}`);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
