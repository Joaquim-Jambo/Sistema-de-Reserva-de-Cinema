-- DropForeignKey
ALTER TABLE "movie_categories" DROP CONSTRAINT "movie_categories_category_id_fkey";

-- DropForeignKey
ALTER TABLE "movie_categories" DROP CONSTRAINT "movie_categories_movie_id_fkey";

-- AddForeignKey
ALTER TABLE "movie_categories" ADD CONSTRAINT "movie_categories_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_categories" ADD CONSTRAINT "movie_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
