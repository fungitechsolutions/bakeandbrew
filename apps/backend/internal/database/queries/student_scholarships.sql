-- name: CreateScholarship :one
INSERT INTO student_scholarships (student_id, percent, note, amount, added_by)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetScholarshipByStudent :one
SELECT
    ss.*,
    u.name AS added_by_name
FROM student_scholarships ss
JOIN users u ON u.id = ss.added_by
WHERE ss.student_id = $1;

-- name: GetScholarshipByID :one
SELECT * FROM student_scholarships
WHERE id = $1;

-- name: UpdateScholarship :one
UPDATE student_scholarships
SET percent = $2, note = $3, amount = $4
WHERE id = $1
RETURNING *;

-- name: DeleteScholarship :exec
DELETE FROM student_scholarships
WHERE id = $1;


-- name: GetStudentScholarship :one
SELECT 
note,
percent,
amount,
created_at
FROM student_scholarships
WHERE student_id = $1;


-- name: GetAllStudentScholarships :many
SELECT
    s.id AS student_id,
    s.reference_no,
    s.full_name,
    s.photo_url,
    u.email,
    s.phone,
    ss.id AS scholarship_id,
    ss.amount,
    ss.percent,
    ss.note,
    ss.created_at
FROM students s
JOIN users u ON u.id = s.student_id
JOIN student_scholarships ss ON ss.student_id = s.id
WHERE
    (sqlc.narg('search')::TEXT IS NULL
        OR s.full_name ILIKE '%' || sqlc.narg('search')::TEXT || '%'
        OR u.email ILIKE '%' || sqlc.narg('search')::TEXT || '%'
        OR s.phone ILIKE '%' || sqlc.narg('search')::TEXT || '%'
        OR s.reference_no ILIKE '%' || sqlc.narg('search')::TEXT || '%')
    AND (sqlc.narg('from')::TEXT IS NULL OR ss.created_at >= sqlc.narg('from')::TIMESTAMPTZ)
    AND (sqlc.narg('to')::TEXT IS NULL OR ss.created_at <= (sqlc.narg('to')::TIMESTAMPTZ + INTERVAL '1 day'))
ORDER BY ss.created_at DESC
LIMIT $1 OFFSET $2;

-- name: GetAllStudentScholarshipsCount :one
SELECT COUNT(*)::BIGINT
FROM students s
JOIN users u ON u.id = s.student_id
JOIN student_scholarships ss ON ss.student_id = s.id
WHERE
    (sqlc.narg('search')::TEXT IS NULL
        OR s.full_name ILIKE '%' || sqlc.narg('search')::TEXT || '%'
        OR u.email ILIKE '%' || sqlc.narg('search')::TEXT || '%'
        OR s.phone ILIKE '%' || sqlc.narg('search')::TEXT || '%'
        OR s.reference_no ILIKE '%' || sqlc.narg('search')::TEXT || '%')
    AND (sqlc.narg('from')::TEXT IS NULL OR ss.created_at >= sqlc.narg('from')::TIMESTAMPTZ)
    AND (sqlc.narg('to')::TEXT IS NULL OR ss.created_at <= (sqlc.narg('to')::TIMESTAMPTZ + INTERVAL '1 day'));

-- name: GetAllStudentScholarshipsTotal :one
SELECT COALESCE(SUM(ss.amount), 0)::BIGINT AS total_scholarships
FROM students s
JOIN users u ON u.id = s.student_id
JOIN student_scholarships ss ON ss.student_id = s.id
WHERE
    (sqlc.narg('search')::TEXT IS NULL
        OR s.full_name ILIKE '%' || sqlc.narg('search')::TEXT || '%'
        OR u.email ILIKE '%' || sqlc.narg('search')::TEXT || '%'
        OR s.phone ILIKE '%' || sqlc.narg('search')::TEXT || '%'
        OR s.reference_no ILIKE '%' || sqlc.narg('search')::TEXT || '%')
    AND (sqlc.narg('from')::TEXT IS NULL OR ss.created_at >= sqlc.narg('from')::TIMESTAMPTZ)
    AND (sqlc.narg('to')::TEXT IS NULL OR ss.created_at <= (sqlc.narg('to')::TIMESTAMPTZ + INTERVAL '1 day'));