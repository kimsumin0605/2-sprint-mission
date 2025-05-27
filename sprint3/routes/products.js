import express from 'express';
import { assert } from 'superstruct';
import { CreateDto, UpdateDto } from './products.dto.js';  // UpdateDto 추가
import { PrismaClient } from '@prisma/client';
import asyncHandler from 'utils/asyncHandler.js';

const prisma = new PrismaClient();
const router = express.Router();

// 상품 목록 조회
router
  .route('/')
  .get(
    asyncHandler(async (req, res) => {
      const { offset = 0, limit = 10, order = 'recent', search = '' } = req.query;
      let orderBy = { createdAt: 'desc' };
      if (order === 'oldst') {
        orderBy = { createdAt: 'asc' };
      }
      const products = await prisma.product.findMany({
        skip: parseInt(offset),
        take: parseInt(limit),
        orderBy,
        where: {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { tags: { hasSome: search.split(',') } },
          ],
        },
        select: {
          id: true,
          name: true,
          price: true,
          createdAt: true,
        },
      });
      res.status(200).send(products);
    })
  );

// 상품 상세 조회
router
  .route("/:id")
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const product = await prisma.product.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          tags: true,
          createdAt: true,
        },
      });

      if (!product) {
        return res.status(404).send({ message: "Product not found" });
      }

      res.status(200).send(product);
    })
  )
  // 상품 수정
  .patch(
    asyncHandler(async (req, res) => {
      assert(req.body, UpdateDto);  // UpdateDto 사용
      const { id } = req.params;
      const { name, description, price, tags } = req.body;
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: { name, description, price, tags },
      });

      res.status(200).send(updatedProduct);
    })
  )
  // 상품 삭제
  .delete(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      await prisma.product.delete({
        where: { id },
      });

      res.status(200).send({ message: "Product deleted successfully" });
    })
  );

// 상품 등록
router
  .route("/")
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, CreateDto);  // CreateDto 사용

      const { name, description, price, tags } = req.body;
      const newProduct = await prisma.product.create({
        data: {
          name,
          description,
          price,
          tags,
        },
      });

      res.status(201).send(newProduct); // 201 상태 코드로 상품이 생성되었음을 알림
    })
  );

export default router;