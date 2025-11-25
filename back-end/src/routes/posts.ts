import { Request, Response, Router } from 'express';
const router = Router();

// Aux;
import MongoSingleton from '../singleton';
import {validatedToken} from "@/helpers/functions";
import path from "path";
import fs from "fs";
import { upload } from "../middlewares/upload";

// Models;
import { Community } from '@/models/Community';
import { CommunityMember } from '@/models/CommunityMembers';
import { Post } from '@/models/Post';
import { User } from '@/models/User';


router.get('/posts', async (req: Request, res: Response) => {
    try {
        const user = await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

        const communityMembersModel = new CommunityMember(db);
        const postsModel = new Post(db);
        const communitiesModel = new Community(db);
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
                    communityImg: allCommunities.find((c: any) => c._id.toString() === post.communityId.toString())?.img_url || null,

                    userId: post.userId,
                    username: author.username || 'Usuário desconhecido',
                    userAvatar: author.avatar_url || null,

                    comments: []
                };
            })
        );

        return res.status(200).json({
            success: true,
            posts: formattedPosts,
        });
    } catch (err: any) {
        if (err.status === 401) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        return res.status(500).json({ error: 'Internal error!' });
    }
});

router.post("/communities/:id/posts", upload.single("image"), async (req: Request, res: Response) => {
        try {
            const user = await validatedToken(req.headers.authorization);
            const db = await MongoSingleton.getInstance();

            const { title, description } = req.body;
            const communityId = req.params.id;

            let imgPath = null;

            if (req.file) {
                imgPath = `/uploads/${req.file.filename}`;
            }

            const communitiesModel = new Community(db);
            const membersModel = new CommunityMember(db);
            const postsModel = new Post(db);

            const community = await communitiesModel.findById(communityId);
            if (!community) {
                return res.status(404).json({ error: "Comunidade não encontrada." });
            }

            const isMember = await membersModel.findMembership(
                user._id!.toString(),
                communityId
            );

            if (!isMember) {
                return res.status(403).json({ error: "Você precisa ser membro para postar." });
            }


            await postsModel.create({
                communityId,
                userId: user._id!,
                title,
                description,
                img_url: imgPath,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            return res.status(201).json({
                success: true,
                message: "Post criado com sucesso!",
            });
        } catch (err: any) {
            if (err.status === 401) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            return res.status(500).json({ error: 'Internal error!' });
        }
    }
);



router.get('/communities/:id/posts', async (req: Request, res: Response) => {
    try {
        const user = await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

        const communityId = req.params.id;

        const communitiesModel = new Community(db);
        const postsModel = new Post(db);
        const usersModel = new User(db);
        const communityMembersModel = new CommunityMember(db);

        const member = await communityMembersModel.findMembership(
            user._id!.toString(),
            communityId
        );
        const community = await communitiesModel.findById(communityId);

        if (!community || !member) {
            return res.status(404).json({ error: "Comunidade não encontrada." });
        }

        // Buscar posts da comunidade;
        const posts = await postsModel.findByCommunityId(communityId);

        if (!posts.length) {
            return res.json({
                success: true,
                posts: [],
                message: "Nenhum post encontrado nesta comunidade."
            });
        }

        // Buscar todos usuários responsáveis pelos posts;
        const userIds = [...new Set(posts.map((p: any) => p.userId.toString()))];
        const users = await usersModel.findByIds(userIds);

        // Criar mapa rápido de usuários;
        const userMap = new Map(users.map((u: any) => [u._id.toString(), u]));

        // Compor dados;
        const formattedPosts = posts.map((post: any) => {
            const author = userMap.get(post.userId.toString());

            return {
                _id: post._id,
                title: post.title,
                description: post.description,
                img_url: post.img_url,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,

                // comunidade
                communityId: communityId,
                communityName: community.name,
                communityImg: community.img_url,

                // autor
                userId: post.userId,
                username: author?.username || "Usuário desconhecido",
                userAvatar: author?.avatar_url || null,

                comments: []
            };
        });

        return res.status(200).json({
            success: true,
            posts: formattedPosts,
        });

    } catch (err: any) {
        if (err.status === 401) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        return res.status(500).json({ error: 'Internal error!' });
    }
});



router.delete('/posts/:id', async (req: Request, res: Response) => {
    try {
        const user = await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

        const postId = req.params.id;

        const postsModel = new Post(db);

        const post = await postsModel.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post não encontrado." });
        }

        if (post.userId.toString() !== user._id!.toString()) {
            return res.status(403).json({ error: "Você não é o autor deste post." });
        }

        if (post.img_url) {
            const fs = require("fs");
            const path = require("path");

            const filePath = path.join(__dirname, "../../public" + post.img_url);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await postsModel.delete(postId);

        return res.json({
            success: true,
            message: "Post deletado com sucesso."
        });

    } catch (err: any) {
        if (err.status === 401) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        return res.status(500).json({ error: 'Internal error!' });
    }
});



export default router;
