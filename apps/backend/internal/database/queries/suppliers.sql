-- name: CreateSupplier :one
INSERT INTO suppliers (company_name, vat_no, phone)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetSupplierByID :one
SELECT * FROM suppliers WHERE id = $1;

-- name: ListSuppliers :many
SELECT * FROM suppliers ORDER BY company_name ASC LIMIT $1 OFFSET $2;

-- name: UpdateSupplier :one
UPDATE suppliers
SET company_name = $2, vat_no = $3, phone = $4
WHERE id = $1
RETURNING *;

-- name: DeleteSupplier :execresult
DELETE FROM suppliers WHERE id = $1; 

-- name: GetSupplierCount :one
SELECT COUNT(*) FROM suppliers;