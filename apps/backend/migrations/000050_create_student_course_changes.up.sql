-- One row per course change on a student, so the fee history stays explainable
-- after payments, discounts or a scholarship were carried over to new courses.
-- Courses are stored as [{id, name, fee}] snapshots: a course can be renamed or
-- re-priced later, and the record should show what applied at the time.
CREATE TABLE student_course_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    changed_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    old_courses JSONB NOT NULL,
    new_courses JSONB NOT NULL,
    old_total_fee BIGINT NOT NULL,
    new_total_fee BIGINT NOT NULL,
    total_paid BIGINT NOT NULL,
    -- discounts + scholarship, before and after they were rescaled to the new fee
    old_adjustments BIGINT NOT NULL,
    new_adjustments BIGINT NOT NULL,
    -- paid beyond the new fee, owed back to the student (refund or credit)
    excess_amount BIGINT NOT NULL DEFAULT 0 CHECK (excess_amount >= 0),
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_student_course_changes_student ON student_course_changes (student_id, created_at DESC);
