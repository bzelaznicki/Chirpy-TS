import { Request, Response } from "express";
import { respondWithJSON } from "../api/json.js";
import { BadRequestError, NotFoundError } from "../error_middleware.js";
import { getChirps, getSingleChirp } from "../lib/db/queries/chirps.js";


export async function handlerGetChirps(req: Request, res: Response){
    const chirps = await getChirps();

    respondWithJSON(res, 200, chirps);
}

export async function handlerGetSingleChirp(req: Request, res: Response){
    const chirpId = req.params.chirpId;

    const chirp = await getSingleChirp(chirpId);

    if (!chirp){
        throw new NotFoundError(`Chirp ID ${chirpId} not found`)
    }

    respondWithJSON(res, 200, chirp);
}