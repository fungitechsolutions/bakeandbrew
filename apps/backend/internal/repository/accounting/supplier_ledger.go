package accountingRepository

import (
	"context"

	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
)

type SupplierLedgerRepository interface {
	CreateSupplierLedgerEntry(ctx context.Context, params db.CreateSupplierLedgerEntryParams) (db.SupplierLedger, error)
	ListSupplierLedger(ctx context.Context, params db.ListSupplierLedgerParams) ([]db.ListSupplierLedgerRow, error)
	GetSupplierLedgerSummary(ctx context.Context, params db.GetSupplierLedgerSummaryParams) (db.GetSupplierLedgerSummaryRow, error)
	GetSupplierLedgerCount(ctx context.Context, params db.GetSupplierLedgerCountParams) (int64, error)
}
