ALTER TABLE payments DROP CONSTRAINT payments_student_id_fkey;
ALTER TABLE payments ADD CONSTRAINT payments_student_id_fkey 
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE;