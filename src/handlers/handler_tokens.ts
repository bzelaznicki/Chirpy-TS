import { Request, Response } from "express";
import { getBearerToken, makeJWT } from "../auth.js";
import { NotFoundError, UnauthorizedError } from "../error_middleware.js";
import { getUserFromRefreshToken, revokeToken } from "../lib/db/queries/refresh_tokens.js";
import { config } from "../config.js";
import { respondWithJSON } from "../api/json.js";

export async function handlerRevokeToken(req: Request, res: Response){
    try {
        const bearerToken = getBearerToken(req);

        const revokedToken = await revokeToken(bearerToken);

        if (!revokedToken) {
            throw new NotFoundError("Token not found");
        }

        res.status(204).end();
    } catch (error){
        if (error instanceof Error){
            if (error instanceof UnauthorizedError){
            throw new Error (`Authorization failed`);
            } else {
                throw error;
            }
        }
    }
}

export async function handlerRefresh(req: Request, res: Response){
    const bearerToken = getBearerToken(req);

    const refTokenUser = await getUserFromRefreshToken(bearerToken);

    if (!refTokenUser){
        throw new UnauthorizedError(`Invalid refresh token`);
    }
    const now = new Date();
    if (refTokenUser.revoked_at || refTokenUser.expiresAt < now){
        throw new UnauthorizedError(`Refresh token expired or invalidated`);
    }
    const jwtToken = await makeJWT(refTokenUser.userId, config.jwt.defaultDuration, config.jwt.secret);

    respondWithJSON(res, 200, {token: jwtToken});
}