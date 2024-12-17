CREATE TABLE "transactions" (
    "transaction_id" bigserial PRIMARY KEY,
    "user_id" INT NOT NULL,
    "transaction_category" varchar NOT NULL,
    "transaction_account" varchar NOT NULL,
    "transaction_date" DATE NOT NULL,
    "transaction_amount" NUMERIC(10, 2) NOT NULL,
    "transaction_notes" varchar NOT NULL,
    "transaction_image_url" varchar NOT NULL,
    "transaction_verified" BOOLEAN NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)