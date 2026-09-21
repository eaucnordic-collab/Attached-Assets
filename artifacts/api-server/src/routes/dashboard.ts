import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, pagesTable, newsTable, eventsTable, projectsTable, teamTable, partnersTable, submissionsTable, auditLogTable } from "@workspace/db";
import { serialize } from "../lib/serialize";
import {
  GetDashboardStatsResponse,
  GetDashboardActivityResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/admin-auth";

const router: IRouter = Router();

router.get("/dashboard/stats", requireAdmin, async (_req, res): Promise<void> => {
  const [pages, news, events, projects, team, partners, submissions] = await Promise.all([
    db.select().from(pagesTable),
    db.select().from(newsTable),
    db.select().from(eventsTable),
    db.select().from(projectsTable),
    db.select().from(teamTable),
    db.select().from(partnersTable),
    db.select().from(submissionsTable).orderBy(desc(submissionsTable.createdAt)).limit(5),
  ]);

  const now = new Date().toISOString().split("T")[0]!;

  const stats = {
    totalPages: pages.length,
    publishedPages: pages.filter((p) => p.status === "published").length,
    totalNews: news.length,
    publishedNews: news.filter((n) => n.status === "published").length,
    totalEvents: events.length,
    upcomingEvents: events.filter((e) => e.startDate >= now).length,
    totalProjects: projects.length,
    totalSubmissions: submissions.length,
    totalTeamMembers: team.length,
    totalPartners: partners.length,
    recentSubmissions: submissions,
  };

  res.json(serialize(stats));

});

router.get("/dashboard/activity", requireAdmin, async (_req, res): Promise<void> => {
  let activity: { id: number; type: string; title: string; action: string; user: string | null; createdAt: Date }[] = [];
  try {
    activity = await db.select().from(auditLogTable).orderBy(desc(auditLogTable.createdAt)).limit(20);
  } catch (_e) {
    // audit log may be empty
  }
  res.json(serialize(activity));

});

export default router;
