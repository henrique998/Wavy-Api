import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { AppError } from "../errors/AppError";

interface IPayload {
    sub: string;
}

const SECRET_KEY = process.env.SECRET_KEY;

async function ensureAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new AppError({ error: true, code: "token.missing" }, 401);
    }

    const [, token] = authHeader?.split(" ");

    try {
        const { sub } = verify(token, SECRET_KEY) as IPayload;

        console.log(sub);

        req.user = {
            id: sub,
        };

        next();
    } catch {
        throw new AppError({ error: true, code: "token.expired" }, 401);
    }
}

export { ensureAuthenticated };
