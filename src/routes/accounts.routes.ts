import { Router } from "express";
import { URLSearchParams } from "url";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { CreateAccountController } from "../modules/account/CreateAccount/CreateAccountController";
import { ProfileController } from "../modules/account/Profile/ProfileController";
import { AuthenticateWithDiscordController } from "../modules/authentications/AuthenticateWithDiscord/AuthenticateWithDiscordController";
import { AuthenticateWithGithubController } from "../modules/authentications/AuthenticateWithGithub/AuthenticateWithGithubController";
import { AuthenticateWithGoogleController } from "../modules/authentications/AuthenticateWithGoogle/AuthenticateWithGoogleController";

const accountRoute = Router();

const github_client_id = process.env.GITHUB_CLIENT_ID;
const discord_redirect_uri = process.env.DISCORD_REDIRECT_URL;

const createAccountController = new CreateAccountController();

const profileController = new ProfileController();

const authenticateWithGithubController = new AuthenticateWithGithubController();
const authenticateWithGoogleController = new AuthenticateWithGoogleController();
const authenticateWithDiscordController =
    new AuthenticateWithDiscordController();

// Credentials

accountRoute.post("/accounts", createAccountController.handle);

accountRoute.get("/accounts/me", ensureAuthenticated, profileController.handle);

// Github

accountRoute.get("/github/redirect", (req, res) => {
    return res.redirect(
        `https://github.com/login/oauth/authorize?client_id=${github_client_id}`
    );
});

accountRoute.get("/github/auth/callback", (req, res) => {
    return res.json({ code: req.query.code });
});

accountRoute.post("/accounts/github", authenticateWithGithubController.handle);

// Google

accountRoute.get("/google/redirect", (req, res) => {
    const options = {
        redirect_uri: process.env.GOOGLE_REDIRECT_URL as string,
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
    };

    const qs = new URLSearchParams(options);

    return res.redirect(
        `https://accounts.google.com/o/oauth2/v2/auth?${qs.toString()}`
    );
});

accountRoute.get("/google/auth/callback", (req, res) => {
    return res.json({ code: req.query.code });
});

accountRoute.post("/accounts/google", authenticateWithGoogleController.handle);

// Discord

accountRoute.get("/discord/redirect/authorize", (req, res) => {
    return res.redirect(discord_redirect_uri);
});

accountRoute.get("/discord/auth/callback", (req, res) => {
    return res.json({ code: req.query.code });
});

accountRoute.post(
    "/accounts/discord",
    authenticateWithDiscordController.handle
);

export { accountRoute as accountRoutes };
