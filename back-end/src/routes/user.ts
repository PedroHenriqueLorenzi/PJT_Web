import { Request, Response, Router } from 'express';
import MongoSingleton from '../singleton';

import bcrypt from 'bcrypt';
import { upload } from "../middlewares/upload";
import {User} from "src/models/User"
import {Follow} from "src/models/Follow";
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
        const user = await validatedToken(req.headers.authorization);

        const db = await MongoSingleton.getInstance();
        const userModel = new User(db);
        const followModel = new Follow(db);

        const users = await userModel
            .collection()
            .find({ _id: { $ne: user._id } })
            .project({
                name: 1,
                username: 1,
                email: 1,
                age: 1,
                createdAt: 1,
                avatar_url: 1
            })
            .toArray();

        const following = await followModel
            .collection()
            .find({ followerId: user._id })
            .toArray();

        const followingIds = new Set(
            following.map(f => f.followingId.toString())
        );

        const enrichedUsers = users.map(u => ({
            ...u,
            isFollowing: followingIds.has(u._id.toString())
        }));

        return res.status(200).json({
            success: true,
            users: enrichedUsers
        });
    } catch (err) {
        return res.status(500).json({ error: 'Internal error!' });
    }
});

// fixme - falta aqui. (revisar)
router.patch('/users/me', upload.single("avatar"), async (req: Request, res: Response) => {
    try {
        const user = await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();
        const userModel = new User(db);

        const { username, email, password, age, notification } = req.body;

        const updateData: any = {};

        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (age) updateData.age = Number(age);

        if (notification !== undefined) {
            updateData.notification = notification === "true" || notification === true;
        }

        // Se enviaram nova senha
        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            updateData.passwordH = await bcrypt.hash(password, salt);
        }

        // Se avatar foi enviado
        if (req.file) {
            updateData.avatar_url = `/uploads/${req.file.filename}`;
        }

        updateData.updatedAt = new Date();

        await userModel.update(user._id!.toString(), updateData);

        // REFETCH para garantir retorno 100% atualizado
        const updatedUser = await userModel.findById(user._id!.toString());

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Remover campos sensíveis
        const { passwordH, ...safeUser } = updatedUser;

        return res.json({
            success: true,
            user: safeUser
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal error!" });
    }
});

router.get('/users/:id/follow', async (req, res) => {
    try {
        const auth = await validatedToken(req.headers.authorization);

        const db = await MongoSingleton.getInstance();
        const followModel = new Follow(db);

        const targetUserId = req.params.id;

        const alreadyFollows = await followModel.isFollowing(auth._id, targetUserId);

        if (alreadyFollows) {
            await followModel.unfollow(auth._id, targetUserId);
        } else {
            await followModel.follow(auth._id, targetUserId);
        }

        return res.status(200).json({
            success: true,
            following: !alreadyFollows
        });

    } catch (err) {
        return res.status(500).json({ error: 'Internal error!' });
    }
});

export default router;
