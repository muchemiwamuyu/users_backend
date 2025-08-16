// medicare hospital admin creation logic 
import connectDb from "../config/database.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// register admin
export const createAdmin = async (req, res) => {
    try {
        const database = await connectDb();
        const {name, email, phone_number, gender, dob, national_id, address, employee_id, department, employment_status, system_role, permission_level, username, password} = req.body;

        if (!name || !email || !phone_number) {
            return res.status(400).json({error: 'Kindly fill all the fields'})
        };

        const saltRounds = 10;

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const [newAdmin] = await database.execute('INSERT INTO users (name, email, phone_number, gender, dob, national_id, address, employee_id, department, employment_status, system_role, permission_level, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, email, phone_number, gender, dob, national_id, address, employee_id, department, employment_status, system_role, permission_level, username, hashedPassword]);
        res.status(201).json({message: 'Admin Added successfully', admin: newAdmin.name});
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(500).json({message: 'Email or Username already exists'});
        }
        res.status(500).json({error: error.message});
    }
};

// login admin

export const loginAdmin = async (req, res) => {
    try {
        // identifier can be email or username
        const {identifier, password} = req.body;
        const db = await connectDb();

        const [rows] = await db.execute('SELECT * FROM users WHERE (email = ? OR username = ?)', [identifier, identifier]);

        if (rows.length === 0) {
            return res.status(401).json({message: 'Invalid email/username or password'});
        }

        const user = rows[0];

        // check password
        const matching = await bcrypt.compare(password, user.password);

        if (!matching) {
            return res.status(401).json({message: 'Invalid email/username or password'});
        }

        // generating token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        

        // If we reach this point, the login is successful
        res.status(200).json({message: 'Login successful', user: {id: user.id, name: user.name, email: user.email}, token});

    } catch (error) {
        console.error('Error during admin login:', error);
        return res.status(500).json({error: error.message});
    }
}

