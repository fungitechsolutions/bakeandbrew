-- name: IssueCertificate :one
INSERT INTO certificates (id, student_id, issued_by, remarks, type)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetStudentCertificate :one
SELECT
    id,
    type,
    remarks,
    issued_at
FROM certificates
WHERE student_id = $1 AND type = $2
ORDER BY issued_at DESC
LIMIT 1;

-- name: CheckCertificateExists :one
SELECT EXISTS (
    SELECT 1 FROM certificates
    WHERE student_id = $1 AND type = $2
) AS exists;


-- name: GetCertificateDetails :one
SELECT
    c.id,
    c.type,
    c.remarks,
    c.issued_at,
    s.full_name,
    s.reference_no,
    COALESCE(string_agg(co.name, ', ' ORDER BY co.name), '') AS course_names
FROM certificates c
JOIN students s ON s.id = c.student_id
LEFT JOIN student_courses sc ON sc.student_id = s.id
LEFT JOIN courses co ON co.id = sc.course_id
WHERE c.id = $1
GROUP BY c.id, c.type, c.remarks, c.issued_at, s.full_name, s.reference_no;