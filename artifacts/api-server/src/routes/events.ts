import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, eventsTable } from "@workspace/db";
import { serialize } from "../lib/serialize";
import {
  ListEventsResponse,
  CreateEventBody,
  CreateEventResponse,
  GetEventParams,
  GetEventResponse,
  UpdateEventParams,
  UpdateEventBody,
  UpdateEventResponse,
  DeleteEventParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/events", async (req, res): Promise<void> => {
  const type = req.query.type as string | undefined;
  let events = await db.select().from(eventsTable).orderBy(asc(eventsTable.startDate));
  const now = new Date().toISOString().split("T")[0]!;
  if (type === "upcoming") {
    events = events.filter((e) => e.startDate >= now);
  } else if (type === "past") {
    events = events.filter((e) => e.startDate < now);
  }
  res.json(serialize(events));

});

router.post("/events", async (req, res): Promise<void> => {
  const parsed = CreateEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [event] = await db
    .insert(eventsTable)
    .values({
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      startDate: parsed.data.startDate,
      endDate: parsed.data.endDate ?? null,
      time: parsed.data.time ?? null,
      location: parsed.data.location ?? null,
      address: parsed.data.address ?? null,
      image: parsed.data.image ?? null,
      registrationUrl: parsed.data.registrationUrl ?? null,
      capacity: parsed.data.capacity ?? null,
      organizer: parsed.data.organizer ?? null,
      status: parsed.data.status ?? "published",
    })
    .returning();
  res.status(201).json(serialize(event));

});

router.get("/events/:id", async (req, res): Promise<void> => {
  const params = GetEventParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, params.data.id));
  if (!event) {
    res.status(404).json({ error: "Event not found" });
    return;
  }
  res.json(serialize(event));

});

router.patch("/events/:id", async (req, res): Promise<void> => {
  const params = UpdateEventParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [event] = await db
    .update(eventsTable)
    .set(parsed.data)
    .where(eq(eventsTable.id, params.data.id))
    .returning();
  if (!event) {
    res.status(404).json({ error: "Event not found" });
    return;
  }
  res.json(serialize(event));

});

router.delete("/events/:id", async (req, res): Promise<void> => {
  const params = DeleteEventParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(eventsTable).where(eq(eventsTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
