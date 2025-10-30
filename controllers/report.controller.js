// controllers/report.controller.js
import Report from "../models/report.model.js";

export const createReport = async (req, res) => {
  try {
    const { articleId, raisons, description, status } = req.body;

    if (!articleId || !raisons || !raisons.length) {
      return res.status(400).json({ message: "Article ou raisons manquants" });
    }

    // utilisateur connecté (modérateur ou user)
     const reporterId = req.user?.id || null;

    const report = new Report({
      articleId,
      reporter: reporterId,
      raisons,
      description,
      status
    });

    await report.save();

    res.status(201).json({ message: "Signalement créé avec succès", report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
// 📋 Voir tous les signalements
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("articleId", "titre")
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (err) {
    console.error("Erreur getReports:", err);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// 🔄 Changer le statut (approuvé / rejeté)
export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validation
    if (!["en_attente", "approuvé", "rejeté"].includes(status)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    // Recherche et mise à jour
    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: "Signalement introuvable" });
    }

    report.status = status;
    await report.save();

    res.status(200).json({
      message: `Statut du signalement mis à jour en '${status}' ✅`,
      report,
    });
  } catch (err) {
    console.error("❌ Erreur updateReportStatus:", err);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};



