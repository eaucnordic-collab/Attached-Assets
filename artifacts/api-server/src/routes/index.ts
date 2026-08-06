import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import siteContentRouter from "./site-content";
import pagesRouter from "./pages";
import blocksRouter from "./blocks";
import navigationRouter from "./navigation";
import newsRouter from "./news";
import eventsRouter from "./events";
import projectsRouter from "./projects";
import teamRouter from "./team";
import partnersRouter from "./partners";
import mediaRouter from "./media";
import formsRouter from "./forms";
import submissionsRouter from "./submissions";
import settingsRouter from "./settings";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(siteContentRouter);
router.use(pagesRouter);
router.use(blocksRouter);
router.use(navigationRouter);
router.use(newsRouter);
router.use(eventsRouter);
router.use(projectsRouter);
router.use(teamRouter);
router.use(partnersRouter);
router.use(mediaRouter);
router.use(formsRouter);
router.use(submissionsRouter);
router.use(settingsRouter);
router.use(dashboardRouter);

export default router;
