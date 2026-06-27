import { Router } from "express";
import { storage } from "../storage";

const appRouter = Router();

// Application routes — prefix with /api
// Use storage for CRUD operations e.g. storage.insertUser(user)

export default appRouter;
