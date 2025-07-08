import passport from './passport';
import { commentRepository } from '../repositories/commentRepository';
import { productRepository } from '../repositories/productRepository';
import { articleRepository } from '../repositories/articleRepository';
import { withAsync } from '../lib/withAsync';
import { Response, Request, NextFunction } from 'express';


const verifyAccessToken = passport.authenticate('access-token', { session: false });

function createVerifyAuth<T extends { authorId: number }>(
  entityName: string,
  getEntity: (id: number) => Promise<T | null>
) {
  return withAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id, 10);
    const entity = await getEntity(id);

    if (!entity) {
      res.status(404).json({ message: `${entityName}을 찾을 수 없습니다.` });
      return;
    }
    if (!req.user) {
      res.status(401).json({ message: '로그인이 필요합니다.' });
      return;
    }
    if (entity.authorId !== req.user.id) {
      res.status(403).json({ message: '권한이 없습니다.' });
      return;
    }
    next();
  });
}

const verifyArticleAuth = createVerifyAuth('게시글', articleRepository.getById);
const verifyCommentAuth = createVerifyAuth('댓글', commentRepository.getById);
const verifyProductAuth = createVerifyAuth('상품', productRepository.getById);

export const authenticate = {
  verifyAccessToken,
  verifyCommentAuth,
  verifyProductAuth,
  verifyArticleAuth,
};
