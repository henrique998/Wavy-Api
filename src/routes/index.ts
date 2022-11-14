import { Router } from "express";

import { accountRoutes } from "./accounts.routes";
import { sessionRoutes } from "./session.routes";

const router = Router();

router.use("/", accountRoutes);
router.use("/session", sessionRoutes);

export { router as routes };
