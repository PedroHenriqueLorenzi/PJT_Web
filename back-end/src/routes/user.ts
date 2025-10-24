import { Request, Response, Router } from 'express';
import MongoSingleton from '../singleton';

import bcrypt from 'bcrypt';

import {User} from "src/models/User"
import {validatedToken} from "@/helpers/functions";

const router = Router();

router.get('/users/me', async (req: Request, res: Response) => {
    try {
        const user = await new User(await MongoSingleton.getInstance()).findById(
            (await validatedToken(req.headers.authorization))._id!.toString()
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);

    } catch (err) {
        return res.status(500).json({ error: 'Internal error!' });
    }
});

// router.patch('/users/me', async (req: Request, res: Response) => {
//     try {
//         const userId = await validatedToken(req.headers.authorization);
//         const { name, username, email, password, age, notification, avatar_url } = req.body;
//         const db = await MongoSingleton.getInstance();
//
//     } catch (err) {
//         return res.status(500).json({ error: 'Internal error!' });
//     }
// });
//
// router.get('/users/:id', async (req: Request, res: Response) => {
//     try {
//         await validatedToken(req.headers.authorization);
//         const { id } = req.params;
//
//         const db = await MongoSingleton.getInstance();
//         const userModel = new User(db);
//
//         const user = await userModel.findById(id);
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//
//         const { passwordH, notification, ...userData } = user;
//
//         return res.json(userData);
//
//     } catch (err) {
//         return res.status(500).json({ error: 'Internal error!' });
//     }
// });
//
// router.delete('/users/me', async (req: Request, res: Response) => {
//     try {
//         const userId = await validatedToken(req.headers.authorization);
//         const db = await MongoSingleton.getInstance();
//
//
//     } catch (err) {
//         return res.status(500).json({ error: 'Internal error!' });
//     }
// });

export default router;
