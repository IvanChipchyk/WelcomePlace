# WelcomePlace - Turso SQLite Database Configuration

## Database Information
- **Engine**: SQLite / LibSQL (Serverless Cloud SQLite)
- **Database Name**: `welcomeplace`
- **Location**: Montreal, Canada (`yul` / `aws-ca-central-1`)
- **Protocol**: LibSQL Pipeline API over HTTPS

## Connection Credentials
- **Database URL (LibSQL)**: `libsql://welcomeplace-benedict16.aws-ca-central-1.turso.io`
- **HTTPS Pipeline Endpoint**: `https://welcomeplace-benedict16.aws-ca-central-1.turso.io/v2/pipeline`
- **Auth Token (JWT)**: `eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTMxNTUzMzUsImlkIjoiMDFhMTgwNjItNmEwMS03NGIwLWJiYTktYjI2YzNkNzE0NDAwIiwia2lkIjoiVDI4T09yVkFjU1I0SHgtRzZ2WlJzbDNURnFJaFpOVng4YTd2dUhrdXVFSSIsInJpZCI6ImY0MWFjZDZkLThhMWUtNDdlZS1hNWIwLTYzYTBlNjk2OTBhMyJ9.ymDrD31D7xh4vUk00c3MWSHMW88l0Od82qtaUBLYvXKdw-429aXo9XNm-AhujaORCRRpKr4wsLvQQTv2qoP3Bw`

## SQLite Schema
```sql
CREATE TABLE IF NOT EXISTS students (
  nickname TEXT PRIMARY KEY,
  password TEXT,
  avatar_id TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS teachers (
  id TEXT PRIMARY KEY,
  name TEXT,
  username TEXT UNIQUE,
  password TEXT,
  specialization TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS metrics (
  id TEXT PRIMARY KEY,
  student_name TEXT,
  module_id TEXT,
  module_title TEXT,
  module_code TEXT,
  score_percent INTEGER,
  correct_count INTEGER,
  total_questions INTEGER,
  duration_seconds INTEGER,
  status TEXT,
  details_json TEXT,
  timestamp TEXT
);
```

## Features
1. **Zero Maintenance**: No server process to manage, restarts or maintenance downtime.
2. **Instant Sync**: Changes made in any browser or incognito session are instantly synchronized.
3. **Offline Fallback**: Automatic local cache via LocalStorage ensures the app continues running offline even if the network drops.
