package transaction

import (
	"context"
	"money-manager/db/sqlc"
)

type repository struct {
	queries *sqlc.Queries
}

func NewRepository(queries *sqlc.Queries) Repository {
	return &repository{queries: queries}
}

func (r *repository) CreateTransaction(ctx context.Context, req sqlc.CreateTransactionParams) (*sqlc.Transaction, error) {
	transaction, err := r.queries.CreateTransaction(ctx, req)
	if err != nil {
		return nil, err
	}
	return &transaction, nil
}

func (r *repository) EditTransaction(ctx context.Context, req sqlc.EditTransactionParams) (*int64, error) {
	transaction, err := r.queries.EditTransaction(ctx, req)
	if err != nil {
		return nil, err
	}
	return &transaction, nil
}

func (r *repository) GetTransactionsByUserID(ctx context.Context, userID int64) ([]sqlc.Transaction, error) {
	transactions, err := r.queries.GetTransactionsByUserID(ctx, int32(userID))
	if err != nil {
		return nil, err
	}
	return transactions, nil
}

func (r *repository) GetTransactionsBetweenDateParams(ctx context.Context, req sqlc.GetTransactionsBetweenDateParams) ([]sqlc.Transaction, error) {
	transactions, err := r.queries.GetTransactionsBetweenDate(ctx, req)
	if err != nil {
		return nil, err
	}
	return transactions, nil
}