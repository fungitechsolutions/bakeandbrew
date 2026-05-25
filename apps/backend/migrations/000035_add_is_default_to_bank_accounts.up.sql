ALTER TABLE bank_accounts ADD COLUMN is_default BOOLEAN NOT NULL DEFAULT FALSE;
CREATE UNIQUE INDEX idx_bank_accounts_single_default ON bank_accounts(is_default) WHERE is_default = TRUE;