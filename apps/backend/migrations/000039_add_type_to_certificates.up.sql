ALTER TABLE certificates
    ADD COLUMN type TEXT NOT NULL DEFAULT 'normal'
    CHECK (type IN ('normal', 'workshop'));