CREATE TABLE student_scholarships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
    added_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    percent NUMERIC(5,2) NOT NULL CHECK (percent > 0 AND percent <= 100),
    note TEXT,
    amount BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);