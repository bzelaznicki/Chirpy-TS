import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';


const TOKEN_ISSUER = "chirpy";
export async function hashPassword(password: string): Promise<string> {
    const minPasswordLength = 6;
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
        iss: TOKEN_ISSUER,
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
        throw new Error(`Cannot verify JWT Token: ${error.message}`);
    } else {
        throw new Error("Unknown error during JWT validation");
    }
}

}