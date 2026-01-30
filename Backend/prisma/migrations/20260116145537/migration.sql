/*
  Warnings:

  - Made the column `room_id` on table `sessions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_room_id_fkey";

-- AlterTable
ALTER TABLE "sessions" ALTER COLUMN "room_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
