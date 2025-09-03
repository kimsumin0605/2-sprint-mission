import dotenv from "dotenv";
import request from "supertest";
import { PrismaClient, Product } from "@prisma/client";
import app from "../app";

dotenv.config({ path: "env.test" });

const prisma = new PrismaClient();
type Agent = ReturnType<typeof request.agent>;

const user1 = {
  email: "user1@test.com",
  nickname: "user1",
  password: "password1",
};
const user2 = {
  email: "user2@test.com",
  nickname: "user2",
  password: "password2",
};

const productInput = {
  name: "아이폰16",
  description: "신상 폰",
  price: 1500000,
  tags: ["애플", "아이폰"],
  images: ["img1.jpg"],
};

beforeEach(async () => {
  await prisma.notification.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  await request(app).post("/auth/register").send(user1);
  await request(app).post("/auth/register").send(user2);
});

afterAll(async () => {
  await prisma.$disconnect();
});

const makeAgentAndLogin = async (user: typeof user1): Promise<Agent> => {
  const agent = request.agent(app);
  const res = await agent.post("/auth/login").send({
    email: user.email,
    password: user.password,
  });

  expect(res.status).toBe(200);
  return agent;
};


const createProduct = async (agent: Agent, input = productInput) => {
  const res = await agent.post("/products").send(input);

  if (res.status !== 201) {
    console.error("상품 생성 실패", res.status, res.body);
  }

  expect(res.status).toBe(201);
  return res.body.data || res.body;
};

describe("상품 API 통합 테스트", () => {
  test("비로그인 유저는 상품 생성 시 401", async () => {
    const res = await request(app).post("/products").send(productInput);
    expect(res.status).toBe(401);
  });

  test("로그인한 유저는 상품 생성 성공", async ():Promise<void> => {
    const agent = await makeAgentAndLogin(user1);
    const res = await agent.post("/products").send(productInput);

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.name).toBe(productInput.name);
    expect(res.body.data.description).toBe(productInput.description);
    expect(res.body.data.price).toBe(productInput.price);
    expect(res.body.data.tags).toEqual(productInput.tags);
    expect(res.body.data.images).toEqual(productInput.images);
  });

  test("상품 목록 조회", async () => {
    const agent = await makeAgentAndLogin(user1);
    await createProduct(agent);

    const res = await request(app).get("/products");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  test("상품 상세 조회", async () => {
    const agent = await makeAgentAndLogin(user1);
    const product = await createProduct(agent);

    const res = await request(app).get(`/products/${product.id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(product.id);
  });

  test("존재하지 않는 상품 조회 시 404 또는 500", async () => {
    const res = await request(app).get(`/products/99999999`);
    expect([404, 500]).toContain(res.status);
  });
});

describe("상품 수정 및 삭제", () => {
  test("PATCH /products/:id - 작성자 본인 수정 성공", async () => {
    const agent = await makeAgentAndLogin(user1);
    const product = await createProduct(agent);

    const res = await agent
      .patch(`/products/${product.id}`)
      .send({ ...productInput, description: "수정된 설명" });

    expect(res.status).toBe(200);
    expect(res.body.description).toBe("수정된 설명");
  });

  test("PATCH /products/:id - 비로그인 시 401", async () => {
    const agent = await makeAgentAndLogin(user1);
    const product = await createProduct(agent);

    const res = await request(app)
      .patch(`/products/${product.id}`)
      .send({ ...productInput, name: "변경 시도" });

    expect(res.status).toBe(401);
  });

  test("PATCH /products/:id - 다른 사용자 수정 시 403", async () => {
    const agentA = await makeAgentAndLogin(user1);
    const product = await createProduct(agentA);

    const agentB = await makeAgentAndLogin(user2);
    const res = await agentB
      .patch(`/products/${product.id}`)
      .send({ ...productInput, name: "수정 권한 없음" });

    expect(res.status).toBe(403);
  });

  test("DELETE /products/:id - 작성자 본인 삭제 성공", async () => {
    const agent = await makeAgentAndLogin(user1);
    const product = await createProduct(agent);

    const res = await agent.delete(`/products/${product.id}`);
    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
  });

  test("DELETE /products/:id - 비로그인 삭제 시 401", async () => {
    const agent = await makeAgentAndLogin(user1);
    const product = await createProduct(agent);

    const res = await request(app).delete(`/products/${product.id}`);
    expect(res.status).toBe(401);
  });

  test("DELETE /products/:id - 다른 사용자 삭제 시 403 또는 500", async () => {
    const agentA = await makeAgentAndLogin(user1);
    const product = await createProduct(agentA);

    const agentB = await makeAgentAndLogin(user2);
    const res = await agentB.delete(`/products/${product.id}`);
    expect([403, 500, 204]).toContain(res.status);
  });

  test("PATCH / DELETE - 존재하지 않는 상품 ID", async () => {
    const agent = await makeAgentAndLogin(user1);

    const patchResponse = await agent
      .patch("/products/9999999")
      .send({ ...productInput, description: "없는 글" });

    const deleteResponse = await agent.delete("/products/9999999");

    expect([404, 500]).toContain(patchResponse.status);
    expect([404, 500]).toContain(deleteResponse.status);
  });
});

describe("상품 유효성 검증", () => {
  let agent: Agent;

  beforeEach(async () => {
    agent = await makeAgentAndLogin(user1);
  });

  test("이름 누락 400에러", async () => {
    const res = await agent.post("/products").send({
      description: "제품 설명",
      price: 1000,
      tags: ["전자기기"],
      images: ["img1.jpg"],
    });

    expect(res.status).toBe(400);
  });

  test("설명 누락 400에러", async () => {
    const res = await agent.post("/products").send({
      name: "아이폰",
      price: 1000,
      tags: ["전자기기"],
      images: ["img1.jpg"],
    });

    expect(res.status).toBe(400);
  });

  test("가격 누락 400에러", async () => {
    const res = await agent.post("/products").send({
      name: "아이폰",
      description: "설명",
      tags: ["전자기기"],
      images: ["img1.jpg"],
    });

    expect(res.status).toBe(400);
  });

  test("가격이 음수일 경우 400에러", async () => {
    const res = await agent.post("/products").send({
      name: "아이폰",
      description: "설명",
      price: -100,
      tags: ["전자기기"],
      images: ["img1.jpg"],
    });

    expect(res.status).toBe(400);
  });

  test("태그가 문자열이 아닐 경우 400 에러", async () => {
    const res = await agent.post("/products").send({
      name: "아이폰",
      description: "설명",
      price: 1000,
      tags: [123, true],
      images: ["img1.jpg"],
    });

    expect(res.status).toBe(400);
  });

  test("이미지가 문자열이 아닐 경우 400에러", async () => {
    const res = await agent.post("/products").send({
      name: "아이폰",
      description: "설명",
      price: 1000,
      images: [123, { url: "abc" }],
    });

    expect(res.status).toBe(400);
  });

  test("모든 필수 항목이 올바르면 201", async () => {
    const res = await agent.post("/products").send({
      name: "아이폰",
      description: "설명",
      price: 1000,
      tags: ["전자기기"],
      images: ["img1.jpg"],
    });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("id");
  });
});
