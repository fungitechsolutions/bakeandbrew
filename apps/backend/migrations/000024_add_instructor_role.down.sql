UPDATE users SET role = 'student' WHERE role = 'instructor';

ALTER TABLE users
DROP CONSTRAINT users_role_check;

ALTER TABLE users
ADD CONSTRAINT users_role_check CHECK (role IN ('student', 'admin', 'superadmin'));