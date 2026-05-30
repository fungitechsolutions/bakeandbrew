-- name: CreateSupplierLedgerEntry :one
INSERT INTO supplier_ledger (supplier_id, date, bs_date, entry_type, amount, description, stock_in_id)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: GetSupplierLedgerEntryByID :one
SELECT
    sl.*,
    s.company_name AS supplier_name
FROM supplier_ledger sl
JOIN suppliers s ON s.id = sl.supplier_id
WHERE sl.id = $1;

-- name: ListSupplierLedger :many
SELECT
    sl.*,
    s.company_name AS supplier_name
FROM supplier_ledger sl
JOIN suppliers s ON s.id = sl.supplier_id
WHERE
    (sqlc.narg('supplier_id')::uuid IS NULL OR sl.supplier_id = sqlc.narg('supplier_id')::uuid)
    AND (sqlc.narg('from_date')::date IS NULL OR sl.date >= sqlc.narg('from_date')::timestamptz)
    AND (sqlc.narg('to_date')::date IS NULL OR sl.date <= sqlc.narg('to_date')::timestamptz)
ORDER BY sl.date DESC
LIMIT $1 OFFSET $2;


-- name: ListSupplierLedgerBySupplier :many
SELECT
    sl.*,
    s.company_name AS supplier_name
FROM supplier_ledger sl
JOIN suppliers s ON s.id = sl.supplier_id
WHERE sl.supplier_id = $1
ORDER BY sl.date DESC
LIMIT $2 OFFSET $3;

-- name: ListSupplierLedgerByDateRange :many
SELECT
    sl.*,
    s.company_name AS supplier_name
FROM supplier_ledger sl
JOIN suppliers s ON s.id = sl.supplier_id
WHERE sl.bs_date >= $1 AND sl.bs_date <= $2
ORDER BY sl.date ASC;

-- name: GetSupplierLedgerSummaryBySupplier :one
SELECT
    COALESCE(SUM(amount) FILTER (WHERE entry_type = 'cr'), 0) AS total_cr,
    COALESCE(SUM(amount) FILTER (WHERE entry_type = 'dr'), 0) AS total_dr,
    COALESCE(SUM(amount) FILTER (WHERE entry_type = 'cr'), 0) -
    COALESCE(SUM(amount) FILTER (WHERE entry_type = 'dr'), 0) AS outstanding
FROM supplier_ledger
WHERE supplier_id = $1;

-- name: GetSupplierLedgerSummary :one
SELECT
    COALESCE(SUM(amount) FILTER (WHERE entry_type = 'cr'), 0) AS total_cr,
    COALESCE(SUM(amount) FILTER (WHERE entry_type = 'dr'), 0) AS total_dr,
    COALESCE(SUM(amount) FILTER (WHERE entry_type = 'cr'), 0) -
    COALESCE(SUM(amount) FILTER (WHERE entry_type = 'dr'), 0) AS outstanding
FROM supplier_ledger sl
JOIN suppliers s ON s.id = sl.supplier_id
WHERE
    (sqlc.narg('supplier_id')::uuid IS NULL OR sl.supplier_id = sqlc.narg('supplier_id')::uuid)
    AND (sqlc.narg('from_date')::date IS NULL OR sl.date >= sqlc.narg('from_date')::timestamptz)
    AND (sqlc.narg('to_date')::date IS NULL OR sl.date <= sqlc.narg('to_date')::timestamptz);

-- name: GetSupplierLedgerCount :one
SELECT COUNT(*) FROM supplier_ledger sl
WHERE
    (sqlc.narg('supplier_id')::uuid IS NULL OR sl.supplier_id = sqlc.narg('supplier_id')::uuid)
    AND (sqlc.narg('from_date')::date IS NULL OR sl.date >= sqlc.narg('from_date')::timestamptz)
    AND (sqlc.narg('to_date')::date IS NULL OR sl.date <= sqlc.narg('to_date')::timestamptz);

-- name: DeleteSupplierLedgerEntry :exec
DELETE FROM supplier_ledger WHERE id = $1;

