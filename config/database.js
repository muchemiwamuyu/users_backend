import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import process from 'node:process'

dotenv.config();

async function connectDb() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        })
        console.log('mySQL has been connected')
        return connection
    } catch (error) {
        console.log('Error connecting to the database', error);
        process.exit(1);
    }
}

export default connectDb;