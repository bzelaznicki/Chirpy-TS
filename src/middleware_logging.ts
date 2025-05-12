import { NextFunction, Request, Response } from "express";

export function middlewareLogResponses(req: Request, res: Response, next: NextFunction): void {
    res.on("finish", () => {
        if (res.statusCode !== 200){
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });
    next();
}