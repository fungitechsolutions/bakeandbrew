DROP TRIGGER IF EXISTS students_set_updated_at ON students;

ALTER TABLE students
  DROP COLUMN IF EXISTS updated_at,
  DROP COLUMN IF EXISTS rejection_reason;