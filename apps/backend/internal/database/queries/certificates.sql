-- name: IssueCertificate :one
INSERT INTO certificates (student_id, issued_by, remarks)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetCertificateByStudentID :one
SELECT ce.*, a.name AS issued_by_name
FROM certificates ce
JOIN users a ON a.id = ce.issued_by
WHERE ce.student_id = $1;

-- name: ListCertificates :many
SELECT ce.*, s.full_name, s.reference_no, a.name AS issued_by_name
FROM certificates ce
JOIN students s ON s.id = ce.student_id
JOIN users a ON a.id = ce.issued_by
ORDER BY ce.issued_at DESC;

-- name: DeleteCertificate :exec
DELETE FROM certificates WHERE id = $1;