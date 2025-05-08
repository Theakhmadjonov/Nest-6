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
    try {
      return await this.borrowsService.findAll();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('my')
  async findMyBorrows(@CurrentUser() user: any) {
    try {
      return await this.borrowsService.findUserBorrows(user.id);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async borrowBook(@CurrentUser() user: any, @Body('bookId') bookId: number) {
    try {
      return await this.borrowsService.borrowBook(user.id, bookId);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id/return')
  async returnBook(@Param('id') id: string, @CurrentUser() user: any) {
    try {
      const borrowId = +id;
      return await this.borrowsService.returnBook(borrowId, user);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
