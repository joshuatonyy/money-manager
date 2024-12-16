package user

import (
	"context"
	"money-manager/db/sqlc"
)

type CreateUserReq struct {
	Username     string `json:"username" db:"username"`
	Email    string `json:"email" db:"email"`
	Password string `json:"password" db:"password"`
}

type CreateUserRes struct {
	ID    string `json:"id" db:"id"`
	Username  string `json:"username" db:"username"`
	Email string `json:"email" db:"email"`
}

type LoginUserReq struct {
	Email    string `json:"email" db:"email"`
	Password string `json:"password" db:"password"`
}

type LoginUserRes struct {
	accessToken string
	ID          string `json:"id" db:"id"`
	Username        string `json:"username" db:"username"`
}

type Repository interface {
	CreateUser(ctx context.Context, req sqlc.CreateUserParams) (*sqlc.User, error)
	GetUserByEmail(ctx context.Context, email string) (*sqlc.User, error)
}

type Service interface {
	CreateUser(c context.Context, req *CreateUserReq) (*CreateUserRes, error)
	Login(c context.Context, req *LoginUserReq) (*LoginUserRes, error)
}