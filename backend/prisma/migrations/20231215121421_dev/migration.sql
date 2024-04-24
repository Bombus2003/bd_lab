/*
  Warnings:

  - You are about to drop the `clients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `contracts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `employees` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pledges` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "contracts" DROP CONSTRAINT "contracts_client_code_fkey";

-- DropForeignKey
ALTER TABLE "contracts" DROP CONSTRAINT "contracts_employee_code_fkey";

-- DropForeignKey
ALTER TABLE "contracts" DROP CONSTRAINT "contracts_pledge_code_fkey";

-- DropTable
DROP TABLE "clients";

-- DropTable
DROP TABLE "contracts";

-- DropTable
DROP TABLE "employees";

-- DropTable
DROP TABLE "pledges";

-- CreateTable
CREATE TABLE "client" (
    "client_code" SERIAL NOT NULL,
    "surname" VARCHAR(20) NOT NULL,
    "name" VARCHAR(15) NOT NULL,
    "lastname" VARCHAR(20) NOT NULL,
    "birthday" DATE,
    "passport_data" VARCHAR(11),
    "salary" DECIMAL(10,2) NOT NULL,
    "workplace" VARCHAR(100),
    "address" VARCHAR(100),
    "phone_number" VARCHAR(20),

    CONSTRAINT "client_pkey" PRIMARY KEY ("client_code")
);

-- CreateTable
CREATE TABLE "employee" (
    "employee_code" SERIAL NOT NULL,
    "surname" VARCHAR(20) NOT NULL,
    "name" VARCHAR(15) NOT NULL,
    "lastname" VARCHAR(20) NOT NULL,
    "position" VARCHAR(50),
    "phone_number" VARCHAR(20),

    CONSTRAINT "employee_pkey" PRIMARY KEY ("employee_code")
);

-- CreateTable
CREATE TABLE "credit" (
    "credit_code" SERIAL NOT NULL,
    "credit_name" VARCHAR(80) NOT NULL,
    "min_amount" DECIMAL(10,2) NOT NULL,
    "max_amount" DECIMAL(10,2) NOT NULL,
    "min_credit_term" INTEGER NOT NULL,
    "interest_rate" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "credit_pkey" PRIMARY KEY ("credit_code")
);

-- CreateTable
CREATE TABLE "contract" (
    "contract_code" SERIAL NOT NULL,
    "client_code" INTEGER,
    "employee_code" INTEGER,
    "credit_code" INTEGER,
    "contract_amount" DECIMAL(10,2) NOT NULL,
    "contract_term" INTEGER,
    "monthly_payment" DECIMAL(10,2) NOT NULL,
    "creation_date" DATE DEFAULT CURRENT_DATE,

    CONSTRAINT "contract_pkey" PRIMARY KEY ("contract_code")
);

-- CreateIndex
CREATE UNIQUE INDEX "client_passport_data_key" ON "client"("passport_data");

-- AddForeignKey
ALTER TABLE "contract" ADD CONSTRAINT "contract_client_code_fkey" FOREIGN KEY ("client_code") REFERENCES "client"("client_code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "contract" ADD CONSTRAINT "contract_employee_code_fkey" FOREIGN KEY ("employee_code") REFERENCES "employee"("employee_code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "contract" ADD CONSTRAINT "contract_credit_code_fkey" FOREIGN KEY ("credit_code") REFERENCES "credit"("credit_code") ON DELETE NO ACTION ON UPDATE NO ACTION;
