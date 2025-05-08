import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BorrowsService } from './borrows.service';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/users.decorators';

@Controller('borrows')
@UseGuards(JwtGuard)
export class BorrowsController {
  constructor(private readonly borrowsService: BorrowsService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MODERATOR')
  async findAll() {
    return await this.borrowsService.findAll();
  }

  @Get('my')
  async findMyBorrows(@CurrentUser() user: any) {
    return await this.borrowsService.findUserBorrows(user.id);
  }

  @Post()
  async borrowBook(@CurrentUser() user: any, @Body('bookId') bookId: number) {
    return await this.borrowsService.borrowBook(user.id, bookId);
  }

  @Patch(':id/return')
  async returnBook(@Param('id') id: string, @CurrentUser() user: any) {
    const borrowId = parseInt(id, 10);
    return await this.borrowsService.returnBook(borrowId, user);
  }
}
