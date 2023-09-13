import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from "mongoose";
import { Price, PriceSchema } from './price.schema';

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

    @Prop([PriceSchema])
    prices: Price[];
}

export const OfferSchema = SchemaFactory.createForClass(Offer);