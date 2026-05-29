package accountingRepository

import (
	"context"

	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
)

type CashLedgerRepository interface {
	CreateCashLedgerEntry(ctx context.Context, params db.CreateCashLedgerEntryParams) (db.CashLedger, error)
	ListCashLedger(ctx context.Context, params db.ListCashLedgerParams) ([]db.CashLedger, error)
	GetCashLedgerCount(ctx context.Context, params db.GetCashLedgerCountParams) (int64, error)
	GetCashLedgerSummary(ctx context.Context, params db.GetCashLedgerSummaryParams) (db.GetCashLedgerSummaryRow, error)
}
