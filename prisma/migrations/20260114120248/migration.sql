/*
  Warnings:

  - A unique constraint covering the columns `[room_id,data]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "sessions_room_id_data_key" ON "sessions"("room_id", "data");
