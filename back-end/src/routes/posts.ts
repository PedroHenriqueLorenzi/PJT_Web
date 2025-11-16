import { Request, Response, Router } from 'express';
const router = Router();

// Aux;
import MongoSingleton from '../singleton';
import {validatedToken} from "@/helpers/functions";
import path from "path";
import fs from "fs";

// Models;
import { Community } from '@/models/Community';
import { CommunityMember } from '@/models/CommunityMembers';
import { Post } from '@/models/Post';
import { Comment } from '@/models/Comment';
import { User } from '@/models/User';


router.get('/posts', async (req: Request, res: Response) => {
    try {
        const user = await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

        const communityMembersModel = new CommunityMember(db);
        const postsModel = new Post(db);
        const communitiesModel = new Community(db);
        const commentsModel = new Comment(db);
        const usersModel = new User(db);

        // Buscar comunidades onde o usuário é membro;
        const memberships = await communityMembersModel.findByUser(user._id as string);
        if (!memberships.length) {
            return res.status(200).json({
                success: true,
                posts: [],
                message: 'Você ainda não faz parte de nenhuma comunidade.',
            });
        }

        // Extrair os IDs das comunidades;
        const communityIds = memberships.map((m: any) => m.communityId.toString());

        // Buscar posts das comunidades
        const posts = await postsModel.findByCommunities(communityIds);

        // Buscar todos os usuários autores dos posts
        const userIds = [...new Set(posts.map((p: any) => p.userId.toString()))];
        const users = await usersModel.findByIds(userIds);
        const userMap = new Map(users.map((u: any) => [u._id.toString(), u]));

        // Mapa de comunidades
        const allCommunities = await communitiesModel.findAll();
        const communityMap = new Map(allCommunities.map((c: any) => [c._id.toString(), c.name]));

        // Adicionar comentários, comunidade e dados do autor
        const formattedPosts = await Promise.all(
            posts.map(async (post: any) => {
                const comments = await commentsModel.findByPost(post._id.toString());
                const author = userMap.get(post.userId.toString());

                return {
                    _id: post._id,
                    title: post.title,
                    description: post.description,
                    img_url: post.img_url,
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt,
                    communityId: post.communityId,
                    communityName: communityMap.get(post.communityId.toString()) || 'Desconhecida',

                    userId: post.userId,
                    username: author.username || 'Usuário desconhecido',
                    userAvatar: author.avatar_url || null,

                    comments,
                };
            })
        );

        return res.status(200).json({
            success: true,
            posts: formattedPosts,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal error!' });
    }
});


router.get('/posts/:id', async (req: Request, res: Response) => {
    try {
        await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

    } catch (err) {
        return res.status(500).json({ error: 'Internal error!' });
    }
});

router.patch('/posts/:id', async (req: Request, res: Response) => {
    try {
        await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

    } catch (err) {
        return res.status(500).json({ error: 'Internal error!' });
    }
});

router.delete('/posts/:id', async (req: Request, res: Response) => {
    try {
        await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

    } catch (err) {
        return res.status(500).json({ error: 'Internal error!' });
    }
});

router.post('/communities/:id/posts', async (req: Request, res: Response) => {
    try {
        const user = await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

        const { title, description, image } = req.body;
        const communityId = req.params.id;

        let avatarPath = '';
        if (typeof image === 'string' && image.startsWith('data:image')) {
            const base64Data = image.split(',')[1];

            const fileExtension = image.substring("data:image/".length, image.indexOf(";base64"));
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 10)}.${fileExtension}`;
            const filePath = path.join('uploads', fileName);

            fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
            avatarPath = `/uploads/${fileName}`;
        }

        const communitiesModel = new Community(db);
        const membersModel = new CommunityMember(db);
        const postsModel = new Post(db);

        const community = await communitiesModel.findById(communityId);
        if (!community) {
            return res.status(404).json({ error: 'Comunidade não encontrada.' });
        }

        const isMember = await membersModel.findMembership(user._id as string, communityId);
        if (!isMember) {
            return res.status(403).json({ error: 'Você precisa ser membro para postar nesta comunidade.' });
        }

        const newPost = await postsModel.create({
            communityId: communityId, // @ts-ignore
            userId: user._id,
            title,
            description,
            img_url: avatarPath ?? null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return res.status(201).json({
            success: true,
            message: 'Post criado com sucesso!',
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal error!' });
    }
});

router.get('/communities/:id/posts', async (req: Request, res: Response) => {
    try {
        await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

    } catch (err) {
        return res.status(500).json({ error: 'Internal error!' });
    }
});

export default router;
