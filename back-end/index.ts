import express from 'express';
import { setupSwagger } from './src/swagger';
import Singleton from './src/singleton';
import cors from 'cors'

import userRouter from './src/routes/user';
import authRouter from './src/routes/auth';
import communityRouter from './src/routes/communities';
import notificationRouter from './src/routes/notifications';
import postRouter from './src/routes/posts';
import commentRouter from './src/routes/comments';
import tagRouter from './src/routes/tags';
import path from "path";

async function main() {
    console.log('Starting API...');
    await Singleton.getInstance();

    const app = express();

    if (!process.env.PORT) throw new Error('PORT not defined in .env');
    if (!process.env.ADDRESS) throw new Error('ADDRESS not defined in .env');

    app
        .use(cors({
            origin: 'http://localhost:5000',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }))
        .use('/uploads', express.static(path.join(__dirname, 'uploads')))
        .use(express.json())
        .use(userRouter)
        .use(authRouter)
        .use(notificationRouter)
        .use(postRouter)
        .use(commentRouter)
        .use(tagRouter)
        .use(communityRouter);

    setupSwagger(app);

    app.listen(Number(process.env.PORT), process.env.ADDRESS, () => {
        console.log(`API running on http://${process.env.ADDRESS}:${Number(process.env.PORT)}`);
        console.log(`Swagger docs available at http://${process.env.ADDRESS}:${Number(process.env.PORT)}/api-docs`);
    });
}

main();
