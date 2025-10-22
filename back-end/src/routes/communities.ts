import { Request, Response, Router } from 'express';
import MongoSingleton from '../singleton';
import {validatedToken} from "@/helpers/functions";

const router = Router();

router.post('/communities', async (req: Request, res: Response) => {
    try {
        await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

        return res.status(201).json({ message: 'Community created successfully' });
    } catch (err) {
        return res.status(500).json({ error: 'Internal error!' });
    }
});

router.get('/communities', async (req: Request, res: Response) => {
    try {
        await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

        return res.json({ communities: [] });
    } catch (err) {
        return res.status(500).json({ error: 'Internal error!' });
    }
});

router.get('/communities/:id', async (req: Request, res: Response) => {
    try {
        await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

        return res.json({});
    } catch (err) {
        return res.status(500).json({ error: 'Internal error!' });
    }
});

router.patch('/communities/:id', async (req: Request, res: Response) => {
    try {
        await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

        return res.json({ message: 'Community updated successfully' });
    } catch (err) {
        return res.status(500).json({ error: 'Internal error!' });
    }
});

router.delete('/communities/:id', async (req: Request, res: Response) => {
    try {
        await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

        return res.json({ message: 'Community deleted successfully' });
    } catch (err) {
        return res.status(500).json({ error: 'Internal error!' });
    }
});

router.post('/communities/:id/join', async (req: Request, res: Response) => {
    try {
        await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

        return res.json({ message: 'Joined community successfully' });
    } catch (err) {
        return res.status(500).json({ error: 'Internal error!' });
    }
});

router.post('/communities/:id/leave', async (req: Request, res: Response) => {
    try {
        await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

        return res.json({ message: 'Left community successfully' });
    } catch (err) {
        return res.status(500).json({ error: 'Internal error!' });
    }
});

router.get('/communities/:id/members', async (req: Request, res: Response) => {
    try {
        await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

        return res.json({ members: [] });
    } catch (err) {
        return res.status(500).json({ error: 'Internal error!' });
    }
});

export default router;
