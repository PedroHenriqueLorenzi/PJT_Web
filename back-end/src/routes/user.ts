import { Request, Response, Router } from 'express';
import MongoSingleton from '../singleton';

import bcrypt from 'bcrypt';

import {User} from "src/models/User"
import {validatedToken} from "@/helpers/functions";

const router = Router();

router.get('/users/me', async (req: Request, res: Response) => {
    try {
        const user = await validatedToken(req.headers.authorization);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);

    } catch (err: any) {
        if (err.status === 401) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        console.error(err);
        return res.status(500).json({ error: 'Internal error!' });
    }
});

router.delete('/users/me', async (req: Request, res: Response) => {
    try {

    } catch (err: any) {
        if (err.status === 401) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        console.error(err);
        return res.status(500).json({ error: 'Internal error!' });
    }
});

router.get('/users', async (req: Request, res: Response) => {
    try {
        const db = await MongoSingleton.getInstance();
        const userModel = new User(db);

        const users = await userModel.findAll();

        return res.json(users);
    } catch (err) {
        return res.status(500).json({ error: 'Internal error!' });
    }
});

// fixme - falta aqui. (revisar)
router.patch('/users/me', async (req: Request, res: Response) => {
    try {
        const user = await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();
        const userModel = new User(db);


        const { username, email, password } = req.body;

        if (username) user.username = username;
        if (email) user.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.passwordH = await bcrypt.hash(password, salt);
        }

        await userModel.update(user._id!.toString(), user);

        const { passwordH, notification, ...updatedUserData } = user;

        return res.json(updatedUserData);

    } catch (err) {
        return res.status(500).json({ error: 'Internal error!' });
    }
});

export default router;
