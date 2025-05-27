import express from "express";
import { PrismaClient } from "@prisma/client";
import { assert } from 'superstruct';
import { CreateDto, UpdateDto } from './articles.dto.js';
import asyncHandler from "utils/asyncHandler.js";

const Prisma = new PrismaClient();
const router = express.Router();

//게시글 목록 조회
router
  .route('/')
  .get(
    asyncHandler(async (req, res) => {
      const { offset = 0, limit = 10, order = 'recent', search = '' } = req.query;
      let orderBy = { createdAt: 'desc' };
      if (order === 'oldst') {
        orderBy = { createdAt: 'asc' };
      }
      const articles = await Prisma.article.findMany({
        skip: parseInt(offset),
        take: parseInt(limit),
        orderBy,
        where: {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
            { tags: { hasSome: search.split(',') } },
          ],
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
      });
      res.status(200).send(articles);
    })
  )
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, CreateDto);
      const { title, content } = req.body;
      const article = await Prisma.article.create({
        data: { title, content },
      });

      res.status(200).send(article);
    })
  );
  //상세 조회
  router
  .route('/:id')
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;

      const article = await Prisma.article.findUnique({
        where: { id: params(id)},
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
        },
      });
      if (!article) {
        return res.status(404).send({ message: 'Article not found' });
      }
      res.status(200).send(article);
    })
  );
  //게시글 수정
router
  .route("/:id")
  .patch(
    asyncHandler(async (req, res) => {
      assert(req.body, UpdateDto); 

      const { id } = req.params;
      const { title, content } = req.body;

      const updatedArticle = await Prisma.article.update({
        where: { id: parseInt(id) },
        data: { title, content },
      });

      res.status(200).send(updatedArticle);
    })
  );
  //게시글 삭제
router
  .route("/:id")
  .delete(
    asyncHandler(async (req, res) => {
      const { id } = req.params;

      // Prisma로 해당 ID에 맞는 게시글 삭제
      await Prisma.article.delete({
        where: { id: parseInt(id) },
      });

      res.status(200).send({ message: "Article deleted successfully" });
    })
  );
  

