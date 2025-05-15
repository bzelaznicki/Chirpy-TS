import {Request, Response } from "express";
import { getUserByID, setChirpyRed } from "../lib/db/queries/users.js";
import { NotFoundError } from "../error_middleware.js";

export async function handlerWebhookPolka(req: Request, res: Response){
    type parameters = {
        event: string,
        data: {
            userId: string,
        }
    }

    const params: parameters = req.body;

    if (params.event !== "user.upgraded"){
        res.status(204).end();
        return;
    }

    const user = await getUserByID(params.data.userId);

    if (!user) {
        throw new NotFoundError("User not found");
    }

    const updatedUser = await setChirpyRed(user.id, true);

    if (!updatedUser){
        throw new Error ("Unable to update user");
    }

    res.status(204).end();    
    
}