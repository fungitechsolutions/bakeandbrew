package accountingRepository

import (
	"context"

	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
)

type BankLedgerRepository interface {
	CreateBankLedgerEntry(ctx context.Context, params db.CreateBankLedgerEntryParams) (db.BankLedger, error)
	GetBankLedgerSummary(ctx context.Context, params db.GetBankLedgerSummaryParams) (db.GetBankLedgerSummaryRow, error)
	ListBankLedger(ctx context.Context, params db.ListBankLedgerParams) ([]db.ListBankLedgerRow, error)
	GetBankLedgerCount(ctx context.Context, params db.GetBankLedgerCountParams) (int64, error)
}
