import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

import userRoute from "./routes/user.route.js";
import articleRoute from "./routes/article.route.js";
import imageRoutes from "./routes/image.route.js";
import reportRoutes from "./routes/report.route.js";

import db from "./db/db.js";
import { InfluxDBClient, Point } from "@influxdata/influxdb3-client";

// Charger .env
dotenv.config();

// Correction pour ES Modules (__dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express
const app = express();
app.set("trust proxy", true);

// Middlewares
app.use(cors());
app.use(express.json());

// --- InfluxDB (Chargement une seule fois) ---
const influx = new InfluxDBClient({
  host: process.env.INFLUXDB_HOST,
  token: process.env.INFLUXDB_TOKEN,
});

// Exemple : fonction pour écrire dans Influx
export async function writeVisit() {
  const point = new Point("visits")
    .tag("app", "goli")
    .floatField("count", 1);

  await influx.write(point, process.env.INFLUXDB_BUCKET);
  console.log("Donnée envoyée à InfluxDB");
}

// --- ROUTES ---
app.use("/user", userRoute);
app.use("/article", articleRoute);
app.use("/image", imageRoutes);
app.use("/report", reportRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- LANCEMENT SERVEUR + DB ---
const port = process.env.PORT || 5000;

async function startServer() {
  try {
    await db(); // Connexion MongoDB
    console.log("MongoDB connecté");

    app.listen(port, () => {
      console.log(`Le serveur écoute sur le port ${port}`);
    });

  } catch (err) {
    console.error("Erreur au démarrage :", err);
  }
}

startServer();
