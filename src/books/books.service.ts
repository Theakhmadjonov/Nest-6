import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/database/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.book.findMany();
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async create(createBookDto: CreateBookDto) {
    const { title, author, isbn, quantity } = createBookDto;
    return await this.prisma.book.create({
      data: {
        title,
        author,
        isbn,
        quantity,
        available: quantity,
      },
    });
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const existing = await this.prisma.book.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Book not found');
    }
    const updated = await this.prisma.book.update({
      where: { id },
      data: {
        ...updateBookDto,
      },
    });
    return updated;
  }

  async remove(id: number) {
    await this.prisma.book.delete({ where: { id } });
    return { message: 'Book deleted successfully' };
  }
}
