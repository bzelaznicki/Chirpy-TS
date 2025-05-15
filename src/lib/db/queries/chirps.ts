import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";
import { asc, eq } from "drizzle-orm";

export async function createChirp(chirp: NewChirp){
    const [result] = await db.insert(chirps).values(chirp).returning();
    return result;
}

export async function getChirps(){
    const result = await db.select().from(chirps).orderBy(asc(chirps.createdAt));
    return result;
}

export async function getSingleChirp(chirpId: string){
    const [result] = await db.select().from(chirps).where(eq(chirps.id, chirpId));
    return result;
}


export async function deleteChrip(chirpId: string){
    await db.delete(chirps).where(eq(chirps.id, chirpId));
}