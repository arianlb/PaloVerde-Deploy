import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from "mongoose";

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
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.toJSON = function () {
    const { __v, password, isActive, ...user } = this.toObject();
    return user;
}