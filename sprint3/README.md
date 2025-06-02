## 🧩 NB2 Sprint Mission 3

### 📝 미션 설명

PostgreSQL을 사용하는 중고 마켓 & 자유게시판 프로젝트입니다. 

주요 기능은 다음과 같습니다:

🛍️ 중고마켓
--
🔹 Product 스키마 및 API

* 상품 등록 API
* 상품 상세 조회 API
* 상품 수정 API
* 상품 삭제 API
* 상품 목록 조회 API (offset 기반 페이지네이션)

📝 자유게시판
--
🔹 Article 스키마 및 API

* 게시글 등록 API
* 게시글 수정 API
* 게시글 삭제 API
* 게시글 목록 조회 API (offset 기반 페이지네이션)

💬 댓글
--
🔹 Comment API
* 댓글 등록 API (중고마켓 / 자유게시판 각각 별도 API)
* 댓글 수정 API
* 댓글 목록 조회 API (cursor 기반 페이지네이션)

### 🛠️ 공통 기능

* 유효성 검증 (Multer 미들웨어 사용)
* 이미지 업로드 기능
* 에러 처리
* 라우트 중복 제거
* 배포: Render.com

