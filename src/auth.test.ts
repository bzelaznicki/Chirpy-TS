import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT, hashPassword, checkPasswordHash } from "./auth";

describe("auth.ts", () => {
  const testPassword = "supersecret";
  const shortPassword = "123";
  const userID = "user123";
  const secret = "testsecret";
  const expiresIn = 60; // 1 minute
  let passwordHash: string;

  describe("hashPassword", () => {
    it("hashes a valid password", async () => {
      passwordHash = await hashPassword(testPassword);
      expect(typeof passwordHash).toBe("string");
      expect(passwordHash).not.toBe(testPassword);
    });
    it("throws error for short password", async () => {
      await expect(hashPassword(shortPassword)).rejects.toThrow(/Password too short/);
    });
  });

  describe("checkPasswordHash", () => {
    beforeAll(async () => {
      passwordHash = await hashPassword(testPassword);
    });
    it("returns true for correct password", async () => {
      const result = await checkPasswordHash(testPassword, passwordHash);
      expect(result).toBe(true);
    });
    it("returns false for incorrect password", async () => {
      const result = await checkPasswordHash("wrongpass", passwordHash);
      expect(result).toBe(false);
    });
  });

  describe("makeJWT & validateJWT", () => {
    it("creates a valid JWT and validates it", async () => {
      const token = makeJWT(userID, expiresIn, secret);
      expect(typeof token).toBe("string");
      const sub = validateJWT(token, secret);
      expect(sub).toBe(userID);
    });
    it("throws error for invalid JWT", async () => {
      const badToken = "invalid.token.value";
      expect(() => validateJWT(badToken, secret)).toThrow(/Cannot verify JWT Token/);
    });
    it("throws error for tampered JWT", async () => {
      const token = makeJWT(userID, expiresIn, secret);
      // Tamper with the token
      const tampered = token.split(".").map((part, i) => i === 2 ? "tampered" : part).join(".");
      expect(() => validateJWT(tampered, secret)).toThrow(/Cannot verify JWT Token/);
    });
    it("throws error for expired JWT", async () => {
      const shortExpiresIn = 1; // 1 second
      const token = makeJWT(userID, shortExpiresIn, secret);
      // Wait for token to expire
      await new Promise(res => setTimeout(res, 2000));
      expect(() => validateJWT(token, secret)).toThrow(/Cannot verify JWT Token/);
    });
  });
});

