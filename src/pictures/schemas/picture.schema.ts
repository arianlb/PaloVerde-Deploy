import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Picture extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ default: 'No_image' })
    url: string;

    @Prop({ required: true })
    price: number;
}

export const PictureSchema = SchemaFactory.createForClass(Picture);
