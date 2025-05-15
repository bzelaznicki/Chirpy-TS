import { Request, Response } from "express";
import { respondWithJSON } from "../api/json.js";
import { BadRequestError, UnauthorizedError } from "../error_middleware.js";
import { createChirp } from "../lib/db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";

export async function handlerPostChirp(req: Request, res: Response){
    type parameters = {
        body: string;
      };

        try {
            const params: parameters = req.body;
            
            if (typeof params.body !== "string") {
                throw new BadRequestError ("Invalid body");
                
            }
            
            const cleaned = validateChirp(params.body);
            const jwtToken = getBearerToken(req);
            console.log(`Bearer token: ${jwtToken}`);
            const validToken = validateJWT(jwtToken, config.jwt.secret);

            if (!validToken) {
              throw new UnauthorizedError(`Invalid bearer token`);
            }


              const postedChirp = await createChirp({body: cleaned, userId: validToken});

              respondWithJSON(res, 201, postedChirp);

          } catch (error){
            if (error instanceof UnauthorizedError){
              throw new UnauthorizedError(`Authentication failed: ${error.message}`)
            }
          }

}

function validateChirp(body: string) {
  const maxChirpLength = 140;
      
            

            if (body.length > maxChirpLength) {
                throw new BadRequestError (`Chirp is too long. Max length is ${maxChirpLength}`);
            }

            return cleanChirp(body);
}

function cleanChirp(body: string) {
              let stringArr = body.split(" ");
              const cleaned: string[] = [];

              for (let word of stringArr) {
                if (word.toLowerCase() === "kerfuffle" || 
                    word.toLowerCase() === "sharbert" || 
                    word.toLowerCase() === "fornax") {
                        word = "****";
                }
                cleaned.push(word);

              }
              return cleaned.join(" ");
}