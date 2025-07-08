export const USERS = [
  {
    email: "user1@example.com",
    nickname: "user1",
    password: "pw1234",
    image: null,
    refreshToken: null,
  },
  {
    email: "user2@example.com",
    nickname: "user2",
    password: "pw5678",
    image: null,
    refreshToken: null,
  },
];

export const PRODUCTS = [
  {
    name: "아디다스 반팔",
    description: "여름 신상",
    price: 50000,
    tags: ["여름", "신상", "반팔"],
    images: ["shirt1.png", "shirt2.png"],
    authorId: 1,
  },
  {
    id: 2,
    name: "나이키 운동화",
    description: "편안한 착용감",
    price: 100000,
    tags: ["운동화", "편안함"],
    images: ["shoes1.png", "shoes2.png"],
    authorId: 2,
  },
];

export const ARTICLES = [
  {
    id: 1,
    title: "자바스크립트 기초",
    content: "자바스크립트는 웹 개발의 핵심 언어입니다.",
    authorId: 1,
  },
  {
    id: 2,
    title: "리액트 시작하기",
    content: "리액트는 사용자 인터페이스를 구축하는 데 유용합니다.",
    authorId: 2,
  },
];

export const COMMENTS = [
  {
    content: "좋은 반팔이네요!",
    productId: 1,
    authorId: 1,
  },
  {
    content: "운동화 편해보여요!",
    productId: 2,
    authorId: 2,
  },
  {
    content: "JS 꼭 배워야겠어요.",
    articleId: 1,
    authorId: 1,
  },
  {
    content: "리액트 입문에 좋아요.",
    articleId: 2,
    authorId: 2,
  },
];
