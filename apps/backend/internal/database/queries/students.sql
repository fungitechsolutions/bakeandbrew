-- name: GetStudentFeeSummary :one
SELECT
    COALESCE(SUM(c.fee), 0)::INTEGER AS total_fee,
    COALESCE((
        SELECT SUM(p.amount)
        FROM payments p
        WHERE p.student_id = $1
    ), 0)::INTEGER AS total_paid
FROM student_courses sc
JOIN courses c ON c.id = sc.course_id
WHERE sc.student_id = $1;


-- name: GetNextSerialNo :one
SELECT COALESCE(MAX(serial_no), 0) + 1 AS next_serial
FROM students 
WHERE fiscal_year = $1;

-- name: CreateStudent :one
INSERT INTO students (
    reference_no, fiscal_year, serial_no, full_name, dob, gender,
    phone, address, guardian_name, guardian_phone,
    photo_url, source, status, student_id,
    shift, shift_time
) VALUES (
    $1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10,
    $11, $12, 'pending', $13,
    $14, $15
) RETURNING *;

-- name: GetStudentByID :one
SELECT 
    s.*,
    u.email
FROM students s
JOIN users u ON s.student_id = u.id
WHERE s.id = $1;

-- name: UpdateStudentStatus :one
UPDATE students SET status = $2
WHERE id = $1 RETURNING *;


-- name: ListStudents :many
SELECT 
    s.id,
    s.reference_no,
    s.full_name,
    s.phone,
    s.status,
    s.created_at,
  COALESCE(
    STRING_AGG(c.name, ',' ORDER BY c.name),
    ''
) AS courses
FROM students s
LEFT JOIN student_courses sc ON sc.student_id = s.id
LEFT JOIN courses c ON c.id = sc.course_id
GROUP BY s.id
ORDER BY s.created_at DESC
LIMIT $1 OFFSET $2;


-- name: GetStudentsCount :one
SELECT COUNT(*) FROM students;



-- name: GetStudentsWithOutstandingFees :many
SELECT
    u.id AS user_id,
    u.name,
    u.email,
    COALESCE(fees.total_fee, 0)::BIGINT AS total_course_fee,
    COALESCE(pays.total_paid, 0)::BIGINT AS total_paid,
    (COALESCE(fees.total_fee, 0) - COALESCE(pays.total_paid, 0))::BIGINT AS outstanding
FROM users u
JOIN students s ON s.student_id = u.id
JOIN (
    SELECT sc.student_id, SUM(c.fee) AS total_fee
    FROM student_courses sc
    JOIN courses c ON c.id = sc.course_id
    GROUP BY sc.student_id
) fees ON fees.student_id = s.id
LEFT JOIN (
    SELECT student_id, SUM(amount) AS total_paid
    FROM payments
    WHERE (sqlc.narg('from_date')::TEXT IS NULL OR added_at >= sqlc.narg('from_date')::TIMESTAMPTZ)
      AND (sqlc.narg('to_date')::TEXT IS NULL OR added_at <= (sqlc.narg('to_date')::TIMESTAMPTZ + INTERVAL '1 day'))
    GROUP BY student_id
) pays ON pays.student_id = s.id
WHERE s.status IN ('active', 'completed')
  AND (COALESCE(fees.total_fee, 0) - COALESCE(pays.total_paid, 0)) > 0
  AND (sqlc.narg('search')::TEXT IS NULL OR u.name ILIKE '%' || sqlc.narg('search')::TEXT || '%' OR u.email ILIKE '%' || sqlc.narg('search')::TEXT || '%')
ORDER BY outstanding DESC
LIMIT $1 OFFSET $2;

-- name: GetOutstandingFeesCount :one
SELECT COUNT(*)::BIGINT AS total
FROM (
    SELECT s.id
    FROM users u
    JOIN students s ON s.student_id = u.id
    JOIN (
        SELECT sc.student_id, SUM(c.fee) AS total_fee
        FROM student_courses sc
        JOIN courses c ON c.id = sc.course_id
        GROUP BY sc.student_id
    ) fees ON fees.student_id = s.id
    LEFT JOIN (
        SELECT student_id, SUM(amount) AS total_paid
        FROM payments
        WHERE (sqlc.narg('from_date')::TEXT IS NULL OR added_at >= sqlc.narg('from_date')::TIMESTAMPTZ)
          AND (sqlc.narg('to_date')::TEXT IS NULL OR added_at <= (sqlc.narg('to_date')::TIMESTAMPTZ + INTERVAL '1 day'))
        GROUP BY student_id
    ) pays ON pays.student_id = s.id
    WHERE s.status IN ('active', 'completed')
      AND (COALESCE(fees.total_fee, 0) - COALESCE(pays.total_paid, 0)) > 0
      AND (sqlc.narg('search')::TEXT IS NULL OR u.name ILIKE '%' || sqlc.narg('search')::TEXT || '%' OR u.email ILIKE '%' || sqlc.narg('search')::TEXT || '%')
) sub;

