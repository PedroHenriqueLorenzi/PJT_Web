import jwt from 'jsonwebtoken';
import MongoSingleton from "@/singleton";

import {User} from "src/models/User"

const SESSION_TIMEOUT = 15 * 60 * 1000;

export async function validatedToken(token: string | undefined) {
    if (!token) {
        throw new Error('Token not supplied.');
    }

    const db = await MongoSingleton.getInstance();

    try {
        const tokenJWT = token.split(' ')[1];

        const decoded = jwt.decode(tokenJWT) as { id: string, email: string } | null;

        if (!decoded) {
            throw new Error('Invalid token.');
        }

        const userModel = new User(db);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            throw new Error('User not found.');
        }

        const now = new Date();
        if (user.token_expires_at && new Date(user.token_expires_at) < now) {
            const error = new Error('Expired token.');
            error.name = 'TokenExpiredError';
            throw error;
        }

        const newExpirationTime = new Date(now.getTime() + SESSION_TIMEOUT);
        await userModel.update(user._id!.toString(), { token_expires_at: newExpirationTime });

        return user;

    } catch (err) {
        // @ts-ignore
        if (err.name === 'TokenExpiredError') {
            throw { status: 401, message: 'Expired token', name: 'TokenExpiredError' };
        }
        throw { status: 401, message: 'Expired token.' };
    }
}
