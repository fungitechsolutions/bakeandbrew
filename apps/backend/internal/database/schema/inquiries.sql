CREATE TABLE inquiries (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name  VARCHAR NOT NULL,
    phone      VARCHAR NOT NULL,
    email      VARCHAR,
    message    TEXT NOT NULL,
    source     VARCHAR NOT NULL,
    is_read    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
