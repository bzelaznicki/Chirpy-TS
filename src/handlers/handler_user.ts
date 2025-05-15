import { Request, Response } from "express";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../error_middleware.js";
import { createUser, getUserByEmail, updateUser } from "../lib/db/queries/users.js";
import { respondWithJSON } from "../api/json.js";
import { checkPasswordHash, getBearerToken, hashPassword, makeJWT, makeRefreshToken, NewRefreshToken, validateJWT } from "../auth.js";
import { NewUser } from "../lib/db/schema.js";
import { config } from "../config.js";

    type Parameters = {
        email?: string,
        password?: string,
    };


export type UserResponse = Omit<NewUser, "hashedPassword">;

export async function handlerCreateUser(req: Request, res: Response) {
    const params: Parameters = req.body;

    if (typeof params.email !== "string" || typeof params.password !== "string") {
        throw new BadRequestError("Invalid body - email and password must be strings");
    }

    try {
        const hashedPassword = await hashPassword(params.password);
        const createdUser: UserResponse = await createUser({
            email: params.email,
            hashedPassword: hashedPassword,
        });

        if (!createdUser) {
            throw new Error("Could not create user");
        }

        respondWithJSON(res, 201, createdUser);
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

        const token = makeJWT(user.id, config.jwt.defaultDuration, config.jwt.secret);
        const refreshToken = makeRefreshToken()

        const savedToken = await NewRefreshToken(user.id, refreshToken);

        if (!savedToken){
            throw new UnauthorizedError("Failed to generate token");
            
        }

        respondWithJSON(res, 200, {
            id: user.id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            email: user.email,
            token: token,
            refreshToken: savedToken.token,
        });
    } catch (error) {
        
        if (error instanceof UnauthorizedError) {
            throw error;
        }
        throw new UnauthorizedError("Incorrect email or password");
    }
}

export async function handlerUpdateUser(req: Request, res: Response){
    const params: Parameters = req.body;
                if (typeof params.email !== "string" || typeof params.password !== "string") {
                    throw new BadRequestError("Invalid body - email and password must be strings");
                }

                const jwtToken = getBearerToken(req);
                const userToken = validateJWT(jwtToken, config.jwt.secret);
    
                if (!userToken) {
                  throw new UnauthorizedError(`Invalid bearer token`);
                }

                const hashedPassword = params.password ? await hashPassword(params.password) : "";

                const updatedUser: UserResponse = await updateUser(userToken, params.email ? params.email : undefined, hashedPassword ? hashedPassword : undefined);

                if (!updatedUser) {
                    throw new BadRequestError("User not found");
                }
                
                respondWithJSON(res, 200, updatedUser);
}