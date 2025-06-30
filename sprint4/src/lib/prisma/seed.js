import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { USERS, PRODUCTS, ARTICLES, COMMENTS } from "./mock.js";

const prisma = new PrismaClient();

async function main() {
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // 유저 비밀번호 해싱
  const usersWithHashedPasswords = await Promise.all(
    USERS.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    }))
  );
  await prisma.user.createMany({ data: usersWithHashedPasswords });

  await prisma.product.createMany({ data: PRODUCTS });
  await prisma.article.createMany({ data: ARTICLES });
  await prisma.comment.createMany({ data: COMMENTS });

  console.log(" Seed data inserted successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
