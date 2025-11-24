import { Request, Response, Router } from 'express';
import MongoSingleton from '../singleton';
import {validatedToken} from "@/helpers/functions";

const router = Router();

import { Notification } from '@/models/Notification';
import { CommunityMember } from '@/models/CommunityMembers';

router.get('/notifications', async (req: Request, res: Response) => {
    try {
        const user = await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

        const notificationsModel = new Notification(db);

        const list = await notificationsModel.findByUser(user._id as string);

        return res.json({ success: true, notifications: list });

    } catch (err) {
        return res.status(500).json({ error: 'Internal error!' });
    }
});

router.post('/notifications/:id/accept', async (req, res) => {
    try {
        const user = await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

        const notificationsModel = new Notification(db);
        const membersModel = new CommunityMember(db);

        const notifId = req.params.id;
        const notif = await notificationsModel.findById(notifId);

        if (!notif) return res.status(404).json({ error: "Notificação não encontrada" });

        if (notif.userId.toString() !== user._id!.toString()) {
            return res.status(403).json({ error: "Não autorizado" });
        }

        await membersModel.updateMembership(notif.requesterId!.toString(), notif.communityId!.toString(), {
            role: "member"
        });

        await notificationsModel.markAsRead(notifId);

        return res.json({ success: true, message: "Membro aceito" });

    } catch (err) {
        return res.status(500).json({ error: 'Internal error!' });
    }
});


router.post('/notifications/:id/reject', async (req, res) => {
    try {
        const user = await validatedToken(req.headers.authorization);
        const db = await MongoSingleton.getInstance();

        const notificationsModel = new Notification(db);
        const membersModel = new CommunityMember(db);

        const notifId = req.params.id;
        const notif = await notificationsModel.findById(notifId);

        if (!notif) return res.status(404).json({ error: "Notificação não encontrada" });

        if (notif.userId.toString() !== user._id!.toString()) {
            return res.status(403).json({ error: "Não autorizado" });
        }

        // Remove membro pendente
        await membersModel.delete(notif.requesterId!.toString(), notif.communityId!.toString());

        await notificationsModel.markAsRead(notifId);

        return res.json({ success: true, message: "Pedido rejeitado" });

    } catch (err) {
        return res.status(500).json({ error: 'Internal error!' });
    }
});

export default router;
