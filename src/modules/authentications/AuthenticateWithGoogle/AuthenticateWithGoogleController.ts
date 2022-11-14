import { Request, Response } from "express";
import { container } from "tsyringe";

import { AuthenticateWithGoogleUseCase } from "./AuthenticateWithGoogleUseCase";

class AuthenticateWithGoogleController {
    async handle(req: Request, res: Response): Promise<Response> {
        const { auth_code } = req.body;

        const authenticateWithGoogleUseCase = container.resolve(
            AuthenticateWithGoogleUseCase
        );

        const result = await authenticateWithGoogleUseCase.execute(auth_code);

        return res.json(result);
    }
}

export { AuthenticateWithGoogleController };
