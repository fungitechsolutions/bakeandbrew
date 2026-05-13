CREATE TABLE student_courses (
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id  UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    fee_at_enrollment BIGINT NOT NULL,
    PRIMARY KEY (student_id, course_id)
);