import { Router } from "express";

import { AuthenticateWithCredentialsController } from "../modules/authentications/AuthenticateWithCredentials/AuthenticateWithCredentialsController";

const sessionRoute = Router();

const authenticateWithCredentials = new AuthenticateWithCredentialsController();

sessionRoute.post("/credentials", authenticateWithCredentials.handle);

export { sessionRoute as sessionRoutes };
