package repository

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
)

type StudentRepository interface {
	WithTx(tx pgx.Tx) StudentRepository
	CreateStudent(ctx context.Context, params db.CreateStudentParams) (db.Student, error)
	EnrollStudentInCourse(ctx context.Context, params db.EnrollStudentInCourseParams) error
	GetAdmissionSettings(ctx context.Context) ([]db.Setting, error)
	GetNextSerialNo(ctx context.Context, fiscalYear string) (int32, error)
	CreateInquiry(ctx context.Context, params db.CreateInquiryParams) (db.Inquiry, error)
	GetCoursesByIDs(ctx context.Context, param []pgtype.UUID) ([]db.GetCoursesByIDsRow, error)
	UpdateUserImage(ctx context.Context, params db.UpdateUserImageParams) error

	GetStudentAdmissionStatus(ctx context.Context, id pgtype.UUID) (db.GetStudentAdmissionStatusRow, error)
}

type studentRepository struct {
	queries *db.Queries
	pool    *pgxpool.Pool
}

func NewAdmissionRepository(queries *db.Queries) StudentRepository {
	return &studentRepository{
		queries: queries,
	}
}

func (s *studentRepository) WithTx(tx pgx.Tx) StudentRepository {
	return &studentRepository{queries: s.queries.WithTx(tx), pool: s.pool}
}

func (s *studentRepository) CreateStudent(ctx context.Context, params db.CreateStudentParams) (db.Student, error) {
	return s.queries.CreateStudent(ctx, params)
}

func (s *studentRepository) EnrollStudentInCourse(ctx context.Context, params db.EnrollStudentInCourseParams) error {
	return s.queries.EnrollStudentInCourse(ctx, params)
}

func (s *studentRepository) GetAdmissionSettings(ctx context.Context) ([]db.Setting, error) {
	return s.queries.GetAdmissionSettings(ctx)
}

func (s *studentRepository) GetNextSerialNo(ctx context.Context, fiscalYear string) (int32, error) {
	return s.queries.GetNextSerialNo(ctx, fiscalYear)
}

func (s *studentRepository) CreateInquiry(ctx context.Context, params db.CreateInquiryParams) (db.Inquiry, error) {
	return s.queries.CreateInquiry(ctx, params)
}

func (s *studentRepository) GetCoursesByIDs(ctx context.Context, param []pgtype.UUID) ([]db.GetCoursesByIDsRow, error) {
	return s.queries.GetCoursesByIDs(ctx, param)
}

func (s *studentRepository) UpdateUserImage(ctx context.Context, params db.UpdateUserImageParams) error {
	return s.queries.UpdateUserImage(ctx, params)
}

func (s *studentRepository) GetStudentAdmissionStatus(ctx context.Context, id pgtype.UUID) (db.GetStudentAdmissionStatusRow, error) {
	return s.queries.GetStudentAdmissionStatus(ctx, id)
}
