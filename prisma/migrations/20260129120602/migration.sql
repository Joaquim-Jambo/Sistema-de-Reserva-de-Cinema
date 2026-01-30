/*
  Warnings:

  - Added the required column `cast` to the `movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `director` to the `movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distributor` to the `movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `premiere_date` to the `movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trailerVideoUrl` to the `movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "STATUS_TICKET" AS ENUM ('ACTIVE', 'USED', 'CANCELLED');

-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "cast" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "director" TEXT NOT NULL,
ADD COLUMN     "distributor" TEXT NOT NULL,
ADD COLUMN     "duration" TEXT NOT NULL,
ADD COLUMN     "premiere_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "trailerVideoUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "movie_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "seat_id" TEXT NOT NULL,
    "reservation_id" TEXT NOT NULL,
    "code_access" TEXT NOT NULL,
    "status" "STATUS_TICKET" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
