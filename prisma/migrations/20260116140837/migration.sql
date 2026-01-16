/*
  Warnings:

  - Added the required column `coverImageUrl` to the `movies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "coverImageUrl" TEXT NOT NULL;
