package utils

import (
	"fmt"

	"github.com/jackc/pgx/v5/pgtype"
)

func ConvertToUUID(id string) (pgtype.UUID, error) {
	var uuid pgtype.UUID
	if err := uuid.Scan(id); err != nil {
		return uuid, fmt.Errorf("Invalid uuid string")
	}
	return uuid, nil
}
