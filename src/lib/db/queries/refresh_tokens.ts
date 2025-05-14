import { db } from "../index.js";
import { NewRefreshToken, refreshTokens } from "../schema.js";
import { eq, sql } from "drizzle-orm";


export async function saveRefreshToken(refreshToken: NewRefreshToken){
    const [result] = await db.insert(refreshTokens).values(refreshToken).returning();
    return result;
}

export async function getUserFromRefreshToken(refreshToken: string){
    const [result] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, refreshToken));
    return result;
}

export async function revokeToken(refreshToken: string){
    const [result] = await db.update(refreshTokens).set({revoked_at: sql`NOW()`}).where(eq(refreshTokens.token, refreshToken)).returning();
    return result;
}