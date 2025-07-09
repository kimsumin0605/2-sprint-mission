import passport from '../middlewares/passport.js';
import { commentRepository } from '../repositories/commentRepository.js';
import { productRepository } from '../repositories/productRepository.js';
import { articleRepository } from '../repositories/articleRepository.js';
import { withAsync } from '../lib/withAsync.js';

const verifyAccessToken = passport.authenticate('access-token', { session: false });

const verifyCommentAuth = withAsync(async (req, res, next) => {
  const commentId = parseInt(req.params.id, 10);
  const comment = await commentRepository.getById(commentId);
  if (!comment) {
    return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
  }
  if (comment.authorId !== req.user.id) {
    return res.status(403).json({ message: '권한이 없습니다.' });
  }
  next();
});

const verifyProductAuth = withAsync(async (req, res, next) => {
  const productId = parseInt(req.params.id, 10);
  const product = await productRepository.getById(productId);
  if (!product) {
    return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
  }
  if (product.authorId !== req.user.id) {
    return res.status(403).json({ message: '권한이 없습니다.' });
  }
  next();
});

const verifyArticleAuth = withAsync(async (req, res, next) => {
  const articleId = parseInt(req.params.id, 10);
  const article = await articleRepository.findById(articleId);
  if (!article) {
    return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
  }
  if (article.authorId !== req.user.id) {
    return res.status(403).json({ message: '권한이 없습니다.' });
  }
  next();
});

export const authenticate = {
  verifyAccessToken,
  verifyCommentAuth,
  verifyProductAuth,
  verifyArticleAuth,
};
