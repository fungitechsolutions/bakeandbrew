CREATE TABLE supplier_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    date TIMESTAMPTZ NOT NULL,
    bs_date TEXT NOT NULL,
    entry_type TEXT NOT NULL CHECK (entry_type IN ('dr', 'cr')),
    amount BIGINT NOT NULL CHECK (amount > 0),
    description TEXT,
    stock_in_id UUID REFERENCES stock_in(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_supplier_ledger_supplier_id ON supplier_ledger(supplier_id);
CREATE INDEX idx_supplier_ledger_date ON supplier_ledger(date);
CREATE INDEX idx_supplier_ledger_bs_date ON supplier_ledger(bs_date);
CREATE INDEX idx_supplier_ledger_stock_in_id ON supplier_ledger(stock_in_id);