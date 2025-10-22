import { Request, Response, Router } from 'express';
import MongoSingleton from '../singleton';
import {validatedToken} from "@/helpers/functions";

const router = Router();

router.post('/posts/:id/comments', async (req: Request, res: Response) => {
    try {
        await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

    } catch (err) {
        return res.status(500).json({ error: 'Internal error!' });
    }
});

router.get('/posts/:id/comments', async (req: Request, res: Response) => {
    try {
        await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

    } catch (err) {
        return res.status(500).json({ error: 'Internal error!' });
    }
});

router.patch('/comments/:id', async (req: Request, res: Response) => {
    try {
        await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

    } catch (err) {
        return res.status(500).json({ error: 'Internal error!' });
    }
});

router.delete('/comments/:id', async (req: Request, res: Response) => {
    try {
        await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

    } catch (err) {
        return res.status(500).json({ error: 'Internal error!' });
    }
});

export default router;
