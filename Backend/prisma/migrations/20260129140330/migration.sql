/*
  Warnings:

  - You are about to drop the column `country` on the `movies` table. All the data in the column will be lost.
  - Added the required column `country_of_origin` to the `movies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "movies" DROP COLUMN "country",
ADD COLUMN     "country_of_origin" TEXT NOT NULL;
