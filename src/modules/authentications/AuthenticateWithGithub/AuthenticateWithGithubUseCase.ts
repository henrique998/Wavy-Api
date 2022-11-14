import axios from "axios";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../errors/AppError";
import { IAccountsRepository } from "../../../repositories/accounts/IAccountsRepository";

const client_id = process.env.GITHUB_CLIENT_ID;
const client_secret = process.env.GITHUB_CLIENT_SECRETS;

interface ITokenResponse {
    access_token: string;
}

interface User {
    name: string;
    email: string;
    avatar_url: string;
}

interface IResponse {
    token: string;
    userData: User;
}

@injectable()
class AuthenticateWithGithubUseCase {
    constructor(
        @inject("PrismaAccountsRepository")
        private accountsRepository: IAccountsRepository
    ) {}

    async execute(github_code: string): Promise<IResponse> {
        const url = "https://github.com/login/oauth/access_token";

        const {
            data: { access_token },
        } = await axios.post<ITokenResponse>(url, null, {
            params: {
                client_id,
                client_secret,
                code: github_code,
            },
            headers: {
                Accept: "application/json",
            },
        });

        const {
            data: { name, email, avatar_url },
        } = await axios.get<User>("https://api.github.com/user", {
            headers: {
                authorization: `Bearer ${access_token}`,
            },
        });

        if (!name) {
            throw new AppError("Name is required!");
        }

        if (!email) {
            throw new AppError(
                "E-mail is required! Make your email public in your github account."
            );
        }

        let user = await this.accountsRepository.findByEmail(email);

        if (!user) {
            user = await this.accountsRepository.create({
                name,
                email,
                avatar_url,
            });
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
                avatar_url: user.avatar_url,
            },
        };

        return authResult;
    }
}

export { AuthenticateWithGithubUseCase };
