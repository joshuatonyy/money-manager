-- name: CreateTransaction :one
INSERT INTO transactions(user_id, transaction_category, transaction_account, transaction_date, transaction_amount, transaction_notes, transaction_image_url, transaction_verified)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING transaction_id, user_id, transaction_category, transaction_account, transaction_date, transaction_amount, transaction_notes, transaction_image_url, transaction_verified;

-- name: EditTransaction :one
UPDATE transactions
SET 
    transaction_category = COALESCE($1, transaction_category),
    transaction_account = COALESCE($2, transaction_account),
    transaction_date = COALESCE($3, transaction_date),
    transaction_amount = COALESCE($4, transaction_amount),
    transaction_notes = COALESCE($5, transaction_notes),
    transaction_image_url = COALESCE($6, transaction_image_url),
    transaction_verified = COALESCE($7, transaction_verified)
WHERE transaction_id = $8
RETURNING transaction_id;

-- name: GetTransactionsByUserID :many
SELECT *
FROM transactions
WHERE user_id = $1;

-- name: GetTransactionsBetweenDate :many
SELECT * FROM transactions
WHERE user_id = $1
AND transaction_date BETWEEN $2 AND $3;