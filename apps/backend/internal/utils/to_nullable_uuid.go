package utils

import "github.com/jackc/pgx/v5/pgtype"

func ToNullableUUID(id string) pgtype.UUID {
	if id == "" {
		return pgtype.UUID{Valid: false}
	}
	var uuid pgtype.UUID
	if err := uuid.Scan(id); err != nil {
		return pgtype.UUID{Valid: false}
	}
	return uuid
}
