ALTER TABLE stock_in ADD COLUMN supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT;
ALTER TABLE stock_in ALTER COLUMN rate TYPE INTEGER USING (rate::INTEGER);

CREATE INDEX idx_stock_in_supplier_id ON stock_in(supplier_id);