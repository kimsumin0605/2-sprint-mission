import { db } from 'utils/db';
import { assert } from 'superstruct';
import { CreateArticleDto, UpdateArticleDto } from 'dtos/articles.dto';
import { validatePagination } from 'utils/validatePagination';
import asyncHandler from 'utils/asyncHandler';

export const getArticles = asyncHandler(async (req, res) => {
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
        case 'updated':
          orderBy = { updatedAt: 'desc' }; 
          break;
      }

  const articles = await db.article.findMany({
    skip: parsedOffset,
    take: parsedLimit,
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

  res.status(200).json(articles);
});

// 게시글 상세 조회
export const getArticleById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const article = await db.article.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });

  if (!article) {
    throw createError(404, 'Article not found'); 
  }

  res.status(200).json(article);
});

// 게시글 등록
export const createArticle = asyncHandler(async (req, res) => {
  assert(req.body, CreateArticleDto);

  const { title, content } = req.body;

  const article = await db.article.create({
    data: { title, content },
  });

  res.status(201).json(article);
});

// 게시글 수정
export const updateArticle = asyncHandler(async (req, res) => {
  assert(req.body, UpdateArticleDto);

  const { id } = req.params;
  const { title, content } = req.body;

  const updatedArticle = await db.article.update({
    where: { id: parseInt(id) },
    data: { title, content },
  });

  res.status(200).json(updatedArticle);
});

// 게시글 삭제
export const deleteArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await db.article.delete({
    where: { id: parseInt(id) },
  });

  res.status(200).send({ message: 'Article deleted successfully' });
});