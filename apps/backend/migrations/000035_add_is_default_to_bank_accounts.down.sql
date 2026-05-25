DROP INDEX IF EXISTS idx_bank_accounts_single_default;
ALTER TABLE bank_accounts DROP COLUMN is_default;