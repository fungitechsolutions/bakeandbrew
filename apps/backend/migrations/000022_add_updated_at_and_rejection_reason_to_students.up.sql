ALTER TABLE students
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- backfill: set updated_at = created_at for existing rows
UPDATE students SET updated_at = created_at;

-- now enforce NOT NULL
ALTER TABLE students ALTER COLUMN updated_at SET NOT NULL;

-- trigger function (shared, reusable across tables)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- attach trigger to students
CREATE TRIGGER students_set_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();