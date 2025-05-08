import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/modules/database/prisma.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];
    const data = await this.jwtService.verifyAsync(token);
    const findUSer = await this.prisma.user.findFirst({
      where: { email: data.email },
    });
    if (!findUSer) throw new NotFoundException('User not found');
    request.user = data;
    return true;
  }
}
