import { Request, Response } from "express";
import { container } from "tsyringe";

import { ProfileUseCase } from "./ProfileUseCase";

class ProfileController {
    async handle(req: Request, res: Response): Promise<Response> {
        const { id } = req.user;

        const profileUseCase = container.resolve(ProfileUseCase);

        const result = await profileUseCase.execute(id);

        return res.json(result);
    }
}

export { ProfileController };
