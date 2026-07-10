ALTER TABLE certificates
    ALTER COLUMN id TYPE INTEGER USING id::INTEGER;

ALTER TABLE certificates
    ALTER COLUMN id SET DEFAULT nextval('certificates_id_seq');