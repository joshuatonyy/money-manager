package transaction

import (
	"context"
	"money-manager/db/sqlc"
)

type service struct {
	repository Repository
}

func NewService(repository Repository) Service {
	return &service{
		repository,
	}
}

func (s *service) CreateTransaction(c context.Context, req *sqlc.CreateTransactionParams) (*sqlc.Transaction, error) {
	newTransaction, err := s.repository.CreateTransaction(c, sqlc.CreateTransactionParams{
		UserID: req.UserID,
		TransactionCategory: req.TransactionCategory,
		TransactionAccount: req.TransactionAccount,
		TransactionDate: req.TransactionDate,
		TransactionAmount: req.TransactionAmount,
		TransactionNotes: req.TransactionNotes,
		TransactionImageUrl: req.TransactionImageUrl,
		TransactionVerified: req.TransactionVerified,
	})
	if err != nil {
		return nil, err
	}
	return &sqlc.Transaction{
		TransactionID: newTransaction.TransactionID,
		UserID: newTransaction.UserID,
		TransactionCategory: newTransaction.TransactionCategory,
		TransactionAccount: newTransaction.TransactionAccount,
		TransactionDate: newTransaction.TransactionDate,
		TransactionAmount: newTransaction.TransactionAmount,
		TransactionNotes: newTransaction.TransactionNotes,
		TransactionImageUrl: newTransaction.TransactionImageUrl,
		TransactionVerified: newTransaction.TransactionVerified,
	}, nil
}

func (s *service) EditTransaction(c context.Context, req *sqlc.EditTransactionParams) (*int64, error) {
	editedTransaction, err := s.repository.EditTransaction(c, sqlc.EditTransactionParams{
		TransactionID: req.TransactionID,
		TransactionCategory: req.TransactionCategory,
		TransactionAccount: req.TransactionAccount,
		TransactionDate: req.TransactionDate,
		TransactionAmount: req.TransactionAmount,
		TransactionNotes: req.TransactionNotes,
		TransactionImageUrl: req.TransactionImageUrl,
		TransactionVerified: req.TransactionVerified,
	})
	if err != nil {
		return nil, err
	}

	return editedTransaction, nil
}

func (s *service) GetTransactionsByUserID(ctx context.Context, userID int64) ([]sqlc.Transaction, error) {
	transactions, err := s.repository.GetTransactionsByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	return transactions, err
}

func (s *service) GetTransactionsBetweenDateParams(ctx context.Context, req *sqlc.GetTransactionsBetweenDateParams) ([]sqlc.Transaction, error) {
	transactions, err := s.repository.GetTransactionsBetweenDateParams(ctx, *req)
	if err != nil {
		return nil, err
	}
	return transactions, err
}