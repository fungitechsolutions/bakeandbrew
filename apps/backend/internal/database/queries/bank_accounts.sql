-- name: CreateBankAccount :one
INSERT INTO bank_accounts (bank_id, account_name, account_number, is_default)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetBankAccountByID :one
SELECT
    ba.*,
    b.name AS bank_name,
    b.is_default AS bank_is_default
FROM bank_accounts ba
JOIN banks b ON b.id = ba.bank_id
WHERE ba.id = $1;

-- name: ListBankAccounts :many
SELECT
    ba.*,
    b.name AS bank_name,
    b.is_default AS bank_is_default
FROM bank_accounts ba
JOIN banks b ON b.id = ba.bank_id
ORDER BY ba.created_at DESC;

-- name: ListBankAccountsByBank :many
SELECT
    ba.*,
    b.name AS bank_name,
    b.is_default AS bank_is_default
FROM bank_accounts ba
JOIN banks b ON b.id = ba.bank_id
WHERE ba.bank_id = $1
ORDER BY ba.created_at DESC;

-- name: GetDefaultBankAccount :one
SELECT
    ba.*,
    b.name AS bank_name,
    b.is_default AS bank_is_default
FROM bank_accounts ba
JOIN banks b ON b.id = ba.bank_id
WHERE b.is_default = TRUE
LIMIT 1;

-- name: UpdateBankAccount :one
UPDATE bank_accounts
SET bank_id = $2, account_name = $3, account_number = $4
WHERE id = $1
RETURNING *;

-- name: DeleteBankAccount :exec
DELETE FROM bank_accounts WHERE id = $1;

-- name: UnsetDefaultBankAccount :exec
UPDATE bank_accounts SET is_default = FALSE WHERE is_default = TRUE;

-- name: SetBankAccountAsDefault :one
UPDATE bank_accounts SET is_default = TRUE WHERE id = $1
RETURNING *;