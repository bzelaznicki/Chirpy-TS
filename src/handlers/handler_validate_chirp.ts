import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "../api/json.js";
import { BadRequestError } from "../error_middleware.js";

export async function handlerValidateChirp(req: Request, res: Response){
    type parameters = {
        body: string;
      };


            const params: parameters = req.body;
            
            if (typeof params.body !== "string") {
                throw new BadRequestError ("Invalid body");
                
            }
            

            if (params.body.length > 140) {
                throw new BadRequestError ("Chirp is too long. Max length is 140");
            }


              let stringArr = params.body.split(" ");
              const cleanedString: string[] = [];

              for (let word of stringArr) {
                if (word.toLowerCase() === "kerfuffle" || 
                    word.toLowerCase() === "sharbert" || 
                    word.toLowerCase() === "fornax") {
                        word = "****";
                }
                cleanedString.push(word);

              }
              type responseData = {
                cleanedBody: string,
              };
            
              const respBody: responseData = {
                cleanedBody: cleanedString.join(" "),
                
              };
              respondWithJSON(res, 200, respBody);

        

}