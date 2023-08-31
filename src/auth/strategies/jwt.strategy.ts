import { Model } from "mongoose";
import { ExtractJwt, Strategy } from "passport-jwt";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { User } from "../../users/schemas/user.schema";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        const user = await this.userModel.findById(payload.uid).exec();
        if (!user) {
            throw new UnauthorizedException('Token not valid');
        }
        if (!user.isActive) {
            throw new UnauthorizedException('User is inactive');
        }
        return user;
    }
}