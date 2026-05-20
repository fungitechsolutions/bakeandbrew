package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
)

type StudentPortal interface {
	GetStudentOverview(ctx context.Context, id pgtype.UUID) (db.GetStudentOverviewRow, error)
	GetStudentFeeSummary(ctx context.Context, id pgtype.UUID) (db.GetStudentFeeSummaryRow, error)
	GetStudentPayments(ctx context.Context, id pgtype.UUID) ([]db.GetStudentPaymentsRow, error)
	GetStudentCourses(ctx context.Context, id pgtype.UUID) ([]db.GetStudentCoursesRow, error)
	GetStudentID(ctx context.Context, id pgtype.UUID) (pgtype.UUID, error)
	GetStudentCoursesCount(ctx context.Context, id pgtype.UUID) (int64, error)
}
