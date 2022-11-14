import { Request, Response } from "express";
import { container } from "tsyringe";

import { AuthenticateWithDiscordUseCase } from "./AuthenticateWithDiscordUseCase";

class AuthenticateWithDiscordController {
    async handle(req: Request, res: Response): Promise<Response> {
        const { auth_code } = req.body;

        const authenticateWithDiscordUseCase = container.resolve(
            AuthenticateWithDiscordUseCase
        );

        const result = await authenticateWithDiscordUseCase.execute(auth_code);

        return res.json(result);
    }
}

export { AuthenticateWithDiscordController };
