package repository

import (
	"context"

	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
)

type UserRepository interface {
	GetPaginatedUsers(ctx context.Context, params db.GetPaginatedUsersParams) ([]db.GetPaginatedUsersRow, error)
	GetUsersRoleCount(ctx context.Context) ([]db.GetUsersRoleCountRow, error)
	UpdateUser(ctx context.Context, params db.UpdateUserParams) (db.User, error)
}
