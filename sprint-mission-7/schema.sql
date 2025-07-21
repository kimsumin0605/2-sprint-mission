DROP TABLE IF EXISTS product_likes, post_likes, comments, posts_images, posts, product_tags, tags, product_images, products, users CASCADE;

-- 유저 테이블
CREATE TABLE users (	
	id SERIAL PRIMARY KEY,
	email VARCHAR(255) UNIQUE NOT NULL CHECK (email LIKE '%@%'),
	nickname VARCHAR(20) NOT NULL,
	password TEXT NOT NULL,
	image TEXT,
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 상품 테이블
CREATE TABLE products (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	description TEXT,
	sell_price INT NOT NULL,
	used BOOLEAN NOT NULL, --true: 중고 false: 새상품
	status VARCHAR(20) CHECK (status IN ('new', 'reserved', 'soldout')),
	author_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	refreshed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 상품 이미지
CREATE TABLE product_images (
	id SERIAL PRIMARY KEY,
	product_id INT REFERENCES products(id) ON DELETE CASCADE,
	image_address VARCHAR(255) NOT NULL,
	modified_date TIMESTAMPTZ
);

-- 태그
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- 상품 태그
CREATE TABLE product_tags (
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  tag_id INT REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

-- 자유게시판 (posts)
CREATE TABLE posts (
	id SERIAL PRIMARY KEY,
	title VARCHAR(100) NOT NULL,
	content TEXT NOT NULL,
	author_id INT REFERENCES users(id) ON DELETE CASCADE,
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP	
); 

-- 게시글 이미지
CREATE TABLE posts_images (
	id SERIAL PRIMARY KEY,
	post_id INT REFERENCES posts(id) ON DELETE CASCADE,
	image_address VARCHAR(255) NOT NULL,
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 댓글 테이블 (게시글/상품)
CREATE TABLE comments (
	id SERIAL PRIMARY KEY,
	content TEXT NOT NULL,
	target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('product', 'post')),
	author_id INT REFERENCES users(id) ON DELETE CASCADE,
	product_id INT REFERENCES products(id) ON DELETE CASCADE,
	post_id INT REFERENCES posts(id),
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 좋아요
CREATE TABLE product_likes (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, product_id)
);

CREATE TABLE post_likes (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  post_id INT REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, post_id)
);

-- 업데이트 트리거 함수: updated_at 자동 갱신용
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- products 테이블용: refreshed_at 자동 갱신용 함수
CREATE OR REPLACE FUNCTION update_refreshed_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.refreshed_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- users, posts, comments 테이블 업데이트 트리거
CREATE TRIGGER trigger_users_updated
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_posts_updated
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_comments_updated
BEFORE UPDATE ON comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- products 테이블 업데이트 트리거 (refreshed_at 자동 갱신)
CREATE TRIGGER trigger_products_refreshed
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_refreshed_at_column();
