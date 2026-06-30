package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
)

type CertificatesRepository interface {
	IssueCertificate(ctx context.Context, certificate db.IssueCertificateParams) (db.Certificate, error)
	GetStudentStatus(ctx context.Context, id pgtype.UUID) (string, error)
	GetStudentCertificate(ctx context.Context, params db.GetStudentCertificateParams) (db.GetStudentCertificateRow, error)
	CheckCertificateExists(ctx context.Context, params db.CheckCertificateExistsParams) (bool, error)
}
