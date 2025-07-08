import { Article } from "@prisma/client"

export interface ArticleWithLike extends Partial<Article> {
  isLiked: boolean;
}

export type ArticleOrder = 'recent' | 'oldest'

export type ArticleListQuery = {
  skip?: number;
  take?: number;
  orderBy?: ArticleOrder;
  keyword?: string;
};

