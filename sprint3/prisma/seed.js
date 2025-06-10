import { db } from '../utils/db.js'; 
import { PRODUCTS, ARTICLES, COMMENTS } from './mock.js';

async function main() {
  await db.comment.deleteMany();  
  await db.product.deleteMany();  
  await db.article.deleteMany();  


  await db.product.createMany({
    data: PRODUCTS,
    skipDuplicates: true,
  });

  await db.article.createMany({
    data: ARTICLES,
    skipDuplicates: true,
  });

  await db.comment.createMany({
    data: COMMENTS,
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await db.$disconnect();  
  })
  .catch(async (e) => {
    console.error(e);  
    await db.$disconnect();  
    process.exit(1);  
  });