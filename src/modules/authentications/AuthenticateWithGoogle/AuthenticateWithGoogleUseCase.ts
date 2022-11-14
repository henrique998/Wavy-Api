import axios from "axios";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../errors/AppError";
import { IAccountsRepository } from "../../../repositories/accounts/IAccountsRepository";

const client_id = process.env.GOOGLE_CLIENT_ID;
const client_secret = process.env.GOOGLE_CLIENT_SECRET;
const redirect_uri = process.env.GOOGLE_REDIRECT_URL;

interface ITokenResponse {
    access_token: string;
    id_token: string;
}

interface User {
    name: string;
    email: string;
    picture?: string;
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
class AuthenticateWithGoogleUseCase {
    constructor(
        @inject("PrismaAccountsRepository")
        private accountsRepository: IAccountsRepository
    ) {}

    async execute(google_code: string): Promise<IResponse> {
        const url = "https://oauth2.googleapis.com/token";

        const {
            data: { access_token, id_token },
        } = await axios.post<ITokenResponse>(url, null, {
            params: {
                client_id,
                client_secret,
                redirect_uri,
                code: google_code,
                grant_type: "authorization_code",
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        const userInfoUrl = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;

        const {
            data: { name, email, picture },
        } = await axios.get<User>(userInfoUrl, {
            headers: {
                Authorization: `Bearer ${id_token}`,
            },
        });

        if (!name) {
            throw new AppError("Name is required!");
        }

        if (!email) {
            throw new AppError("E-mail is required!");
        }

        let user = await this.accountsRepository.findByEmail(email);

        if (!user) {
            user = await this.accountsRepository.create({
                name,
                email,
                avatar_url: picture,
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

export { AuthenticateWithGoogleUseCase };
