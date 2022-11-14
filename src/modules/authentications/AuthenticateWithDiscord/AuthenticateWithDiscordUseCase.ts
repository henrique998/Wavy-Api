import axios from "axios";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import url from "url";

import { AppError } from "../../../errors/AppError";
import { IAccountsRepository } from "../../../repositories/accounts/IAccountsRepository";

const client_id = process.env.DISCORD_CLIENT_ID;
const client_secret = process.env.DISCORD_CLIENT_SECRET;

interface ITokenResponse {
    access_token: string;
}

interface User {
    username: string;
    email: string;
    avatar: string | null;
}

interface IResponse {
    token: string;
    userData: {
        name: string;
        email: string;
        avatar_url?: string;
    };
}

@injectable()
class AuthenticateWithDiscordUseCase {
    constructor(
        @inject("PrismaAccountsRepository")
        private accountsRepository: IAccountsRepository
    ) {}

    async execute(discord_code: string): Promise<IResponse> {
        const discordApiTokenUrl = "https://discord.com/api/v10/oauth2/token";

        const formData = new url.URLSearchParams({
            client_id,
            client_secret,
            grant_type: "authorization_code",
            code: discord_code,
            redirect_uri: "http://localhost:5173/",
        });

        const {
            data: { access_token },
        } = await axios.post<ITokenResponse>(discordApiTokenUrl, formData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        const {
            data: { username, email, avatar },
        } = await axios.get<User>("https://discord.com/api/v8/users/@me", {
            headers: {
                authorization: `Bearer ${access_token}`,
            },
        });

        if (!username) {
            throw new AppError("User name is required!");
        }

        if (!email) {
            throw new AppError("E-mail is required!");
        }

        let user = await this.accountsRepository.findByEmail(email);

        if (!user) {
            user = await this.accountsRepository.create({
                name: username,
                email,
                avatar_url: avatar,
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

export { AuthenticateWithDiscordUseCase };
