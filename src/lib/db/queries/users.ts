import { db } from "../index.js";
import { NewUser, users } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning({
    id: users.id,
    email: users.email,
    createdAt: users.createdAt,
    updatedAt: users.updatedAt,
    isChirpyRed: users.isChirpyRed,
  });
  return result;
}

export async function getUserByEmail(email: string) {
  const [result] = await db.select().from(users).where(eq(users.email, email));
  return result;
}
export async function getUserByID(userId: string) {
  const [result] = await db.select().from(users).where(eq(users.id, userId));
  return result;
}

export async function resetUsers() {
  await db.delete(users);
}

export async function updateUser(userId: string, email?: string, hashedPassword?: string){
  const updateData: Record<string, any> = {};

  if (email){
    updateData.email = email;
  }
  if (hashedPassword){
    updateData.hashedPassword = hashedPassword;
  }
  const [result] = await db.update(users).set(updateData).where(eq(users.id, userId)).returning({
    id: users.id,
    email: users.email,
    createdAt: users.createdAt,
    updatedAt: users.updatedAt,
    isChirpyRed: users.isChirpyRed,
  });
  return result;
}

export async function setChirpyRed(userId: string, isChirpyRed: boolean) {
  const [result] = await db.update(users).set({isChirpyRed: isChirpyRed}).where(eq(users.id, userId)).returning({
    id: users.id,
    email: users.email,
    createdAt: users.createdAt,
    updatedAt: users.updatedAt,
    isChirpyRed: users.isChirpyRed,
  });
  return result;
}