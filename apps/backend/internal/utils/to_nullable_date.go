package utils

import (
	"time"

	"github.com/jackc/pgx/v5/pgtype"
)

func ToNullableDate(date string) pgtype.Date {
	if date == "" {
		return pgtype.Date{Valid: false}
	}
	t, err := time.Parse("2006-01-02", date)
	if err != nil {
		return pgtype.Date{Valid: false}
	}
	return pgtype.Date{Time: t, Valid: true}
}
