-- name: CreateDiscount :one
INSERT INTO student_discounts (student_id, type, percent, note)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetDiscountByID :one
SELECT * FROM student_discounts
WHERE id = $1;

-- name: ListDiscountsByStudent :many
SELECT * FROM student_discounts
WHERE student_id = $1
ORDER BY created_at DESC;

-- name: UpdateDiscount :one
UPDATE student_discounts
SET type = $2, percent = $3, note = $4
WHERE id = $1
RETURNING *;

-- name: DeleteDiscount :exec
DELETE FROM student_discounts
WHERE id = $1;

-- name: GetTotalDiscountPercentByStudent :one
SELECT COALESCE(SUM(percent), 0)::NUMERIC AS total_discount_percent
FROM student_discounts
WHERE student_id = $1;