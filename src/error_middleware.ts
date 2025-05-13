import { Request, Response, NextFunction } from "express";
import { respondWithError } from "./api/json.js";

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class BadRequestError extends Error {
    constructor(message: string){
        super(message);
    }
}

export class UnauthorizedError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class ForbiddenError extends Error {
    constructor(message: string){
        super(message);
    }
}

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {

    let statusCode = 500;
    let message = "Something went wrong on our end"

    if (err instanceof NotFoundError) {
        statusCode = 404;
        message = err.message;
    } else if (err instanceof BadRequestError) {
        statusCode = 400;
        message = err.message;     
    } else if (err instanceof UnauthorizedError){
        statusCode = 401;
        message = err.message;
    } else if (err instanceof ForbiddenError) {
        statusCode = 403;
        message = err.message;
    }
    if (statusCode >= 500){
    console.error(`Unhandled error: ${err.message}`);
    }
    respondWithError(res, statusCode, message);
    
  }
  