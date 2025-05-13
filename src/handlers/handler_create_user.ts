import { Request, Response } from "express";
import { BadRequestError } from "../error_middleware.js";
import { config } from "../config";
import { createUser } from "../lib/db/queries/users.js";
import { NewUser } from "../lib/db/schema";
import { respondWithJSON } from "../api/json.js";

export async function handlerCreateUser(req: Request, res: Response){
    type parameters = {
        email: string,
    };

        const params: parameters = req.body;

            if (typeof params.email !== "string") {
                throw new BadRequestError ("Invalid body");
            }

        const createdUser = await createUser({email: params.email});

    if (!createdUser) {
        throw new Error("Could not create user");
    }
        

        respondWithJSON(res, 201, {id: createdUser.id, createdAt: createdUser.createdAt, updatedAt: createdUser.updatedAt, email: createdUser.email});


}