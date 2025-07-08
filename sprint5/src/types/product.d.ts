export type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  tags: string[];
  images?: string[];
  authorId: number;
}