import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { BorrowsModule } from './borrows/borrows.module';
import { CoreMOdule } from './modules/core.module';

@Module({
  imports: [AuthModule, UsersModule, BooksModule, BorrowsModule, CoreMOdule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
