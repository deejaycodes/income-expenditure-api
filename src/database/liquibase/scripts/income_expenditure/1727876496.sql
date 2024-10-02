-- transaction entries table

CREATE TABLE IF NOT EXISTS transaction_entries (
    transaction_entry_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    type transaction_type NOT NULL, 
    date TIMESTAMP NOT NULL,
    statement_id UUID,
    FOREIGN KEY (statement_id) REFERENCES statements(statement_id) ON DELETE CASCADE
);
