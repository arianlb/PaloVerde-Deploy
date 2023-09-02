import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, Post, Body, HttpCode, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from '../users/schemas/user.schema';
import { Auth } from './decorators/auth.decorator';
import { ValidRoles } from './interfaces/valid-roles';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  registerUser(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @HttpCode(200)
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('session')
  @Auth()
  getSession(@GetUser() user: User) {
    return user;
  }

  @Get('check')
  @Auth()
  check(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  /*@Get('test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    return user;
  }

  @Get('test2')
  @Auth(ValidRoles.admin, ValidRoles.user)
  test2(@GetUser() user: User) {
    return user;
  }*/

}
