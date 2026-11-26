CREATE TABLE student_course_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    changed_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    old_courses JSONB NOT NULL,
    new_courses JSONB NOT NULL,
    old_total_fee BIGINT NOT NULL,
    new_total_fee BIGINT NOT NULL,
    total_paid BIGINT NOT NULL,
    old_adjustments BIGINT NOT NULL,
    new_adjustments BIGINT NOT NULL,
    excess_amount BIGINT NOT NULL DEFAULT 0 CHECK (excess_amount >= 0),
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
