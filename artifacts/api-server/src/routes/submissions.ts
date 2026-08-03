import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, submissionsTable } from "@workspace/db";
import { serialize } from "../lib/serialize";
import {
  ListSubmissionsResponse,
  DeleteSubmissionParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/submissions", async (req, res): Promise<void> => {
  const formId = req.query.formId ? parseInt(req.query.formId as string, 10) : undefined;
  let subs = await db.select().from(submissionsTable).orderBy(desc(submissionsTable.createdAt));
  if (formId) {
    subs = subs.filter((s) => s.formId === formId);
  }
  res.json(serialize(subs));

});

router.delete("/submissions/:id", async (req, res): Promise<void> => {
  const params = DeleteSubmissionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(submissionsTable).where(eq(submissionsTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
