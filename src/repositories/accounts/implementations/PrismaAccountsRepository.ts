import { prisma } from "../../../config/prisma";
import { AccountDataDTO } from "../../../dtos/account/AccountDataDTO";
import { ICreateAccountDTO } from "../../../dtos/account/ICreateAccountDTO";
import { IAccountsRepository } from "../IAccountsRepository";

class PrismaAccountsRepository implements IAccountsRepository {
    async create({
        name,
        email,
        password,
        avatar_url,
    }: ICreateAccountDTO): Promise<AccountDataDTO> {
        const user = await prisma.account.create({
            data: {
                name,
                email,
                password,
                avatar_url,
            },
        });

        return user;
    }

    async findByEmail(email: string): Promise<AccountDataDTO | null> {
        const account = await prisma.account.findFirst({
            where: {
                email,
            },
        });

        return account;
    }

    async findById(userId: string): Promise<AccountDataDTO> {
        const account = await prisma.account.findFirst({
            where: {
                id: userId,
            },
        });

        return account;
    }
}

export { PrismaAccountsRepository };
