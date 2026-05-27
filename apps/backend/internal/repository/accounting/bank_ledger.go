package accountingRepository

import (
	"context"

	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
)

type BankLedgerRepository interface {
	CreateBankLedgerEntry(ctx context.Context, params db.CreateBankLedgerEntryParams) (db.BankLedger, error)
}
