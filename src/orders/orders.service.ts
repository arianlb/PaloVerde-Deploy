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

      const orderDto = {
        createdAt: new Date(),
        paid: 0,
        status: 'Pending',
        paymentLink: 'No yet',
        sessionId: 'No yet',
        user: user._id,
        wishes
      };

      const order = await this.orderModel.create(orderDto);

      const session = await this.stripe.checkout.sessions.create({
        line_items: items,
        mode: 'payment',
        success_url: `https://paloverdeprint.netlify.app/order/${order._id}`,
        cancel_url: 'https://paloverdeprint.netlify.app/order',
      });

      order.paid = session.amount_total;
      order.paymentLink = session.url;
      order.sessionId = session.id;
      return order.save();

      /*const order = {
        createdAt: new Date(),
        paid: session.amount_total,
        status: 'Pending',
        paymentLink: session.url,
        sessionId: session.id,
        user: user._id,
        wishes
      };
      return this.orderModel.create(order);*/

    } catch (error) {
      this.handelDBException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, page = 1 } = paginationDto;
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      this.orderModel.find().skip(skip).limit(limit).exec(),
      this.orderModel.countDocuments()
    ]);
    if (!orders.length) {
      throw new NotFoundException('No orders found');
    }
    return {
      data: orders,
      totalPages: Math.ceil(total / limit)
    }
  }

  async findAllByUser(user: User, paginationDto: PaginationDto) {
    const { limit = 10, page = 1 } = paginationDto;
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      this.orderModel.find({ user: user._id }, { wishes: 0 })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.orderModel.countDocuments({ user: user._id })
    ]);
    return {
      data: orders,
      totalPages: Math.ceil(total / limit)
    }
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

      return {
        material: offer.title,
        image: picture.url,
        price: Math.ceil(wish.height * wish.width) * offer.price,
        discount: offer.discount,
        photoPrice: picture.price,
        quantity: wish.quantity,
        size: `${wish.height}Hx${wish.width}W`
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
        unit_amount: (wish.price - Math.ceil((wish.price * wish.discount) * 0.01)) + wish.photoPrice,
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
