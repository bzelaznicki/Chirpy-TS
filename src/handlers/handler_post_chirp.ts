import { Request, Response } from "express";
import { respondWithJSON } from "../api/json.js";
import { BadRequestError } from "../error_middleware.js";
import { createChirp } from "../lib/db/queries/chirps.js";

export async function handlerPostChirp(req: Request, res: Response){
    type parameters = {
        body: string;
        userId: string;
      };


            const params: parameters = req.body;
            
            if (typeof params.body !== "string") {
                throw new BadRequestError ("Invalid body");
                
            }
            
            const cleaned = validateChirp(params.body);




              const postedChirp = await createChirp({body: cleaned, userId: params.userId});

              respondWithJSON(res, 201, postedChirp);

        

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