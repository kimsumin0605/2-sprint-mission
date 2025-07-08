import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from '../structs/productsStruct';
import {
  CreateCommentBodyStruct,
  GetCommentListParamsStruct,
} from '../structs/commentsStruct';
import { create } from 'superstruct';
import { IdParamsStruct } from '../structs/commonStructs';
import * as productService from '../services/productService';
import { withAsync } from '../lib/withAsync';
import { Response, Request } from 'express';
import { requireUser } from '../lib/assertUser';

export const createProduct = withAsync(async (req: Request, res: Response) => {
  const productData = create(req.body, CreateProductBodyStruct);
  const user = requireUser(req);
  const newProduct = await productService.createProduct({
    ...productData,
    authorId: user.id,
  });
  res.status(201).json({
    message: '상품이 등록되었습니다.',
    data: newProduct,
  });
});

export const getProduct = withAsync(async (req: Request, res: Response) => {
  const { id } = create(req.params, IdParamsStruct);
  const userId = req.user?.id ?? null;
  const product = await productService.getProductById(id, userId);
  res.send(product);
});

export const updateProduct = withAsync(async (req: Request, res: Response) => {
  const { id } = create(req.params, IdParamsStruct);
  const updateData = create(req.body, UpdateProductBodyStruct);
  const updated = await productService.updateProduct(id, updateData);
  res.send(updated);
});

export const deleteProduct = withAsync(async (req: Request, res: Response) => {
  const { id } = create(req.params, IdParamsStruct);
  await productService.deleteProduct(id);
  res.status(204).send();
});

export const getProductList = withAsync(async (req: Request, res: Response) => {
  const query = create(req.query, GetProductListParamsStruct);
  const result = await productService.getAllProducts(query);
  res.send(result);
});

export const getMyProducts = withAsync(async (req, res) => {
  const user = requireUser(req);
  const products = await productService.getMyProducts(user.id);
  res.status(200).json(products);
});

export const createComment = withAsync(async (req, res) => {
  const user = requireUser(req);
  const { id: productId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);

  const comment = await productService.addCommentToProduct({
    productId,
    content,
    authorId: user.id,
  });

  res.status(201).send(comment);
});

export const getCommentList = withAsync(async (req, res) => {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const result = await productService.getProductComments(productId, cursor, limit);
  res.send(result);
});
