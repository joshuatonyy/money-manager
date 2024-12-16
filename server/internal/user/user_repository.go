package user

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

func (r *repository) CreateUser(ctx context.Context, req sqlc.CreateUserParams) (*sqlc.User, error) {
	user, err := r.queries.CreateUser(ctx, req)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *repository) GetUserByEmail(ctx context.Context, email string) (*sqlc.User, error) {
	user, err := r.queries.GetUserByEmail(ctx, email)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

