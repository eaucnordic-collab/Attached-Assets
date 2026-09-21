import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, projectsTable } from "@workspace/db";
import { serialize } from "../lib/serialize";
import {
  ListProjectsResponse,
  CreateProjectBody,
  CreateProjectResponse,
  GetProjectParams,
  GetProjectResponse,
  UpdateProjectParams,
  UpdateProjectBody,
  UpdateProjectResponse,
  DeleteProjectParams,
} from "@workspace/api-zod";
import { readAdminSession } from "../lib/admin-auth";

const router: IRouter = Router();

router.get("/projects", async (req, res): Promise<void> => {
  const featuredParam = req.query.featured as string | undefined;
  let projects = await db.select().from(projectsTable).orderBy(desc(projectsTable.createdAt));
  if (!readAdminSession(req)) {
    projects = projects.filter((project) => project.status === "active");
  }
  if (featuredParam !== undefined) {
    const featured = featuredParam === "true";
    projects = projects.filter((p) => p.featured === featured);
  }
  res.json(serialize(projects));

});

router.post("/projects", async (req, res): Promise<void> => {
  const parsed = CreateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [project] = await db
    .insert(projectsTable)
    .values({
      title: parsed.data.title,
      shortDescription: parsed.data.shortDescription ?? null,
      fullDescription: parsed.data.fullDescription ?? null,
      images: (parsed.data.images as string[]) ?? [],
      status: parsed.data.status ?? "active",
      startDate: parsed.data.startDate ?? null,
      endDate: parsed.data.endDate ?? null,
      partners: (parsed.data.partners as string[]) ?? [],
      buttonLabel: parsed.data.buttonLabel ?? null,
      buttonUrl: parsed.data.buttonUrl ?? null,
      featured: parsed.data.featured ?? false,
    })
    .returning();
  res.status(201).json(serialize(project));

});

router.get("/projects/:id", async (req, res): Promise<void> => {
  const params = GetProjectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, params.data.id));
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  if (project.status !== "active" && !readAdminSession(req)) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json(serialize(project));

});

router.patch("/projects/:id", async (req, res): Promise<void> => {
  const params = UpdateProjectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [project] = await db
    .update(projectsTable)
    .set(parsed.data)
    .where(eq(projectsTable.id, params.data.id))
    .returning();
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json(serialize(project));

});

router.delete("/projects/:id", async (req, res): Promise<void> => {
  const params = DeleteProjectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(projectsTable).where(eq(projectsTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
