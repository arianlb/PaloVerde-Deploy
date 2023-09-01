import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from "mongoose";
import { Wish } from '../../wishes/schemas/wish.schema';

@Schema()
export class User extends Document {
    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({
        type: [String],
        default: ['ROLE_USER']
    })
    roles: string[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Wish' }] })
    wishes: Wish[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.toJSON = function () {
    const { __v, password, isActive, wishes, ...user } = this.toObject();
    return user;
}