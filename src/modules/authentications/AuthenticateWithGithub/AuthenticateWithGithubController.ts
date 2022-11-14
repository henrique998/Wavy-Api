import { Request, Response } from "express";
import { container } from "tsyringe";

import { AuthenticateWithGithubUseCase } from "./AuthenticateWithGithubUseCase";

class AuthenticateWithGithubController {
    async handle(req: Request, res: Response): Promise<Response> {
        const { auth_code } = req.body;

        const authenticateWithGithubUseCase = container.resolve(
            AuthenticateWithGithubUseCase
        );

        const result = await authenticateWithGithubUseCase.execute(auth_code);

        return res.json(result);
    }
}

export { AuthenticateWithGithubController };
