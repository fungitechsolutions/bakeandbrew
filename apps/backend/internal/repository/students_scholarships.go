package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
)

type StudentsScholarship interface {
	CreateScholarship(ctx context.Context, params db.CreateScholarshipParams) (db.StudentScholarship, error)
	UpdateScholarship(ctx context.Context, params db.UpdateScholarshipParams) (db.StudentScholarship, error)
	DeleteScholarship(ctx context.Context, id pgtype.UUID) error
	GetStudentFeeSummary(ctx context.Context, id pgtype.UUID) (db.GetStudentFeeSummaryRow, error)

	GetScholarshipByID(ctx context.Context, id pgtype.UUID) (db.StudentScholarship, error)
	GetScholarshipByStudent(ctx context.Context, id pgtype.UUID) (db.GetScholarshipByStudentRow, error)
}
