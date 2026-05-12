ALTER TABLE students 
ADD COLUMN shift TEXT;

ALTER TABLE students 
ADD COLUMN shift_time TEXT;

UPDATE students
SET shift = 'morning',
    shift_time = '08:00-10:00'
WHERE shift IS NULL;

UPDATE students
SET shift = 'day',
    shift_time = '11:00-13:00'
WHERE shift IS NULL;

UPDATE students
SET shift = 'evening',
    shift_time = '18:00-20:00'
WHERE shift IS NULL;

ALTER TABLE students 
ALTER COLUMN shift SET NOT NULL;

ALTER TABLE students 
ALTER COLUMN shift_time SET NOT NULL;