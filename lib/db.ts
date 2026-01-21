import { Pool, QueryResult, QueryResultRow } from 'pg';

// Use a global variable to store the pool instance in development
// to prevent exhausting connections during hot reloads.
declare global {
  var pool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // We warn but don't throw immediately to allow build to pass if env is missing
  console.warn('WARNING: DATABASE_URL is not defined in environment variables.');
}

export const pool = global.pool || new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: true, // Neon requires SSL
  },
  max: 10, // Adjust based on plan
  idleTimeoutMillis: 30000,
});

if (process.env.NODE_ENV !== 'production') {
  global.pool = pool;
}

export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    // console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}
