import express from 'express';
import { assert } from 'superstruct';
import { CreateDto, UpdateDto } from './products.dto.js';  // UpdateDto 추가
import { db } from 'utils/db.js';
import { validatePagination } from '../utils/validatePagination.js';
import asyncHandler from 'utils/asyncHandler.js';
import createError from 'http-errors';

const router = express.Router();

// 상품 목록 조회
router
  .route('/')
  .get(
    asyncHandler(async (req, res) => {
      const { offset = 0, limit = 10, order = 'recent', search = '' } = req.query;
       const { parsedOffset, parsedLimit } = validatePagination(offset, limit);

      let orderBy;

      switch (order) {
        case 'oldst':
          orderBy = { createdAt: 'asc' };
          break;
        case 'recent':
        default:
          orderBy = { createdAt: 'desc' };
          break;
      }

      const products = await db.product.findMany({
        skip: parsedOffset,
        take: parsedLimit,
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

      const product = await db.product.findUnique({
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
        throw (createError(404, 'Product not found'));
      }

      res.status(200).send(product);
    })
  )
  // 상품 수정
  .patch(
    asyncHandler(async (req, res) => {
      assert(req.body, UpdateDto);

      const { id } = req.params;

      const updatedProduct = await db.product.update({
        where: { id },
        data: req.body,
      });

      res.status(200).send(updatedProduct);
    })
  );

// 상품 삭제
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deldtedProduct = await db.product.delete({
      where: { id },
    });

    res.status(204).send({ message: "Product deleted successfully" });
  })
);

// 상품 등록
router
  .route("/")
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, CreateDto);

      const { name, description, price, tags } = req.body;

      const newProduct = await db.product.create({
        data: {
          name,
          description,
          price,
          tags,
        },
      });

      res.status(201).send(newProduct);
    })
  );

export default router;