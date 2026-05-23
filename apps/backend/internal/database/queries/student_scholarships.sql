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