import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { ProductService } from "../services//productService";
import {
  CreateProductDto,
  UpdateProductDto,
  GetProductListDto,
} from "../dtos/product.dto";

const productService = new ProductService();

export class ProductController {
  async create(req: Request, res: Response) {
    const dto = plainToInstance(CreateProductDto, req.body);
    await validateOrReject(dto);

    const user = req.user!;

    const product = await productService.createProduct({
      ...dto,
      authorId: user.id,
    });

    res.status(201).json({
      message: "상품이 등록되었습니다.",
      data: product,
    });
  }

  async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    const userId = req.user?.id ?? null;

    const product = await productService.getProductById(id, userId);
    res.status(200).json(product);
  }

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    const dto = plainToInstance(UpdateProductDto, req.body);
    await validateOrReject(dto);

    const user = req.user!;

    const updated = await productService.updateProduct(id, dto, user.id);
    res.status(200).json(updated);
  }

  async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    await productService.deleteProduct(id);
    res.status(204).send();
  }

  async getAll(req: Request, res: Response) {
    const dto = plainToInstance(GetProductListDto, req.query);
    await validateOrReject(dto);

    const result = await productService.getAllProducts(dto.page, dto.pageSize);
    res.status(200).json(result);
  }

  async getMine(req: Request, res: Response) {
    const user = req.user!;
    const products = await productService.getMyProducts(user.id);
    res.status(200).json(products);
  }
}
