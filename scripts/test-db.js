const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
console.log('Testing connection to:', connectionString ? 'Defined' : 'Undefined');

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: true,
    },
});

async function test() {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Connection Successful!', res.rows[0]);
        await pool.end();
    } catch (err) {
        console.error('Connection Failed:', err);
        process.exit(1);
    }
}

test();
