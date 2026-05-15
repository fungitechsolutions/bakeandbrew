package utils

import "github.com/jackc/pgx/v5/pgtype"

func ToNumeric(f float64) (pgtype.Numeric, error) {
	var n pgtype.Numeric
	err := n.Scan(f)
	return n, err
}
