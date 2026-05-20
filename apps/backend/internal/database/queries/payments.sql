-- name: AddPayment :one
INSERT INTO payments (student_id, amount, added_by, remarks, payment_mode)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetPaymentsByStudent :many
SELECT p.*, a.name AS added_by_name
FROM payments p
JOIN users a ON a.id = p.added_by
WHERE p.student_id = $1
ORDER BY p.added_at ASC;

-- name: GetTotalPaidByStudent :one
SELECT COALESCE(SUM(amount), 0)::INTEGER AS total_paid
FROM payments
WHERE student_id = $1;

-- name: DeletePayment :exec
DELETE FROM payments WHERE id = $1;

-- name: GetStudentPayments :many
SELECT 
p.id,
p.amount,
p.payment_mode,
p.remarks,
p.added_at
FROM payments p WHERE p.student_id = $1 ORDER BY p.added_at ASC;