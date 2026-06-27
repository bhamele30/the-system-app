import { Router, type IRouter } from "express";
import healthRouter from "./health";
import appRouter from "./routes";
import stripeRouter from "./stripe";

const router: IRouter = Router();

router.use(healthRouter);
router.use(stripeRouter);
router.use(appRouter);

export default router;
