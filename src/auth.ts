import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { UnauthorizedError } from './error_middleware.js';
import { config } from './config.js';
import { randomBytes } from 'crypto';
import { saveRefreshToken } from './lib/db/queries/refresh_tokens.js';


export async function hashPassword(password: string): Promise<string> {
    const minPasswordLength = 5;
    if (password.length < minPasswordLength){
        throw new Error(`Password too short. Minimum length: ${minPasswordLength}`); 
    }
    const saltRounds = 10;
    const hashedPassword: string = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    type payload = Pick<JwtPayload, "iss" | "sub" >;

    const now = Math.floor(Date.now() / 1000);
    const payload: payload = {
        iss: config.jwt.issuer,
        sub: userID
    };
    return jwt.sign(payload, secret, {algorithm: "HS256",expiresIn: expiresIn});
    
}

export function validateJWT(tokenString: string, secret: string): string {
    
    try {
        const verifiedToken = jwt.verify(tokenString, secret) as JwtPayload;
    if (typeof verifiedToken.sub !== "string") {
        throw new Error("Invalid token: missing subject");
    }
    return verifiedToken.sub;
}   catch (error) {
    if (error instanceof Error) {
        throw new UnauthorizedError(`Cannot verify JWT Token: ${error.message}`);
    } else {
        throw new UnauthorizedError("Unknown error during JWT validation");
    }
}

}

export function getBearerToken(req: Request): string {
    const tokenArr = req.get("Authorization")?.split(" ");
    if (!tokenArr || tokenArr.length !== 2 || tokenArr[0] !== "Bearer"){
        throw new UnauthorizedError("Invalid bearer token");
    }
    
    return tokenArr[1];

}

export function getApiKey(req: Request): string {
    const tokenArr = req.get("Authorization")?.split(" ");
    if (!tokenArr || tokenArr.length !== 2 || tokenArr[0] !== "ApiKey"){
        throw new UnauthorizedError("Invalid API Key");
    }
    
    return tokenArr[1];

}
export function makeRefreshToken(){
    return randomBytes(32).toString('hex');
}

export async function NewRefreshToken(userId: string, refreshToken: string) {

    const expiresAt = new Date();
    
    expiresAt.setDate(expiresAt.getDate() + 60);
    
    const savedToken = await saveRefreshToken({
        token: refreshToken,
        userId: userId,
        expiresAt: expiresAt, 
    });
    
    return savedToken;
}