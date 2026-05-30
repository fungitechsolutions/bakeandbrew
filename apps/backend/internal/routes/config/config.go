package config

import (
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/suprimkhatri77/sms/backend/internal/config"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
	"github.com/suprimkhatri77/sms/backend/internal/pkg/cloudinary"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
)

type Config struct {
	Config      *config.Config
	Queries     *db.Queries
	CldClient   *cloudinary.Client
	StudentRepo repository.StudentRepository
	PgxPool     *pgxpool.Pool
}
