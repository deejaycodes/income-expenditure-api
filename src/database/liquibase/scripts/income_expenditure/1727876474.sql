-- statments table

CREATE TABLE IF NOT EXISTS statements (
    statement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    total_income DECIMAL(10, 2) NOT NULL,
    total_expenditure DECIMAL(10, 2) NOT NULL,
    disposable_income DECIMAL(10, 2) NOT NULL,
    rating VARCHAR(1),
    user_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
