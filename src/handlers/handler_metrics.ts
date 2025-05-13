import { Request, Response } from "express";
import { config } from "../config.js";
import {resetUsers} from "../lib/db/queries/users.js"

export async function handlerMetrics(req: Request, res: Response){
    res.set('Content-Type', 'text/html; charset=utf-8');

    res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.api.fileserverHits} times!</p>
  </body>
</html>`); 
}

export async function handlerReset(req: Request, res: Response){
    config.api.fileserverHits = 0;
    await resetUsers();
    res.set('Content-Type', 'text/plain; charset=utf-8');

    res.send("OK");
}