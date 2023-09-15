import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from "mongoose";
import { User } from '../../users/schemas/user.schema';
import { Wish, WishSchema } from './wish.schema';

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

    @Prop({ required: true })
    sessionId: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;

    @Prop([WishSchema])
    wishes: Wish[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.methods.toJSON = function () {
    const { __v, sessionId, user, ...order } = this.toObject();
    return order;
}