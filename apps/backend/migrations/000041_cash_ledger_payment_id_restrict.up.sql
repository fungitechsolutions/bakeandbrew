ALTER TABLE cash_ledger
    DROP CONSTRAINT cash_ledger_payment_id_fkey;

ALTER TABLE cash_ledger
    ADD CONSTRAINT cash_ledger_payment_id_fkey
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE RESTRICT;