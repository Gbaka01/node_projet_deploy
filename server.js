import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

import userRoute from "./routes/user.route.js";
import articleRoute from "./routes/article.route.js";
import imageRoutes from "./routes/image.route.js";
import reportRoutes from "./routes/report.route.js";
import db from "./db/db.js"
// Charger .env
dotenv.config();

// Correction pour __dirname avec ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express
const app = express();

// Middlewares
app.set("trust proxy", true) 

app.use(cors());
app.use(express.json());






// Port d'écoute
const port = process.env.PORT || 5000;

// Connexion BDD puis lancement du serveur
// Appel de la configuration de la BDD

// Appel de l'API
app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
});
db()
// Routes principales
app.use("/user", userRoute);
app.use("/article", articleRoute);
app.use("/image", imageRoutes);
app.use("/report", reportRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

