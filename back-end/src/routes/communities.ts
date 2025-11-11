// Aux;
import { Request, Response, Router } from 'express';
const router = Router();
import MongoSingleton from '../singleton';

// Functions;
import {validatedToken} from "@/helpers/functions";

// Models;
import {Community} from "@/models/Community";
import {CommunityMember} from "@/models/CommunityMembers";
import path from "path";
import fs from "fs";


// Listar todas as comunidades;
router.get('/communities', async (req: Request, res: Response) => {
    try {
        const user = await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

        const communitiesModel = new Community(db);
        const communityMembersModel = new CommunityMember(db);

        const includeAll = req.query.users === 'all';

        const memberships = await communityMembersModel.findByUser(user._id as string);
        const userCommunityIds = new Set(memberships.map((m: any) => m.communityId.toString()));

        let communities;

        if (includeAll) {
            const allCommunities = await communitiesModel.findAll();

            communities = allCommunities.map((community: any) => ({
                _id: community._id,
                name: community.name,
                description: community.description,
                type: community.type,
                img_url: community.img_url,
                created_at: community.createdAt,
                isMember: userCommunityIds.has(community._id.toString()),
            }));
        } else {
            const userCommunities = await Promise.all(
                memberships.map(async (membership: any) => {
                    const community = await communitiesModel.findById(membership.communityId);
                    if (!community) return null;

                    return {
                        _id: community._id,
                        name: community.name,
                        description: community.description,
                        type: community.type,
                        img_url: community.img_url,
                        created_at: community.createdAt,
                        isMember: true,
                        role: membership.role,
                        joinedAt: membership.joinedAt,
                    };
                })
            );

            communities = userCommunities.filter(c => c !== null);
        }

        return res.status(200).json({
            success: true,
            communities,
        });
    } catch (err: any) {
        if (err.status === 401) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        console.error(err);
        return res.status(500).json({ error: 'Internal error!' });
    }
});


// Criar uma comunidade;
router.post('/communities', async (req: Request, res: Response) => {
    try {
        const { name, description, type, img_url } = req.body;
        const user = await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

        let avatarPath = '';
        if (img_url && img_url.startsWith('data:image')) {
            const base64Data = img_url.split(',')[1];

            const fileExtension = img_url.substring("data:image/".length, img_url.indexOf(";base64"));
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 10)}.${fileExtension}`;
            const filePath = path.join('uploads', fileName);

            fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
            avatarPath = `/uploads/${fileName}`;
        }

        await new Community(db).create({
            name,
            description,
            type,
            created_by: user._id as string,
            img_url: avatarPath,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return res.status(201).json({
            success: true,
            message: 'Community created successfully',
        });
    } catch (err) {
        return res.status(500).json({ error: 'Internal error!' });
    }
});

// Entrar em uma comunidade;
router.get('/communities/:id/join', async (req: Request, res: Response) => {
    try {
        const user = await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

        const communitiesModel = new Community(db);
        const communityMembersModel = new CommunityMember(db);

        const communityId = req.params.id;

        const community = await communitiesModel.findById(communityId);
        if (!community) {
            return res.status(404).json({ error: 'Community not found' });
        }

        await communityMembersModel.create({
            communityId, // @ts-ignore
            userId: user._id,
            role: 'member',
            joinedAt: new Date(),
        });

        return res.status(200).json({
            success: true,
            message: 'Successfully joined the community',
        });

    } catch (err: any) {
        console.error(err);
        if (err.status === 401) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        return res.status(500).json({ error: 'Internal error!' });
    }
});


// Sair de uma comunidade;
router.get('/communities/:id/leave', async (req: Request, res: Response) => {
    try {
        const user = await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

        const communityMembersModel = new CommunityMember(db);

        const communityId = req.params.id;

        const memberships = await communityMembersModel.findByUser(user._id as string);
        const membership = memberships.find((m: any) => m.communityId.toString() === communityId);

        if (!membership) {
            return res.status(404).json({ error: 'Membership not found' });
        }

        // @ts-ignore
        await communityMembersModel.removeMember(membership._id);

        return res.status(200).json({
            success: true,
            message: 'Saiu com sucesso da comunidade!',
        });

    } catch (err: any) {
        console.error(err);
        if (err.status === 401) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        return res.status(500).json({ error: 'Internal error!' });
    }
});

export default router;
