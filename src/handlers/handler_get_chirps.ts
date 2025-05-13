import { Request, Response } from "express";
import { respondWithJSON } from "../api/json.js";
import { BadRequestError } from "../error_middleware.js";
import { getChirps } from "../lib/db/queries/chirps.js";


export async function handlerGetChirps(req: Request, res: Response){
    const chirps = await getChirps();

    respondWithJSON(res, 200, chirps);
}