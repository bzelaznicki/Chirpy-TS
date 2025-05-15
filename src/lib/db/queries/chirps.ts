import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";
import { asc, eq } from "drizzle-orm";

export async function createChirp(chirp: NewChirp){
    const [result] = await db.insert(chirps).values(chirp).returning();
    return result;
}

export async function getChirps(authorId?: string){
    const query = authorId
        ? db.select().from(chirps).where(eq(chirps.userId, authorId))
        : db.select().from(chirps);

    const result = await query.orderBy(asc(chirps.createdAt));
    return result;
}

export async function getChirpsByAuthor(userId: string){
    const result = await db.select().from(chirps).where(eq(chirps.userId, userId)).orderBy(asc(chirps.createdAt));
}

export async function getSingleChirp(chirpId: string){
    const [result] = await db.select().from(chirps).where(eq(chirps.id, chirpId));
    return result;
}


export async function deleteChrip(chirpId: string){
    await db.delete(chirps).where(eq(chirps.id, chirpId));
}