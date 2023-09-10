import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from "mongoose";
import { User } from '../../users/schemas/user.schema';
import { Wish } from '../../wishes/schemas/wish.schema';

@Schema()
export class Order extends Document {
    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ default: 0 })
    paid: number;

    @Prop({ default: 'Pending' })
    status: string;

    @Prop({ required: true })
    paymentLink: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Wish' }] })
    wishes: Wish[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);