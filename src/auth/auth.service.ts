import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { RegisterDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findUserByEmail(email);
    if (user?.password === password) {
      const { password, ...result } = user;
      const access_token = await this.jwtService.signAsync(result);
      return { access_token, user };
    }
    throw new UnauthorizedException();
  }

  async register(body: RegisterDto) {
    const findUser = await this.usersService.findUserByEmail(body.email);
    if (findUser) throw new BadRequestException('User already exists');
    const hashedPassword = await bcrypt.hash(body.password, 12);
    const user = { ...body, password: hashedPassword };
    const newUser = await this.prisma.user.create({ data: user });
    const { password, ...result } = user;
    const access_token = await this.jwtService.signAsync(result);
    return { access_token, newUser };
  }

  async getUserProfile(id: string) {
    return await this.prisma.user.findFirst({ where: { id: +id } });
  }
}
