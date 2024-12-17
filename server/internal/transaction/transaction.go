package transaction

import (
	"context"
	"money-manager/db/sqlc"
	"time"
)

type GetTransactionsBetweenDateParamsReq struct {
	UserID    int64     `json:"user_id"`
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
}

type CreateTransactionFrontend struct {
	UserID              string     `json:"user_id"`
	TransactionCategory string    `json:"transaction_category"`
	TransactionAccount  string    `json:"transaction_account"`
	TransactionDate     string `json:"transaction_date"`
	TransactionAmount   string    `json:"transaction_amount"`
	TransactionNotes    string    `json:"transaction_notes"`
	TransactionImageUrl string    `json:"transaction_image_url"`
	TransactionVerified bool      `json:"transaction_verified"`
}

type EditTransactionFrontend struct {
	TransactionCategory string    `json:"transaction_category"`
	TransactionAccount  string    `json:"transaction_account"`
	TransactionDate     string `json:"transaction_date"`
	TransactionAmount   string    `json:"transaction_amount"`
	TransactionNotes    string    `json:"transaction_notes"`
	TransactionImageUrl string    `json:"transaction_image_url"`
	TransactionVerified bool      `json:"transaction_verified"`
	TransactionID       string    `json:"transaction_id"`
}

type GetTransactionsBetweenDateFrontend struct {
	TransactionDate   string `json:"transaction_date"`
	TransactionDate_2 string `json:"transaction_date_2"`
}

type Repository interface {
	CreateTransaction(ctx context.Context, req sqlc.CreateTransactionParams) (*sqlc.Transaction, error)
	EditTransaction(ctx context.Context, req sqlc.EditTransactionParams) (*int64, error)
	GetTransactionsByUserID(ctx context.Context, userID int64) ([]sqlc.Transaction, error)
	GetTransactionsBetweenDateParams(ctx context.Context, req sqlc.GetTransactionsBetweenDateParams) ([]sqlc.Transaction, error)
}

type Service interface {
	CreateTransaction(ctx context.Context, req *sqlc.CreateTransactionParams) (*sqlc.Transaction, error)
	EditTransaction(ctx context.Context, req *sqlc.EditTransactionParams) (*int64, error)
	GetTransactionsByUserID(ctx context.Context, userID int64) ([]sqlc.Transaction, error)
	GetTransactionsBetweenDateParams(ctx context.Context, req *sqlc.GetTransactionsBetweenDateParams) ([]sqlc.Transaction, error)
}
