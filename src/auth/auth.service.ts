import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from '../users/schemas/user.schema';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService
  ) { }

  async register(createAuthDto: CreateAuthDto) {
    try {
      createAuthDto.password = bcrypt.hashSync(createAuthDto.password, 10);
      const user = await this.userModel.create(createAuthDto);
      return {
        user,
        token: this.generateJWT({ uid: user._id })
      };

    } catch (error) {
      this.handelDBException(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userModel.findOne({ email }).exec();
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid');
    }
    return {
      user,
      token: this.generateJWT({ uid: user._id })
    };
  }

  async checkAuthStatus(user: User) {
    return {
      user,
      token: this.generateJWT({ uid: user._id })
    };
  }

  private generateJWT(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  private handelDBException(error: any): never {
    if (error.code === 11000) {
      throw new BadRequestException(`User already exists, ${JSON.stringify(error.keyValue)}`);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}

