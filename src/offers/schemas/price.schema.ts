import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Price extends Document {
    @Prop({ required: true })
    value: number;

    @Prop({ required: true })
    size: string;
}

export const PriceSchema = SchemaFactory.createForClass(Price);