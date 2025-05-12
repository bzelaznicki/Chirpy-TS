import { Request, Response } from "express";

export async function handlerValidateChirp(req: Request, res: Response){
    type parameters = {
        body: string;
      };

        try{
            const params: parameters = req.body;
            
            if (typeof params.body !== "string") {
                res.header("Content-Type", "application/json");
                res.status(400).send(JSON.stringify({ error: "Invalid body" }));  
                return;
            }
            
            if (params.body.length > 140) {
                type responseData = {
                    error: string,
                }
                const response: responseData = {
                    error: "Chirp is too long",
                }
                const respBody = JSON.stringify(response);
                res.header("Content-Type", "application/json");
                res.status(400).send(respBody);
                return;
            }
            type responseData = {
                valid: boolean,
              };
            
              const respBody: responseData = {
                valid: true,
                
              };
            
              res.header("Content-Type", "application/json");
              const response = JSON.stringify(respBody);
              res.status(200).send(response);

        } catch (error){
            res.header("Content-Type", "application/json");
            res.status(400).send(JSON.stringify({ error: "Something went wrong" }));
        }

}