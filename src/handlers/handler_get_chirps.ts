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

    let descSorting = false;
    let sortingQuery = req.query.sort;

    if (Array.isArray(sortingQuery)){
        throw new BadRequestError("Provide only one authorId");
    }

    if (typeof sortingQuery === "string") {
        if (sortingQuery !== "asc" && sortingQuery !== "desc"){
            throw new BadRequestError(`Invalid sorting method: ${sortingQuery}`);
        }
        if (sortingQuery === "desc"){
            descSorting = true;
        }
    }


    let chirps = await getChirps(authorId || undefined);

    chirps = chirps.sort((a, b) => {
    if (descSorting) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
});

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