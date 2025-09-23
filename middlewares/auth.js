import jwt from "jsonwebtoken"

export default function auth(req, res, next) {
  try {
    const authHeader = req.headers["authorization"] // récupère le header complet
    if (!authHeader) {
      return res.status(401).json({ message: "Aucun token fourni" })
    }

    // On attend "Bearer <token>"
    const parts = authHeader.split(" ")
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Format de token invalide" })
    }

    const token = parts[1]

    // Vérifier le token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Token invalide ou expiré" })
      }

      // Injecter les infos du token dans req.user
      req.user = decoded
      next()
    })
  } catch (err) {
    console.error("Erreur auth middleware:", err)
    res.status(500).json({ message: "Erreur serveur" })
  }
}
