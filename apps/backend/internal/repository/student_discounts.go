package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
)

type StudentDiscounts interface {
	CreateDiscount(ctx context.Context, params db.CreateDiscountParams) (db.StudentDiscount, error)
	UpdateDiscount(ctx context.Context, params db.UpdateDiscountParams) (db.StudentDiscount, error)
	DeleteDiscount(ctx context.Context, id pgtype.UUID) error

	GetStudentFeeSummary(ctx context.Context, id pgtype.UUID) (db.GetStudentFeeSummaryRow, error)
}
