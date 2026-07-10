package types

import "github.com/jackc/pgx/v5/pgtype"

type Payment struct {
	ID          pgtype.UUID        `json:"id"`
	StudentID   pgtype.UUID        `json:"studentID"`
	Amount      int32              `json:"amount"`
	AddedBy     pgtype.UUID        `json:"addedBy"`
	AddedAt     pgtype.Timestamptz `json:"addedAt"`
	Remarks     pgtype.Text        `json:"remarks"`
	AddedByName string             `json:"addedByName"`
}
