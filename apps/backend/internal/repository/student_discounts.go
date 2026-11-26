package repository

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
)

type StudentDiscounts interface {
	CreateDiscount(ctx context.Context, params db.CreateDiscountParams) (db.StudentDiscount, error)
	UpdateDiscount(ctx context.Context, params db.UpdateDiscountParams) (db.StudentDiscount, error)
	DeleteDiscount(ctx context.Context, id pgtype.UUID) error

	GetStudentFeeSummary(ctx context.Context, id pgtype.UUID) (db.GetStudentFeeSummaryRow, error)
	GetDiscountByID(ctx context.Context, id pgtype.UUID) (db.StudentDiscount, error)

	ListDiscountsByStudent(ctx context.Context, id pgtype.UUID) ([]db.ListDiscountsByStudentRow, error)
}

type StudentDiscountCreateTxRepository interface {
	WithTx(tx pgx.Tx) StudentDiscountCreateTxRepository
	LockStudentForShare(ctx context.Context, id pgtype.UUID) (pgtype.UUID, error)
	GetStudentFeeSummary(ctx context.Context, id pgtype.UUID) (db.GetStudentFeeSummaryRow, error)
	CreateDiscount(ctx context.Context, params db.CreateDiscountParams) (db.StudentDiscount, error)
}

type studentDiscountCreateTxRepository struct {
	queries *db.Queries
}

func NewStudentDiscountCreateTxRepository(queries *db.Queries) StudentDiscountCreateTxRepository {
	return &studentDiscountCreateTxRepository{queries: queries}
}

func (r *studentDiscountCreateTxRepository) WithTx(tx pgx.Tx) StudentDiscountCreateTxRepository {
	return &studentDiscountCreateTxRepository{queries: r.queries.WithTx(tx)}
}

func (r *studentDiscountCreateTxRepository) LockStudentForShare(ctx context.Context, id pgtype.UUID) (pgtype.UUID, error) {
	return r.queries.LockStudentForShare(ctx, id)
}

func (r *studentDiscountCreateTxRepository) GetStudentFeeSummary(ctx context.Context, id pgtype.UUID) (db.GetStudentFeeSummaryRow, error) {
	return r.queries.GetStudentFeeSummary(ctx, id)
}

func (r *studentDiscountCreateTxRepository) CreateDiscount(ctx context.Context, params db.CreateDiscountParams) (db.StudentDiscount, error) {
	return r.queries.CreateDiscount(ctx, params)
}

// StudentDiscountEditTxRepository is what editing or deleting a discount needs
// inside one transaction, under the same student lock a course change waits on.
type StudentDiscountEditTxRepository interface {
	WithTx(tx pgx.Tx) StudentDiscountEditTxRepository
	LockStudentForShare(ctx context.Context, id pgtype.UUID) (pgtype.UUID, error)
	GetStudentDiscountForUpdate(ctx context.Context, params db.GetStudentDiscountForUpdateParams) (db.StudentDiscount, error)
	GetStudentFeeSummary(ctx context.Context, id pgtype.UUID) (db.GetStudentFeeSummaryRow, error)
	UpdateDiscount(ctx context.Context, params db.UpdateDiscountParams) (db.StudentDiscount, error)
	DeleteDiscount(ctx context.Context, id pgtype.UUID) error
}

type studentDiscountEditTxRepository struct {
	queries *db.Queries
}

func NewStudentDiscountEditTxRepository(queries *db.Queries) StudentDiscountEditTxRepository {
	return &studentDiscountEditTxRepository{queries: queries}
}

func (r *studentDiscountEditTxRepository) WithTx(tx pgx.Tx) StudentDiscountEditTxRepository {
	return &studentDiscountEditTxRepository{queries: r.queries.WithTx(tx)}
}

func (r *studentDiscountEditTxRepository) LockStudentForShare(ctx context.Context, id pgtype.UUID) (pgtype.UUID, error) {
	return r.queries.LockStudentForShare(ctx, id)
}

func (r *studentDiscountEditTxRepository) GetStudentDiscountForUpdate(ctx context.Context, params db.GetStudentDiscountForUpdateParams) (db.StudentDiscount, error) {
	return r.queries.GetStudentDiscountForUpdate(ctx, params)
}

func (r *studentDiscountEditTxRepository) GetStudentFeeSummary(ctx context.Context, id pgtype.UUID) (db.GetStudentFeeSummaryRow, error) {
	return r.queries.GetStudentFeeSummary(ctx, id)
}

func (r *studentDiscountEditTxRepository) UpdateDiscount(ctx context.Context, params db.UpdateDiscountParams) (db.StudentDiscount, error) {
	return r.queries.UpdateDiscount(ctx, params)
}

func (r *studentDiscountEditTxRepository) DeleteDiscount(ctx context.Context, id pgtype.UUID) error {
	return r.queries.DeleteDiscount(ctx, id)
}
