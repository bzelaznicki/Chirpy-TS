import { Request, Response } from "express";
import { getBearerToken, validateJWT } from "../auth.js";
import { ForbiddenError, NotFoundError } from "../error_middleware.js";
import { deleteChrip, getSingleChirp } from "../lib/db/queries/chirps.js";
import { config } from "../config.js";


export async function handlerDeleteChirp(req: Request, res: Response){
    const jwtToken = getBearerToken(req);
    const userId = validateJWT(jwtToken, config.jwt.secret);
    
    const chirpId = req.params.chirpId;

    const chirp = await getSingleChirp(chirpId);

    if (!chirp) {
        throw new NotFoundError (`Chirp ID ${chirpId} not found`);
    }

    if (chirp.userId !== userId){
        throw new ForbiddenError (`You do not have permission to delete this chirp`)
    }

    await deleteChrip(chirp.id);

    res.status(204).end();
}