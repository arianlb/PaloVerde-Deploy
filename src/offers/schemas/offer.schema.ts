import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from "mongoose";

@Schema()
export class Offer extends Document {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    material: string;

    @Prop({ default: 'No_image' })
    image: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: 0 })
    price: number;

    @Prop({ default: 0 })
    discount: number;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);