CREATE TABLE certificates (
    id         SERIAL PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    issued_by  UUID NOT NULL REFERENCES users(id),
    issued_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    remarks    VARCHAR
);