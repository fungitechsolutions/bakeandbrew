-- name: CreateBankAccount :one
INSERT INTO bank_accounts (bank_id, account_name, account_number)
VALUES ($1, $2, $3)
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
ORDER BY ba.created_at DESC LIMIT $1 OFFSET $2;

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

-- name: UpdateBankAccount :execresult
UPDATE bank_accounts
SET account_name = $2, account_number = $3
WHERE id = $1;

-- name: DeleteBankAccount :execresult
DELETE FROM bank_accounts WHERE id = $1;

-- name: UnsetDefaultBankAccount :exec
UPDATE bank_accounts SET is_default = FALSE WHERE is_default = TRUE;

-- name: SetBankAccountAsDefault :execresult
UPDATE bank_accounts SET is_default = TRUE WHERE id = $1;

-- name: GetBankAccountsCount :one
SELECT COUNT(*) FROM bank_accounts;