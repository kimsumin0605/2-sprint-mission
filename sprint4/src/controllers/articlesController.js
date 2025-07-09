import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from '../structs/articlesStructs.js';
import * as articleService from '../services/articleService.js';
import { create } from 'superstruct';
import { IdParamsStruct } from '../structs/commonStructs.js';
import { withAsync } from '../lib/withAsync.js';

export const createArticle = withAsync(async (req, res) => {
  const data = create(req.body, CreateArticleBodyStruct);
  const article = await articleService.createArticle(data, req.user.id);
  res.status(201).json(article);
});

export const getArticle = withAsync(async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const userId = req.user?.id ?? null;
  const article = await articleService.getArticleById(id, userId);
  res.json(article);
});

export const getArticleList = withAsync(async (req, res) => {
  const query = create(req.query, GetArticleListParamsStruct);
  const articles = await articleService.getAllArticles(query);
  res.json(articles);
});

export const updateArticle = withAsync(async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);
  const updated = await articleService.updateArticle(id, data);
  res.json(updated);
});

export const deleteArticle = withAsync(async (req, res) => {
  const { id } = create(req.params, IdParamsStruct);
  await articleService.deleteArticle(id);
  res.status(204).send();
});
