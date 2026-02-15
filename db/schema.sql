-- Database Schema for Appointment Booking System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Appointments Table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Chat Sessions Table
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Chat Messages Table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    sender_type VARCHAR(20) CHECK (sender_type IN ('user', 'ai', 'system')),
    content TEXT NOT NULL,
    metadata JSONB, -- For storing structured data extracted by AI
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
-- users: lookup by email for login and uniqueness checks
CREATE INDEX idx_users_email ON users(email);
-- appointments: filter by user and by time range (list, calendar views)
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_start_time ON appointments(start_time);
-- chat: list sessions per user; load messages per session in order
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

-- Performance considerations:
-- - Indexes above support the main query patterns (auth by email, appointments by user/time, chat by session).
-- - For high volume, consider: composite index (user_id, start_time) on appointments for "my upcoming" queries;
--   partitioning appointments by start_time (e.g. monthly) if table grows very large.
-- - Optional multi-tenancy: add business_id to users/appointments/chat_sessions and index it for tenant isolation.

-- Sample insert statements (optional — run once for local testing)
-- Demo user: email demo@example.com, password 'password123' (bcrypt hash below)
INSERT INTO users (id, email, password_hash, full_name) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'demo@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Demo User')
ON CONFLICT (email) DO NOTHING;

INSERT INTO appointments (user_id, title, description, start_time, end_time, status)
SELECT 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Sample Meeting', 'Initial consultation', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '1 hour', 'scheduled'
WHERE EXISTS (SELECT 1 FROM users WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');

INSERT INTO chat_sessions (user_id, title)
SELECT 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Sample Chat'
WHERE EXISTS (SELECT 1 FROM users WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');
