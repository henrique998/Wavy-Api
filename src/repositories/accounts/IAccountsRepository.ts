import { AccountDataDTO } from "../../dtos/account/AccountDataDTO";
import { ICreateAccountDTO } from "../../dtos/account/ICreateAccountDTO";

interface IAccountsRepository {
    create(data: ICreateAccountDTO): Promise<AccountDataDTO>;
    findByEmail(email: string): Promise<AccountDataDTO | null>;
    findById(userId: string): Promise<AccountDataDTO | null>;
}

export { IAccountsRepository };
