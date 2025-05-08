# NestJS Authorization va Guards Loyihasi

## Loyiha tavsifi

Oddiy "Kutubxona boshqaruv tizimi" yaratilib, unda foydalanuvchilar (admin, moderator, foydalanuvchi) roli asosida turli xil funksionallikga ega bo'ladi. Tizimda kitoblar, foydalanuvchilar va kitob olingan/qaytarilgan tarixini boshqarish mumkin.

## Database Schema

```prisma
// prisma/schema.prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  borrows   Borrow[]
}

model Book {
  id          Int      @id @default(autoincrement())
  title       String
  author      String
  isbn        String   @unique
  quantity    Int      @default(1)
  available   Int      @default(1)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  borrows     Borrow[]
}

model Borrow {
  id         Int       @id @default(autoincrement())
  user       User      @relation(fields: [userId], references: [id])
  userId     Int
  book       Book      @relation(fields: [bookId], references: [id])
  bookId     Int
  borrowDate DateTime  @default(now())
  returnDate DateTime?
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
}

enum Role {
  ADMIN
  MODERATOR
  USER
}
```

## API Endpointlar


### Borrows Management  

| Endpoint              | Method | Vazifa                              | Request Body | Response                                         | Access                                  |
| --------------------- | ------ | ----------------------------------- | ------------ | ------------------------------------------------ | --------------------------------------- |
| `/borrows`            | GET    | Barcha olingan kitoblar             | -            | `[{id, userId, bookId, borrowDate, returnDate}]` | Admin, Moderator                        |
| `/borrows/my`         | GET    | Foydalanuvchining olingan kitoblari | -            | `[{id, bookId, book, borrowDate, returnDate}]`   | Authenticated                           |
| `/borrows`            | POST   | Kitob olish                         | `{bookId}`   | `{id, userId, bookId, borrowDate}`               | Authenticated                           |
| `/borrows/:id/return` | PATCH  | Kitobni qaytarish                   | -            | `{id, userId, bookId, borrowDate, returnDate}`   | Authenticated (Owner), Admin, Moderator |

