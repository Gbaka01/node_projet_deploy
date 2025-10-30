import express from "express";
import auth from "../middlewares/auth.js";
import roleCheck from "../middlewares/roleCheck.js";
import { createReport, getReports, updateReportStatus } from "../controllers/report.controller.js";

const router = express.Router();

// 🔹 POST /report/new → crée un signalement (user ou modérateur)
router.post("/", auth, createReport);




// 🔹 modérateur : voir tous les signalements
router.get("/", auth, roleCheck(["moderateur", "admin"]), getReports);
// 🔹 modérateur : approuver ou rejeter un signalement
router.put("/:id", auth, roleCheck(["moderateur", "admin"]), updateReportStatus);




export default router;
