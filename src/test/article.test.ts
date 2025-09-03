import dotenv from "dotenv";
import request from "supertest";
import { PrismaClient } from "@prisma/client";
import app from "../app";

dotenv.config({ path: ".env.test" });

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

const articleInput = {
  title: "테스트 제목",
  content: "테스트 본문",
};

beforeAll(async () => {
  await prisma.notification.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  /** 테스트 유저 등록 **/
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
  expect(res.status).toBe(200); // 로그인 성공

  return agent;
};

/** 게시글 생성 */
const createArticle = async (agent: Agent, input = articleInput) => {
  const res = await agent.post("/articles").send(input);
  if (res.status !== 201) {
    console.error("게시글 생성 실패", res.status, res.body);
  }
  expect(res.status).toBe(201);
  return res.body;
};

describe("게시글 API 통합 테스트", () => {
  test("비로그인 유저는 게시글 생성 시 401", async () => {
    const res = await request(app).post("/articles").send(articleInput);
    expect(res.status).toBe(401);
  });

  test("로그인한 유저는 게시글 생성 성공", async () => {
    const agent = await makeAgentAndLogin(user1);
    const res = await agent.post("/articles").send(articleInput);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe(articleInput.title);
  });

  test("게시글 목록 조회", async () => {
    const agent = await makeAgentAndLogin(user1);
    await createArticle(agent);

    const res = await request(app).get("/articles");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  test("게시글 상세 조회", async () => {
    const agent = await makeAgentAndLogin(user1);
    const created = await createArticle(agent);

    const res = await request(app).get(`/articles/${created.id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(created.id);
  });
});

describe("게시글 수정 및 삭제", () => {
  test("PATCH /articles/:id - 작성자 본인 수정 성공", async () => {
    const agent = await makeAgentAndLogin(user1);
    const created = await createArticle(agent);

    const res = await agent
      .patch(`/articles/${created.id}`)
      .send({ ...articleInput, title: "수정된 제목" });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("수정된 제목");
  });

  test("PATCH /articles/:id - 비로그인 시 401", async () => {
    const agent = await makeAgentAndLogin(user1);
    const created = await createArticle(agent);

    const res = await request(app)
      .patch(`/articles/${created.id}`)
      .send({ ...articleInput, title: "변경 시도" });

    expect(res.status).toBe(401);
  });

  test("PATCH /articles/:id - 다른 사용자 수정 시 403 또는 500", async () => {
    const agentA = await makeAgentAndLogin(user1);
    const created = await createArticle(agentA);

    const agentB = await makeAgentAndLogin(user2);
    const res = await agentB
      .patch(`/articles/${created.id}`)
      .send({ ...articleInput, title: "불법 수정" });

    expect([403, 500]).toContain(res.status);
  });

  test("DELETE /articles/:id - 작성자 본인 삭제 성공", async () => {
    const agent = await makeAgentAndLogin(user1);
    const created = await createArticle(agent);

    const res = await agent.delete(`/articles/${created.id}`);
    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
  });

  test("DELETE /articles/:id - 비로그인 삭제 시 401", async () => {
    const agent = await makeAgentAndLogin(user1);
    const created = await createArticle(agent);

    const res = await request(app).delete(`/articles/${created.id}`);
    expect(res.status).toBe(401);
  });

  test("DELETE /articles/:id - 다른 사용자 삭제 시 403 또는 500", async () => {
    const agentA = await makeAgentAndLogin(user1);
    const created = await createArticle(agentA);

    const agentB = await makeAgentAndLogin(user2);
    const res = await agentB.delete(`/articles/${created.id}`);
    expect([403, 500]).toContain(res.status);
  });

  test("PATCH / DELETE - 존재하지 않는 게시글 ID", async () => {
    const agent = await makeAgentAndLogin(user1);

    const patchResponse = await agent
      .patch("/articles/9999999")
      .send({ ...articleInput, title: "없는 글" });

    const deleteResponse = await agent.delete("/articles/9999999");

    expect([404, 500]).toContain(patchResponse.status);
    expect([404, 500]).toContain(deleteResponse.status);
  });
});

describe("게시글 유효성 검증", () => {
  let agent: Agent;

  beforeEach(async () => {
    agent = await makeAgentAndLogin(user1);
  });

  test("title 누락 400에러", async () => {
    const res = await agent.post("/articles").send({
      content: "테스트 본문",
    });

    expect(res.status).toBe(400);
  });

  test("content 누락 400에러", async () => {
    const res = await agent.post("/articles").send({
      title: "아이폰 16pro",
    });

    expect(res.status).toBe(400);
  });

  test("모든 필수 항목이 올바르면 201", async () => {
    const res = await agent.post("/articles").send({
      title: "아이폰 16pro",
      content: "테스트 본문",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });
});