import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { serialize } from "../lib/serialize";
import { LoginBody, LoginResponse, GetMeResponse } from "@workspace/api-zod";
import { hashPassword, verifyPassword } from "../lib/password";
import { clearAdminSession, createAdminSession, readAdminSession, setAdminSession } from "../lib/admin-auth";

const router: IRouter = Router();

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
  setAdminSession(res, createAdminSession(user.id));
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
  clearAdminSession(res);
  res.json({ ok: true });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  const userId = readAdminSession(req);
  if (!userId) {
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
