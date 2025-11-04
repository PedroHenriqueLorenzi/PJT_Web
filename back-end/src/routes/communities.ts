// Aux;
import { Request, Response, Router } from 'express';
const router = Router();
import MongoSingleton from '../singleton';

// Functions;
import {validatedToken} from "@/helpers/functions";

// Models;
import {Community} from "@/models/Community";
import {CommunityMember} from "@/models/CommunityMembers";


router.get('/communities', async (req: Request, res: Response) => {
    try {
        // 1. Valida token e pega usuário logado
        const user = await validatedToken(req.headers.authorization);
        const userId = user._id as string;

        // 2. Conecta ao Mongo
        const db = await MongoSingleton.getInstance();

        // 3. Inicializa os models
        const communitiesModel = new Community(db);
        const communityMembersModel = new CommunityMember(db);

        // 4. Busca os registros de CommunityMember do usuário ativo
        const memberships = await communityMembersModel.findByUser(userId);

        // 5. Se não tiver nenhum, retorna array vazio
        if (!memberships.length) return res.json({ communities: [] });

        // 6. Para cada membership, pega os dados da comunidade
        const communities = await Promise.all(
            memberships.map(async (membership) => {
                const community = await communitiesModel.findById(membership.communityId);
                if (!community) return null;

                return {
                    _id: community._id,
                    name: community.name,
                    description: community.description,
                    role: membership.role,
                    joinedAt: membership.joinedAt,
                };
            })
        );

        // 7. Remove nulls (caso alguma comunidade tenha sido deletada)
        const filtered = communities.filter(c => c !== null);

        return res.json({ communities: filtered });

    } catch (err: any) {
        if (err.status === 401) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        console.error(err);
        return res.status(500).json({ error: 'Internal error!' });
    }
});

router.post('/communities', async (req: Request, res: Response) => {
    try {
        await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

        return res.status(201).json({ message: 'Community created successfully' });
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
