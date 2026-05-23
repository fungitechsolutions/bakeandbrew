ALTER TABLE students RENAME COLUMN dob TO dob_ad;

ALTER TABLE students ADD COLUMN dob_bs VARCHAR(10);

UPDATE students SET dob_bs = '0000-00-00';

ALTER TABLE students ALTER COLUMN dob_bs SET NOT NULL;