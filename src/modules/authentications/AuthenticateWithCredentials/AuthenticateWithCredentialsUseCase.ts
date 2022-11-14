import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../errors/AppError";
import { IAccountsRepository } from "../../../repositories/accounts/IAccountsRepository";

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    token: string;
    userData: {
        name: string;
        email: string;
    };
}

@injectable()
class AuthenticateWithCredentialsUseCase {
    constructor(
        @inject("PrismaAccountsRepository")
        private accountsRepository: IAccountsRepository
    ) {}

    async execute({ email, password }: IRequest): Promise<IResponse> {
        const user = await this.accountsRepository.findByEmail(email);

        if (!user) {
            throw new AppError("Email or password incorrect!");
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            throw new AppError("Email or password incorrect!");
        }

        const token = sign({}, process.env.SECRET_KEY, {
            expiresIn: "1d",
            subject: user.id,
        });

        const authResult: IResponse = {
            token,
            userData: {
                name: user.name,
                email: user.email,
            },
        };

        return authResult;
    }
}

export { AuthenticateWithCredentialsUseCase };
