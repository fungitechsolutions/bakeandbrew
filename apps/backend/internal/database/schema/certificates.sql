CREATE TABLE certificates (
    id         TEXT PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    issued_by  UUID NOT NULL REFERENCES users(id),
    issued_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    remarks    VARCHAR,
    type       TEXT NOT NULL DEFAULT 'normal' CHECK (type IN ('normal', 'workshop'))
);