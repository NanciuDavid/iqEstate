import { Router, Request, Response } from 'express';

const {neon} = require('@neondatabase/serverless');
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

require("dotenv").config();
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;

enum UserType {
    user = 'user',
    admin = 'admin'
}

class UserClass{

    user_type : string;
    profile_picture_url : string;
    is_verified : boolean;
    created_at = Date();
    updated_at = Date();
    id =  randomUUID();
    email : string;
    password : string;
    firstName : string;
    lastName : string;
    phoneNumber : string;

    constructor(user_type : string, profile_picture_url : string, is_verified : boolean, created_at : Date, updated_at : Date, id : string, email : string, password : string, firstName : string, lastName : string, phoneNumber : string, createAt : Date, updateAt : Date){
        this.user_type = 'user';
        this.profile_picture_url = 'https://www.pexels.com/photo/man-wearing-blue-crew-neck-t-shirt-2379005/';
        this.is_verified = false;
        this.created_at = created_at.toISOString();
        this.updated_at = updated_at.toISOString();
        this.id = randomUUID();
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
    }


}

const sql = neon(process.env.DB_URL);

router.post('/register', async (req: Request, res: Response): Promise<void> => {
    const { email, password, firstName, lastName, phoneNumber } = req.body;

    if (!email || !password) {
        res.status(400).json({
            message: 'Email and password are required'
        });
        return;
    }

    if (!firstName || !lastName || !phoneNumber) {
        res.status(400).json({
            message: 'First name, last name, and phone number are required'
        });
        return;
    }

    if (password.length < 8) {
        res.status(400).json({
            message: 'Password must be at least 8 characters long'
        });
        return;
    }

    if (!JWT_SECRET) {
        res.status(500).json({
            message: 'JWT_SECRET is not set'
        });
        return;
    }
    try {
        const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`;
        const existingPhone = await sql`SELECT * FROM users WHERE phone_number = ${phoneNumber}`;

        if (existingUser.length > 0) {
            res.status(400).json({
                message: "There is already an account with this email."
            });
            return;
        }

        if (existingPhone.length > 0) {
            res.status(400).json({
                message: "There is already an account with this phone number."
            });
            return;
        }

        // Hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const createAt = new Date();
        const updateAt = new Date();

        const id = randomUUID();
        const user_type = UserType.user;
        const profile_picture_url = 'https://www.pexels.com/photo/man-wearing-blue-crew-neck-t-shirt-2379005/';
        const is_verified = false;


        const User = new UserClass(email, profile_picture_url, is_verified, createAt, updateAt, id, email, hashedPassword, firstName, lastName, phoneNumber, createAt, updateAt);

        const result = await sql`INSERT INTO users ( user_id, email, password_hash, first_name, last_name, phone_number, created_at, updated_at, user_type, profile_picture_url, is_verified)
                                VALUES (${User.id}, ${User.email}, ${hashedPassword}, ${User.firstName}, ${User.lastName}, ${User.phoneNumber}, ${User.created_at}, ${User.updated_at}, 
                                ${User.user_type}, ${User.profile_picture_url}, ${User.is_verified}) 
                                RETURNING user_id`;

        const newUser = result[0];
        
        // generating JWT

        const payload = {
            user : {
                id: newUser.id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                phoneNumber: newUser.phoneNumber,
                user_type: newUser.user_type,
                profile_picture_url: newUser.profile_picture_url,
                is_verified: newUser.is_verified,
                created_at: newUser.created_at,
                updated_at: newUser.updated_at,
            }
        };

        const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'});

        res.status(201).json({
            message: 'User registered successfully',
            token: token,
            user: {
                user_id: newUser.user_id,
                email: newUser.email,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                user_type: newUser.user_type,
                profile_picture_url: newUser.profile_picture_url,
                is_verified: newUser.is_verified
            }
        });
    
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
        return;
    }
});

router.post('/login', async(req: Request, res : Response): Promise<void> => {
    const {email, password} = req.body;

    if(!email || !password) {
        res.status(400).json({
            message : "Email and password are required"
        })
        return;
    }

    if(!JWT_SECRET) {
        res.status(500).json({
            message : "JWT_SECRET is not set"
        })
        return;
    }

    try{
        const user = await sql`SELECT * FROM users where email = ${email}`;

        if(user.length === 0) {
            res.status(401).json({
                message : "Invalid credentials"
            })
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user[0].password_hash);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Password is incorrect" });
            return;
        }

        const payload = {
            user : {
                id : user[0].user_id,
                email : user[0].email,
                firstName : user[0].first_name,
            }
        }

        const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'});

        res.status(200).json({
            message : "Login successful",
            token : token
        })
    }catch(error) {
        console.error('Error logging in:', error);
        res.status(500).json({
            message : "Internal server error"
        })
        return;
    }
});


export default router;