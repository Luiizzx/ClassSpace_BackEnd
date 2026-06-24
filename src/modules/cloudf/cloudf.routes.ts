import { Router } from "express";
import { generateUrl } from "./cloudf.controller.js";

const router = Router();

router.use("/generateUrl", generateUrl);

export default router;