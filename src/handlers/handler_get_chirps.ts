import { Request, Response } from "express";
import { respondWithJSON } from "../api/json.js";
import { BadRequestError, NotFoundError } from "../error_middleware.js";
import { getChirps, getChirpsByAuthor, getSingleChirp } from "../lib/db/queries/chirps.js";
import { validate } from "uuid";


export async function handlerGetChirps(req: Request, res: Response){
    let authorId = "";
    let authorIdQuery = req.query.authorId;

    if (Array.isArray(authorIdQuery)){
        throw new BadRequestError("Provide only one authorId");
    }

    if (typeof authorIdQuery === "string") {
        if (!validate(authorIdQuery)){
            throw new BadRequestError(`Invalid UUID on authorId`);
        }
        authorId = authorIdQuery;
    }

    const chirps = await getChirps(authorId || undefined);

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