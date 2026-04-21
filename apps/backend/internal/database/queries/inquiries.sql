-- name: CreateInquiry :one
INSERT INTO inquiries (full_name, phone, email, message, source)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: ListInquiries :many
SELECT * FROM inquiries ORDER BY created_at DESC;

-- name: GetInquiryByID :one
SELECT * FROM inquiries WHERE id = $1;

-- name: MarkInquiryRead :exec
UPDATE inquiries SET is_read = TRUE WHERE id = $1;

-- name: DeleteInquiry :exec
DELETE FROM inquiries WHERE id = $1;

-- name: CountUnreadInquiries :one
SELECT COUNT(*)::INTEGER AS count FROM inquiries WHERE is_read = FALSE;