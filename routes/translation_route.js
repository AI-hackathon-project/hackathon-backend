import { Router } from "express";
import { translateText } from "../controllers/translation_controller.js";

export const translateRouter = Router();

translateRouter.post("/translate", translateText);

