import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Picture extends Document {
    @Prop({ default: 'No_image' })
    url: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    own: boolean;
}

export const PictureSchema = SchemaFactory.createForClass(Picture);
