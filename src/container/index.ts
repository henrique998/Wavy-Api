import { container } from "tsyringe";

import { IAccountsRepository } from "../repositories/accounts/IAccountsRepository";
import { PrismaAccountsRepository } from "../repositories/accounts/implementations/PrismaAccountsRepository";

container.registerSingleton<IAccountsRepository>(
    "PrismaAccountsRepository",
    PrismaAccountsRepository
);
