-- name: CreateScholarship :one
INSERT INTO student_scholarships (student_id, percent, note)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetScholarshipByStudent :one
SELECT * FROM student_scholarships
WHERE student_id = $1;

-- name: GetScholarshipByID :one
SELECT * FROM student_scholarships
WHERE id = $1;

-- name: UpdateScholarship :one
UPDATE student_scholarships
SET percent = $2, note = $3
WHERE id = $1
RETURNING *;

-- name: DeleteScholarship :exec
DELETE FROM student_scholarships
WHERE id = $1;