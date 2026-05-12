ALTER TABLE students 
ADD CONSTRAINT students_shift_check 
CHECK (shift IN ('morning', 'day', 'evening'));