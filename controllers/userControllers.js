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

export const updateUser = async (req, res) => {
    try {
        const database = await connectDb();
        const { id } = req.params;
        const { name, email, phone_number, gender } = req.body;

        if (!name || !email || !phone_number || !gender) {
            return res.status(500).json({ message: 'Kindly fill all the required fields' });
        }

        const [_updatedUser] = await database.execute('UPDATE users SET name = ?, email = ?, phone_number = ?, gender = ? WHERE id = ?;', [name, email, phone_number, gender, id]);

        if (updateUser.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' })
        }

        return res.status(200).json({ message: 'User updated successfully' })
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const database = await connectDb();
        const { id } = req.body;

        const [_deletedUser] = await database.execute('DELETE FROM users WHERE id = ?', [id]);

        if (_deletedUser.affectedRows === 0) {
            return res.status(404).json({ message: 'User to be deleted not found' })
        };

        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}