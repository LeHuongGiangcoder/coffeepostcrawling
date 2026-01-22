const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: true,
    },
});

async function checkImages() {
    try {
        const res = await pool.query("SELECT id, title, metadata FROM curated_coffee_posts WHERE approval_status = 'pending' LIMIT 5");

        console.log("Found " + res.rows.length + " posts.");
        for (const row of res.rows) {
            console.log(`\nPost: ${row.title}`);
            console.log('Metadata keys:', Object.keys(row.metadata));
            // Check for common image keys
            if (row.metadata.images) console.log('metadata.images:', JSON.stringify(row.metadata.images, null, 2));
            if (row.metadata.image) console.log('metadata.image:', row.metadata.image);
            if (row.metadata.og_image) console.log('metadata.og_image:', row.metadata.og_image);

            // Just print the whole metadata if unsure
            console.log('Full Metadata:', JSON.stringify(row.metadata, null, 2));
        }

        await pool.end();
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkImages();
