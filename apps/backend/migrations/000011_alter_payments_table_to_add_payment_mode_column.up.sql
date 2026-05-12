ALTER TABLE payments 
ADD COLUMN payment_mode TEXT;

UPDATE payments 
SET payment_mode = 'cash' 
WHERE payment_mode IS NULL;

ALTER TABLE payments 
ALTER COLUMN payment_mode SET NOT NULL;