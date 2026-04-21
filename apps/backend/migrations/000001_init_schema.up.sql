CREATE TABLE settings (
    key   VARCHAR PRIMARY KEY,
    value VARCHAR NOT NULL
);

CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR NOT NULL,
    email         VARCHAR NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL,
    image_url     TEXT,
    role          VARCHAR NOT NULL DEFAULT 'user' CHECK (role IN('user','admin','superadmin')),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
); 

CREATE TABLE courses (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR NOT NULL,
    fee        INTEGER NOT NULL,
    is_active  BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE students (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_no   VARCHAR NOT NULL UNIQUE,
    fiscal_year    VARCHAR NOT NULL,
    serial_no      INTEGER NOT NULL,
    full_name      VARCHAR NOT NULL,
    dob            DATE NOT NULL,
    gender         VARCHAR NOT NULL,
    phone          VARCHAR NOT NULL UNIQUE,
    email          VARCHAR UNIQUE,
    address        TEXT NOT NULL,
    guardian_name  VARCHAR NOT NULL,
    guardian_phone VARCHAR NOT NULL,
    photo_url      VARCHAR,
    source         VARCHAR NOT NULL,
    claimed_amount INTEGER NOT NULL,
    status         VARCHAR NOT NULL DEFAULT 'pending',
    notes          TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_serial_per_fiscal_year UNIQUE (fiscal_year, serial_no)
);

CREATE TABLE student_courses (
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id  UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    PRIMARY KEY (student_id, course_id)
);

CREATE TABLE payments (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    amount     INTEGER NOT NULL,
    added_by   UUID NOT NULL REFERENCES users(id),
    added_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    remarks    VARCHAR
);

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

CREATE TABLE certificates (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    issued_by  UUID NOT NULL REFERENCES users(id),
    issued_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    remarks    VARCHAR
);

-- seed default settings
INSERT INTO settings (key, value) VALUES
    ('ref_prefix',   'BKC'),
    ('fiscal_year',  '082/083');