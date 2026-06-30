ALTER TABLE bank_ledger
    DROP CONSTRAINT bank_ledger_payment_id_fkey;

ALTER TABLE bank_ledger
    ADD CONSTRAINT bank_ledger_payment_id_fkey
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL;