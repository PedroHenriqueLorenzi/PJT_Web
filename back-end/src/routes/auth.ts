import { Request, Response, Router } from 'express';
import MongoSingleton from '../singleton';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {User} from "src/models/User"

import fs from 'fs';
import path from 'path';

const router = Router();


const SESSION_TIMEOUT = 60 * 60 * 1000;
const JWT_SECRET = process.env.SECRET_KEY!;

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const db = await MongoSingleton.getInstance();
        const userModel = new User(db);

        const user = await userModel.findByEmail(email);

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordH);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        const token = jwt.sign(
            { id: user._id?.toString(), email: user.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        const newExpirationTime = new Date(Date.now() + SESSION_TIMEOUT);
        await userModel.update(user._id!.toString(), { token_expires_at: newExpirationTime });

        const { passwordH: _, ...userWithoutPassword } = user;

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: userWithoutPassword._id,
                email: userWithoutPassword.email,
                username: userWithoutPassword.username,
                notification: userWithoutPassword.notification,
                name: userWithoutPassword.name,
                age: userWithoutPassword.age || null,
                avatar_url: userWithoutPassword.avatar_url || null,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
});


router.post('/register', async (req: Request, res: Response) => {
    try {
        const { name, username, email, password, age, notification, avatar_url } = req.body;

        if (!name || !username || !email || !password) {
            return res.status(400).json({ error: 'Name, username, email and password are required' });
        }

        const db = await MongoSingleton.getInstance();
        const userModel = new User(db);

        const existingUser = await userModel.collection().findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            if (existingUser.email === email) return res.status(400).json({ error: 'Email already in use' });
            if (existingUser.username === username) return res.status(400).json({ error: 'Username already in use' });
        }

        const passwordH = await bcrypt.hash(password, 10);

        let avatarPath = '';
        if (avatar_url && avatar_url.startsWith('data:image')) {
            const base64Data = avatar_url.split(',')[1];
            const fileName = `${Date.now()}_${username}.png`;
            const filePath = path.join('uploads', fileName);

            fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
            avatarPath = `/uploads/${fileName}`;
        }

        await userModel.create({
            name,
            username,
            email,
            passwordH,
            age: age || null,
            notification: notification || false,
            avatar_url: avatarPath,
            token_expires_at: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return res.status(201).json({
            success: true,
            message: "Registration successful.",
        });


    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
});

export default router;
