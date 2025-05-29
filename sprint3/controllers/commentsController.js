import { db } from 'utils/db.js';
import { assert} from 'superstruct';
import { CreateCommentDto, UpdateCommentDto } from '../dtos/comments.dto.js';
import asyncHandler from 'utils/asyncHandler.js';


export const createComment = asyncHandler(async (req, res) => {
  assert(req.body, CreateCommentDto);

  const { content, boardType, productId, articleId } = req.body;

  const commentData = {
    content,
    boardType,
    ...(boardType === 'Product' && { productId }),
    ...(boardType === 'Article' && { articleId }),
  };

  if (boardType !== 'Product' && boardType !== 'Article') {
    return res.status(400).send({ message: 'Invalid boardType' });
  }

  const newComment = await db.comment.create({
    data: commentData,
  });

  res.status(201).json(newComment);
});


export const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;


  const updatedComment = await db.comment.update({
    where: { id },
    data: { content },
  });

  res.status(200).json(updatedComment);
});


export const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  
  await db.comment.delete({
    where: { id },
  });

  res.status(204).send(); 
});


export const getComments = asyncHandler(async (req, res) => {
  const { limit = 10, boardType, cursor } = req.query;

  const whereConditions = {
    boardType,
    [boardType === 'Product' ? 'productId' : 'articleId']: { not: null },
  };

  const comments = await db.comment.findMany({
    take: limit,
    cursor: cursor ? { createdAt: cursor } : undefined, 
    where: whereConditions,
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json(comments);
});

// 중고마켓 댓글 조회
export const getProductComments = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const comments = await db.comment.findMany({
    where: {
      productId: parseInt(productId),
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.status(200).json(comments);
});

// 자유게시판 댓글 조회
export const getArticleComments = asyncHandler(async (req, res) => {
  const { articleId } = req.params;

  const comments = await db.comment.findMany({
    where: {
      articleId: parseInt(articleId),
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.status(200).json(comments);
});