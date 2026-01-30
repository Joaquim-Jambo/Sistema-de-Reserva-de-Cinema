-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_room_id_fkey";

-- AlterTable
ALTER TABLE "sessions" ALTER COLUMN "room_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;
