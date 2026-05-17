package utils

import (
	"strconv"

	"github.com/jackc/pgx/v5/pgtype"
)

func ToNumeric(f float64) (pgtype.Numeric, error) {
	var n pgtype.Numeric
	err := n.Scan(strconv.FormatFloat(f, 'f', -1, 64))
	return n, err
}
