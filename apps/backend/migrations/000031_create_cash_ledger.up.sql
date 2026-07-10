CREATE TABLE cash_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date TIMESTAMPTZ NOT NULL,
    bs_date TEXT NOT NULL,
    entry_type TEXT NOT NULL CHECK (entry_type IN ('dr', 'cr')),
    amount INTEGER NOT NULL CHECK (amount > 0),
    description TEXT,
    payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cash_ledger_date ON cash_ledger(date);
CREATE INDEX idx_cash_ledger_bs_date ON cash_ledger(bs_date);
CREATE INDEX idx_cash_ledger_payment_id ON cash_ledger(payment_id);