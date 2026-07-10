CREATE TABLE bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_id UUID NOT NULL REFERENCES banks(id) ON DELETE RESTRICT,
    account_name TEXT NOT NULL,
    account_number TEXT,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(bank_id, account_name) 
);

CREATE INDEX idx_bank_accounts_bank_id ON bank_accounts(bank_id);
CREATE UNIQUE INDEX idx_bank_accounts_single_default ON bank_accounts(is_default) WHERE is_default = TRUE;
