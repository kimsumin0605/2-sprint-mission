import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from '../structs/articlesStructs';
import * as articleService from '../services/articleService';
import { create } from 'superstruct';
import { IdParamsStruct } from '../structs/commonStructs';
import { withAsync } from '../lib/withAsync';
import { Request, Response } from 'express';
import { ArticleWithLike } from '../types/article';
import { requireUser } from '../lib/assertUser';


export const createArticle = withAsync(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const data = create(req.body, CreateArticleBodyStruct);
  const article = await articleService.createArticle(data, user.id);
  res.status(201).json(article);
});

export const getArticle = withAsync(async (req: Request, res: Response) => {
  const { id } = create(req.params, IdParamsStruct);
  const user = requireUser(req);
  const article: ArticleWithLike = await articleService.getArticleById(id, user.id);
  res.json(article);
});

export const getArticleList = withAsync(async (req: Request, res: Response) => {
  const query = create(req.query, GetArticleListParamsStruct);
  const articles = await articleService.getAllArticles(query);
  res.json(articles);
});

export const updateArticle = withAsync(async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const updateData = create(req.body, UpdateArticleBodyStruct);
  const user = requireUser(req); 

  const updated = await articleService.updateArticle(id, updateData, user.id);
  res.send(updated);
})

export const deleteArticle = withAsync(async (req: Request, res: Response) => {
  const { id } = create(req.params, IdParamsStruct);
  await articleService.deleteArticle(id);
  res.status(204).send();
});
