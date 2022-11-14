import { Request, Response } from "express";
import { container } from "tsyringe";

import { AuthenticateWithCredentialsUseCase } from "./AuthenticateWithCredentialsUseCase";

class AuthenticateWithCredentialsController {
    async handle(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body;

        const authenticateWithCredentialsUseCase = container.resolve(
            AuthenticateWithCredentialsUseCase
        );

        const result = await authenticateWithCredentialsUseCase.execute({
            email,
            password,
        });

        return res.json(result);
    }
}

export { AuthenticateWithCredentialsController };
