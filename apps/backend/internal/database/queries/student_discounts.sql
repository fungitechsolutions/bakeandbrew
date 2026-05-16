-- name: CreateDiscount :one
INSERT INTO student_discounts (student_id, type, percent, note, amount, added_by)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: GetDiscountByID :one
SELECT * FROM student_discounts
WHERE id = $1;

-- name: ListDiscountsByStudent :many
SELECT 
    sd.*,
    u.name AS added_by_name
FROM student_discounts sd
JOIN users u ON u.id = sd.added_by
WHERE sd.student_id = $1
ORDER BY sd.created_at DESC;

-- name: UpdateDiscount :one
UPDATE student_discounts
SET type = $2, percent = $3, note = $4, amount = $5
WHERE id = $1
RETURNING *;

-- name: DeleteDiscount :exec
DELETE FROM student_discounts
WHERE id = $1;

-- name: GetTotalDiscountPercentByStudent :one
SELECT COALESCE(SUM(percent), 0)::NUMERIC AS total_discount_percent
FROM student_discounts
WHERE student_id = $1;