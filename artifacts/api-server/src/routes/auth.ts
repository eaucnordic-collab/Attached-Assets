import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { serialize } from "../lib/serialize";
import { LoginBody, LoginResponse, GetMeResponse } from "@workspace/api-zod";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const router: IRouter = Router();

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  if (!stored.startsWith("scrypt$")) return password === stored;
  const [, salt, expectedHex] = stored.split("$");
  if (!salt || !expectedHex) return false;
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, password } = parsed.data;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));

  if (!user || !verifyPassword(password, user.password)) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  if (!user.password.startsWith("scrypt$")) {
    await db.update(usersTable).set({ password: hashPassword(password) }).where(eq(usersTable.id, user.id));
  }

  req.log.info({ userId: user.id }, "User logged in");
  res.json(serialize({ id: user.id, email: user.email, name: user.name }));

});

router.post("/auth/change-password", async (req, res): Promise<void> => {
  const { email, currentPassword, newPassword } = req.body as Record<string, unknown>;
  if (typeof email !== "string" || typeof currentPassword !== "string" || typeof newPassword !== "string") {
    res.status(400).json({ error: "All password fields are required" });
    return;
  }
  if (newPassword.length < 10) {
    res.status(400).json({ error: "New password must contain at least 10 characters" });
    return;
  }
  if (newPassword === currentPassword) {
    res.status(400).json({ error: "New password must be different from the current password" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (!user || !verifyPassword(currentPassword, user.password)) {
    res.status(401).json({ error: "Current password is incorrect" });
    return;
  }

  await db.update(usersTable).set({ password: hashPassword(newPassword) }).where(eq(usersTable.id, user.id));
  req.log.info({ userId: user.id }, "User changed password");
  res.json({ ok: true });
});

router.post("/auth/logout", async (_req, res): Promise<void> => {
  res.json({ ok: true });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  const authHeader = req.headers.authorization;
  const userId = authHeader ? parseInt(authHeader.replace("Bearer ", ""), 10) : NaN;

  if (!userId || isNaN(userId)) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  res.json(serialize({ id: user.id, email: user.email, name: user.name }));

});

export default router;
