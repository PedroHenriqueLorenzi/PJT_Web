import jwt from 'jsonwebtoken';
import MongoSingleton from "@/singleton";

import {User} from "src/models/User"

// Aqui eu defino quanto tempo a sessão do usuário fica ativa após cada requisição autenticada.
// Escolhi 1 hora para ficar alinhado com a expiração do JWT gerado no login.
const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hora

export async function validatedToken(token: string | undefined) {
    // Esta função valida o token JWT enviado no header Authorization ("Bearer <token>").
    // Se estiver tudo certo, eu renovo o "token_expires_at" do usuário no banco para estender a sessão.
    if (!token) {
        // Se não vier token, eu lanço um erro simples indicando ausência de token.
        throw new Error('Token not supplied.');
    }

    const db = await MongoSingleton.getInstance();

    try {
        // Aqui eu extraio só a parte do token (removendo o "Bearer ").
        const tokenJWT = token.split(' ')[1];

        // Agora eu verifico a assinatura e validade do token usando a SECRET_KEY do .env.
        // Se a assinatura não bater ou estiver expirado, o jwt.verify vai lançar erro.
        const decoded = jwt.verify(tokenJWT, process.env.SECRET_KEY!) as { id: string; email: string };

        // Com o token válido, eu busco o usuário no banco pelo id que veio no payload do JWT.
        const userModel = new User(db);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            // Se por algum motivo o usuário não existir mais, eu considero inválido.
            throw new Error('User not found.');
        }

        // Eu também mantenho um controle de expiração de sessão no banco (token_expires_at).
        // Caso já tenha passado, eu trato como expirado.
        const now = new Date();
        if (user.token_expires_at && new Date(user.token_expires_at) < now) {
            const error = new Error('Expired token.');
            error.name = 'TokenExpiredError';
            throw error;
        }

        // Se estiver tudo certo, eu renovo o "token_expires_at" por mais 1h a partir de agora.
        const newExpirationTime = new Date(now.getTime() + SESSION_TIMEOUT);
        await userModel.update(user._id!.toString(), { token_expires_at: newExpirationTime });

        // Retorno o usuário (para as rotas que precisarem dos dados do auth).
        return user;

    } catch (err) {
        // Aqui eu normalizo os erros do JWT para 401 (Unauthorized),
        // tanto para token expirado quanto para token inválido/assinado errado.
        // @ts-ignore
        if (err && (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError')) {
            // @ts-ignore
            const name = err.name;
            throw { status: 401, message: 'Unauthorized', name };
        }
        throw { status: 401, message: 'Unauthorized' };
    }
}

