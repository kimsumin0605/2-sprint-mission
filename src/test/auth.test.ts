import dotenv from "dotenv";
import request from "supertest";
import { PrismaClient } from "@prisma/client";
import app from "../app";

dotenv.config({ path: "env.test" });

const prisma = new PrismaClient();

const user1 = {
  email: "user1@test.com",
  nickname: "user1",
  password: "password1",
};

beforeEach(async () => {
  await prisma.notification.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

const makeAgentAndLogin = async (user: typeof user1) => {
  const agent = request.agent(app);

  await agent.post("/auth/register").send(user);

  const res = await agent.post("/auth/login").send({
    email: user.email,
    password: user.password,
  });

  expect(res.status).toBe(200);
  return agent;
};

describe("회원가입 및 로그인 테스트", () => {
  test("회원가입 성공", async () => {
    const res = await request(app).post("/auth/register").send(user1);

    expect(res.status).toBe(201);
    expect(res.body.email).toBe(user1.email);
    expect(res.body.nickname).toBe(user1.nickname);
    expect(res.body.password).toBeUndefined();  // 패스워드는 응답에 포함되지 않음
  });

  test("이미 가입된 이메일로 회원가입", async () => {
    await request(app).post("/auth/register").send(user1);

    const res = await request(app).post("/auth/register").send(user1);

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("이미 가입된 이메일입니다");
  });

  test("로그인 성공", async () => {
    const agent = await makeAgentAndLogin(user1);

    const res = await agent.post("/auth/login").send({
      email: user1.email,
      password: user1.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.id).toBeDefined();
    expect(res.body.user.email).toBe(user1.email);
  });

  test("잘못된 비밀번호로 로그인", async () => {
    const agent = request.agent(app);
    const res = await agent.post("/auth/login").send({
      email: user1.email,
      password: "wrongPassword",
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("잘못된 이메일 또는 비밀번호입니다.");
  });

  test("존재하지 않는 이메일로 로그인", async () => {
    const agent = request.agent(app);
    const res = await agent.post("/auth/login").send({
      email: "nonexistent@example.com",
      password: user1.password,
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("잘못된 이메일 또는 비밀번호입니다.");
  });

  test("로그인 후 로그아웃", async () => {
    const agent = await makeAgentAndLogin(user1);

    const res = await agent.post("/auth/logout");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("로그아웃 완료");
  });

});
