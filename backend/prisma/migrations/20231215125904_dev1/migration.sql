/*
  Warnings:

  - Added the required column `max_credit_term` to the `credit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "credit" ADD COLUMN     "max_credit_term" INTEGER NOT NULL;
