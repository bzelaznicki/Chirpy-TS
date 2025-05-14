import { Request, Response } from "express";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../error_middleware.js";
import { createUser, getUserByEmail } from "../lib/db/queries/users.js";
import { respondWithJSON } from "../api/json.js";
import { checkPasswordHash, hashPassword } from "../auth.js";
import { NewUser } from "src/lib/db/schema.js";

    type Parameters = {
        email: string;
        password: string;
    };

export async function handlerCreateUser(req: Request, res: Response) {
    const params: Parameters = req.body;

    if (typeof params.email !== "string" || typeof params.password !== "string") {
        throw new BadRequestError("Invalid body - email and password must be strings");
    }

    try {
        const hashedPassword = await hashPassword(params.password);
        const createdUser = await createUser({
            email: params.email,
            hashedPassword: hashedPassword,
        });

        if (!createdUser) {
            throw new Error("Could not create user");
        }

        respondWithJSON(res, 201, {
            id: createdUser.id,
            createdAt: createdUser.createdAt,
            updatedAt: createdUser.updatedAt,
            email: createdUser.email,
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("Password too short")) {
                throw new BadRequestError(`Invalid password: ${error.message}`);
            }
            throw new BadRequestError(`Failed to create user: ${error.message}`);
        }
        throw new BadRequestError("An unknown error occurred");
    }
}

export async function handlerLogin(req: Request, res: Response) {
    const params: Parameters = req.body;
    if (typeof params.email !== "string" || typeof params.password !== "string") {
        throw new BadRequestError("Invalid body - email and password must be strings");
    }

    try {
        const user = await getUserByEmail(params.email);
        
        if (!user) {
            throw new UnauthorizedError("Incorrect email or password");
        }
        
        const isValidPassword = await checkPasswordHash(params.password, user.hashedPassword);
        if (!isValidPassword) {
            throw new UnauthorizedError("Incorrect email or password");
        }

        respondWithJSON(res, 200, {
            id: user.id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            email: user.email,
        });
    } catch (error) {
        
        if (error instanceof UnauthorizedError) {
            throw error;
        }
        throw new UnauthorizedError("Incorrect email or password");
    }
}