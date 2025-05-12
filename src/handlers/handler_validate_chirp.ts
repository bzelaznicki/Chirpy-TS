import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "../api/json.js";

export async function handlerValidateChirp(req: Request, res: Response){
    type parameters = {
        body: string;
      };


            const params: parameters = req.body;
            
            if (typeof params.body !== "string") {
                res.header("Content-Type", "application/json");
                res.status(400).send(JSON.stringify({ error: "Invalid body" }));  
                return;
            }
            

            if (params.body.length > 140) {
                throw new Error ("Chirp is too long");
                //respondWithError(res, 400, "Chirp is too long")
                //return;
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