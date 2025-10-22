import { Request, Response, Router } from 'express';
import MongoSingleton from '../singleton';
import {validatedToken} from "@/helpers/functions";

const router = Router();

router.get('/notifications', async (req: Request, res: Response) => {
    try {
        await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

    } catch (err) {
        return res.status(500).json({ error: 'Internal error!' });
    }
});

router.delete('/notifications/:id', async (req: Request, res: Response) => {
    try {
        await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

    } catch (err) {
        return res.status(500).json({ error: 'Internal error!' });
    }
});

export default router;
