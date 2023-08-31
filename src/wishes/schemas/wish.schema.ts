import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from "mongoose";

@Schema()
export class Wish extends Document {
    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop()
    material: string;

    @Prop({ required: true })
    image: string;

    @Prop({ default: true })
    ownImage: boolean;

    @Prop({ default: 0 })
    sizePrice: number;

    @Prop({ default: 0 })
    photoPrice: number;

    @Prop({ default: 1 })
    amount: number;

    @Prop({ required: true })
    size: string;
}

export const WishSchema = SchemaFactory.createForClass(Wish);