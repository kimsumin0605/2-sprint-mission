export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  tags: string[];
  images?: string[];
  authorId: number;
}
