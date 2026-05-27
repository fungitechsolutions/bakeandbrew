CREATE TABLE bank_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_account_id UUID NOT NULL REFERENCES bank_accounts(id) ON DELETE RESTRICT,
    date TIMESTAMPTZ NOT NULL,
    bs_date TEXT NOT NULL,
    entry_type TEXT NOT NULL CHECK (entry_type IN ('dr', 'cr')),
    amount BIGINT NOT NULL CHECK (amount > 0),
    description TEXT,
    payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bank_ledger_bank_account_id ON bank_ledger(bank_account_id);
CREATE INDEX idx_bank_ledger_date ON bank_ledger(date);
CREATE INDEX idx_bank_ledger_bs_date ON bank_ledger(bs_date);
CREATE INDEX idx_bank_ledger_payment_id ON bank_ledger(payment_id);