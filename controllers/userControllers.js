// this is just a test file
import connectDb from "../config/database.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const createUser = async (req, res) => {
    try {
        const database = await connectDb();
        const { name, email, phone_number, gender, dob, national_id, address, employee_id, department, employment_status, system_role, permission_level, username, password } = req.body;

        if (!name || !email || !phone_number) {
            return res.status(400).json({ error: 'Kindly fill all the fields' })
        };

        const saltRounds = 10;

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const [newAdmin] = await database.execute('INSERT INTO users (name, email, phone_number, gender, dob, national_id, address, employee_id, department, employment_status, system_role, permission_level, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, email, phone_number, gender, dob, national_id, address, employee_id, department, employment_status, system_role, permission_level, username, hashedPassword]);
        res.status(201).json({ message: 'Admin Added successfully', admin: newAdmin.name });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(500).json({ message: 'Email or Username already exists' });
        }
        res.status(500).json({ error: error.message });
    }
}

