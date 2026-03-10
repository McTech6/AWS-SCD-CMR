import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    connectionString: process.env.DATABASE_URL || "postgresql://postgres:Assurance@localhost:5432/aws_community_day?schema=public"
});

async function run() {
    try {
        await client.connect();
        console.log('Connected to database.');
        const res = await client.query('DELETE FROM speakers;');
        console.log(`Deleted ${res.rowCount} rows from speakers table.`);

        // Also cleanup users that are ONLY speakers? 
        // Usually, we just want to clear the speakers table for testing the application flow.
    } catch (err) {
        console.error('Error executing query', err);
    } finally {
        await client.end();
    }
}

run();
