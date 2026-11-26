-- name: CreateStudentCourseChange :exec
INSERT INTO student_course_changes (
    student_id, changed_by, old_courses, new_courses,
    old_total_fee, new_total_fee, total_paid,
    old_adjustments, new_adjustments, excess_amount, reason
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);

-- name: ListStudentCourseChanges :many
SELECT
    scc.id,
    scc.old_courses,
    scc.new_courses,
    scc.old_total_fee,
    scc.new_total_fee,
    scc.total_paid,
    scc.old_adjustments,
    scc.new_adjustments,
    scc.excess_amount,
    scc.reason,
    scc.created_at,
    u.name AS changed_by_name
FROM student_course_changes scc
JOIN users u ON u.id = scc.changed_by
WHERE scc.student_id = $1
ORDER BY scc.created_at DESC;
