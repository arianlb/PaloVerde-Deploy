import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './schemas/order.schema';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger('OrdersService');
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>
  ) { }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      createOrderDto.createdAt = new Date();
      return this.orderModel.create(createOrderDto);

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
