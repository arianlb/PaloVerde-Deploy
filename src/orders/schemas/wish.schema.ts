import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from "mongoose";

@Schema()
export class Wish extends Document {
    @Prop()
    material: string;

    @Prop({ required: true })
    image: string;

    @Prop({ default: 0 })
    price: number;

    @Prop({ default: 0 })
    discount: number;

    @Prop({ default: 0 })
    photoPrice: number;

    @Prop({ default: 1 })
    quantity: number;

    @Prop({ required: true })
    size: string;
}

export const WishSchema = SchemaFactory.createForClass(Wish);