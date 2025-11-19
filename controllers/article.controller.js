import Article from "../models/article.model.js"
import Report from "../models/report.model.js";
import articleValidation from "../validations/article.validation.js"

const createArticle  = async (req, res) => {
    try {
        const { titre, contenu } = req.body

        const { error } = articleValidation(req.body).articleCreate
        
        if ( error ) {
            return res.status(401).json(error.details[0].message)
        }

        const article = new Article({
            titre,
            contenu,
            author : req.user.id
        })

        const newArticle = await article.save()

        return res.status(201).json({ msg : "Article créé", newArticle })
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }
}

 const getAllArticles = async (req, res) => {
  try {
    // On récupère tous les articles
    const articles = await Article.find()
      .populate("author", "nom email") // Affiche le nom + email de l’auteur
      .lean(); // Convertit en objets JS simples pour pouvoir ajouter des champs ensuite

    // Pour chaque article, on récupère ses signalements
    const articlesWithReports = await Promise.all(
      articles.map(async (article) => {
        const reports = await Report.find({ article: article._id })
          .populate("reporter", "nom email") // Affiche le nom du signalant
          .select("raisons description status"); // On choisit les champs utiles

        return { ...article, reports }; // On fusionne article + ses signalements
      })
    );

    return res.status(200).json(articlesWithReports);
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
const getMyArticles = async (req, res) => {
  try {
    const authorId = req.user.id; // 🔥 ID issu du token JWT

    const articles = await Article.find({ author: authorId })
      .populate("author", "nom email")
      .lean();

    const articlesWithReports = await Promise.all(
      articles.map(async (article) => {
        const reports = await Report.find({ article: article._id })
          .populate("reporter", "nom email")
          .select("raisons description status");

        return { ...article, reports };
      })
    );

    return res.status(200).json(articlesWithReports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

 const getAllArticlesModeration = async (req, res) => {
  try {
    // 1️⃣ On récupère tous les IDs d'articles signalés avec status = "approuvé"
    const approvedReports = await Report.find({ status: "approuvé" }).distinct("article");

    // 2️⃣ On récupère tous les articles sauf ceux-là
    const articles = await Article.find({
      _id: { $nin: approvedReports }, // $nin = "non inclus dans cette liste"
    })
      .populate("author", "nom prenom")
      .sort({ createdAt: -1 }); // plus récents d’abord, optionnel

    return res.status(200).json(articles);
  } catch (error) {
    console.error("Erreur serveur :", error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const getArticleById = async(req,res) => {
    try {
        const article = await Article.findById(req.params.id)
        if(!article){
            return res.status(404).json({message: "article doesn't exist"})
        }
        return res.status(200).json(article)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const updateArticle = async (req, res) => {
  try {
    const { body } = req;

    if (!body) {
      return res.status(400).json({ message: "No data in the request" });
    }

    // 👉 Vérification Validations Joi
    const { error } = articleValidation(body).articleUpdate;
    if (error) {
      return res.status(401).json(error.details[0].message);
    }

    // 👉 On récupère l’article
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "article doesn't exist" });
    }

    // ❌ Vérification de l’auteur
    if (article.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Vous n’êtes pas autorisé à modifier cet article",
      });
    }

    // 👉 Mise à jour
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      body,
      { new: true }
    );

    return res.status(200).json(updatedArticle);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const deleteArticle = async (req, res) => {
  try {
    // 👉 On récupère l’article
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "article doesn't exist" });
    }

    // ❌ Vérification de l’auteur
    if (article.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Vous n’êtes pas autorisé à supprimer cet article",
      });
    }

    // 👉 Suppression
    await Article.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "article has been deleted"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export { createArticle, getAllArticles, getMyArticles, getAllArticlesModeration, getArticleById, updateArticle, deleteArticle }