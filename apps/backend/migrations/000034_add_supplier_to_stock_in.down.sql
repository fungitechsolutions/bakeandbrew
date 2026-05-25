DROP INDEX IF EXISTS idx_stock_in_supplier_id;
ALTER TABLE stock_in DROP COLUMN supplier_id;
ALTER TABLE stock_in ALTER COLUMN rate TYPE NUMERIC(10,2) USING (rate::NUMERIC(10,2));