-- CreateTable
CREATE TABLE "clients" (
    "client_code" SERIAL NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "address" VARCHAR(255),
    "phone_number" VARCHAR(20),
    "passport_data" VARCHAR(20),

    CONSTRAINT "clients_pkey" PRIMARY KEY ("client_code")
);

-- CreateTable
CREATE TABLE "contracts" (
    "contract_code" SERIAL NOT NULL,
    "creation_date" DATE DEFAULT CURRENT_DATE,
    "termination_date" DATE,
    "payment_date" DATE,
    "contract_type" VARCHAR(50) DEFAULT 'Залог',
    "payout_to_client" DECIMAL(10,2),
    "client_code" INTEGER,
    "pledge_code" INTEGER,
    "employee_code" INTEGER,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("contract_code")
);

-- CreateTable
CREATE TABLE "employees" (
    "employee_code" SERIAL NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "phone_number" VARCHAR(20),
    "birth_date" DATE,
    "position" VARCHAR(50),
    "address" VARCHAR(255),

    CONSTRAINT "employees_pkey" PRIMARY KEY ("employee_code")
);

-- CreateTable
CREATE TABLE "pledges" (
    "pledge_code" SERIAL NOT NULL,
    "condition" VARCHAR(50),
    "description" TEXT,
    "characteristics" TEXT,
    "price" DECIMAL(10,2),

    CONSTRAINT "pledges_pkey" PRIMARY KEY ("pledge_code")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_passport_data_key" ON "clients"("passport_data");

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_client_code_fkey" FOREIGN KEY ("client_code") REFERENCES "clients"("client_code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_employee_code_fkey" FOREIGN KEY ("employee_code") REFERENCES "employees"("employee_code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_pledge_code_fkey" FOREIGN KEY ("pledge_code") REFERENCES "pledges"("pledge_code") ON DELETE NO ACTION ON UPDATE NO ACTION;
