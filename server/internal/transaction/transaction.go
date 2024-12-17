package transaction

import (
	"context"
	"money-manager/db/sqlc"
	"time"
)

type GetTransactionsBetweenDateParamsReq struct {
	UserID int64 `json:"user_id"`
	StartDate time.Time `json:"start_date"`
	EndDate time.Time `json:"end_date"`
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