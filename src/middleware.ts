import { NextFunction, Request, Response } from "express";
import { config } from "./config.js";
import { respondWithError } from "./api/json.js";

export function middlewareLogResponses(req: Request, res: Response, next: NextFunction): void {
    res.on("finish", () => {
        if (res.statusCode !== 200){
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });
    next();
}

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction){
    res.on("finish", () => {
        config.fileserverHits++;
    })

    next();
}

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    console.error(`Unhandled error: ${err}`);
    respondWithError(res, 500, "Something went wrong on our end")
  }
  
  