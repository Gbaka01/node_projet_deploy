
import jwt from "jsonwebtoken"

export default function auth(req, res, next) {
  try {
    // Récupère l'entête Authorization
    const authHeader = req.headers["authorization"]
    if (!authHeader) {
      return res.status(401).json({ message: "⚠️ Aucun token fourni" })
    }

    // Découpe "Bearer <token>"
    const parts = authHeader.split(" ")
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "⚠️ Format de token invalide" })
    }

    const token = parts[1]

    // Vérifie le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // ✅ Si valide → on stocke les infos dans req.user
    req.user = decoded

    next()
  } catch (err) {
    console.error("Erreur auth:", err.message)
    return res.status(401).json({ message: "⚠️ Token invalide ou expiré" })
  }
}

