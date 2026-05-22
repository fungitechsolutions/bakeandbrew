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

type AddPaymentRequest struct {
	Amount      float64 `json:"amount" binding:"required,gt=0"`
	PaymentMode string  `json:"paymentMode" binding:"required,notblank,min=1,max=50"`
	Remarks     string  `json:"remarks,omitempty" binding:"omitempty,notblank,min=1,max=200"`
}