-- name: GetOutstandingFeesTotal :one
SELECT COALESCE(SUM(outstanding), 0)::BIGINT AS grand_total_outstanding
FROM (
    SELECT
        s.id,
        COALESCE(fees.total_fee, 0) - COALESCE(pays.total_paid, 0) AS outstanding
    FROM users u
    JOIN students s ON s.student_id = u.id
    JOIN (
        SELECT sc.student_id, SUM(c.fee) AS total_fee
        FROM student_courses sc
        JOIN courses c ON c.id = sc.course_id
        GROUP BY sc.student_id
    ) fees ON fees.student_id = s.id
    LEFT JOIN (
        SELECT student_id, SUM(amount) AS total_paid
        FROM payments
        WHERE (sqlc.narg('from_date')::TEXT IS NULL OR added_at >= sqlc.narg('from_date')::TIMESTAMPTZ)
          AND (sqlc.narg('to_date')::TEXT IS NULL OR added_at <= (sqlc.narg('to_date')::TIMESTAMPTZ + INTERVAL '1 day'))
        GROUP BY student_id
    ) pays ON pays.student_id = s.id
    WHERE s.status IN ('active', 'completed')
      AND (COALESCE(fees.total_fee, 0) - COALESCE(pays.total_paid, 0)) > 0
      AND (sqlc.narg('search')::TEXT IS NULL OR u.name ILIKE '%' || sqlc.narg('search')::TEXT || '%' OR u.email ILIKE '%' || sqlc.narg('search')::TEXT || '%')
) sub;

-- name: GetSalesRevenue :many
SELECT
    u.id AS user_id,
    u.name,
    u.email,
    COALESCE(fees.total_fee, 0)::BIGINT AS total_course_fee,
    COALESCE(pays.total_paid, 0)::BIGINT AS total_paid,
    (COALESCE(fees.total_fee, 0) - COALESCE(pays.total_paid, 0))::BIGINT AS outstanding
FROM users u
JOIN students s ON s.student_id = u.id
JOIN (
    SELECT sc.student_id, SUM(c.fee) AS total_fee
    FROM student_courses sc
    JOIN courses c ON c.id = sc.course_id
    GROUP BY sc.student_id
) fees ON fees.student_id = s.id
LEFT JOIN (
    SELECT student_id, SUM(amount) AS total_paid
    FROM payments
    WHERE (sqlc.narg('from_date')::TEXT IS NULL OR added_at >= sqlc.narg('from_date')::TIMESTAMPTZ)
      AND (sqlc.narg('to_date')::TEXT IS NULL OR added_at <= (sqlc.narg('to_date')::TIMESTAMPTZ + INTERVAL '1 day'))
    GROUP BY student_id
) pays ON pays.student_id = s.id
WHERE s.status IN ('active', 'completed')
  AND (sqlc.narg('search')::TEXT IS NULL OR u.name ILIKE '%' || sqlc.narg('search')::TEXT || '%' OR u.email ILIKE '%' || sqlc.narg('search')::TEXT || '%')
ORDER BY total_paid DESC
LIMIT $1 OFFSET $2;

-- name: GetSalesRevenueTotal :one
SELECT COALESCE(SUM(p.amount), 0)::BIGINT AS total_collected
FROM payments p
JOIN students s ON s.id = p.student_id
JOIN users u ON u.id = s.student_id
WHERE s.status IN ('active', 'completed')
  AND (sqlc.narg('from_date')::TEXT IS NULL OR p.added_at >= sqlc.narg('from_date')::TIMESTAMPTZ)
  AND (sqlc.narg('to_date')::TEXT IS NULL OR p.added_at <= (sqlc.narg('to_date')::TIMESTAMPTZ + INTERVAL '1 day'))
  AND (sqlc.narg('search')::TEXT IS NULL OR u.name ILIKE '%' || sqlc.narg('search')::TEXT || '%' OR u.email ILIKE '%' || sqlc.narg('search')::TEXT || '%');

-- name: GetSalesRevenueCount :one
SELECT COUNT(DISTINCT s.id)::BIGINT AS total
FROM students s
JOIN users u ON u.id = s.student_id
WHERE s.status IN ('active', 'completed')
  AND (sqlc.narg('search')::TEXT IS NULL OR u.name ILIKE '%' || sqlc.narg('search')::TEXT || '%' OR u.email ILIKE '%' || sqlc.narg('search')::TEXT || '%');