CREATE TABLE banks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- only one bank can be default at a time
CREATE UNIQUE INDEX idx_banks_single_default ON banks(is_default) WHERE is_default = TRUE;