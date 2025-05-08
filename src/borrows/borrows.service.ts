import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/database/prisma.service';

@Injectable()
export class BorrowsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.borrow.findMany();
  }

  async findUserBorrows(userId: number) {
    return await this.prisma.borrow.findMany({
      where: { userId },
      include: {
        book: true,
      },
    });
  }

  async borrowBook(userId: number, bookId: number) {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    if (book.available < 1) {
      throw new BadRequestException('Book is not available');
    }
    const borrow = await this.prisma.borrow.create({
      data: {
        userId,
        bookId,
      },
    });
    await this.prisma.book.update({
      where: { id: bookId },
      data: {
        available: book.available - 1,
      },
    });
    return borrow;
  }

  async returnBook(borrowId: number, user: any) {
    const borrow = await this.prisma.borrow.findUnique({
      where: { id: borrowId },
      include: { book: true },
    });
    if (!borrow) {
      throw new NotFoundException('Borrow not found');
    }
    const isOwner = user.id === borrow.userId;
    const check = ['ADMIN', 'MODERATOR'].includes(user.role);
    if (!isOwner && !check) {
      throw new ForbiddenException('You are not allowed to return this book');
    }
    if (borrow.returnDate) {
      throw new BadRequestException('Book already returned');
    }
    await this.prisma.borrow.update({
      where: { id: borrowId },
      data: {
        returnDate: new Date(),
      },
    });
    await this.prisma.book.update({
      where: { id: borrow.bookId },
      data: {
        available: borrow.book.available + 1,
      },
    });
    return { message: 'Book returned successfully' };
  }
}
