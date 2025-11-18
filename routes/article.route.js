
import { Router } from "express";
import { createArticle, getAllArticles, getMyArticles, getAllArticlesModeration, getArticleById, updateArticle, deleteArticle } from "../controllers/article.controller.js"
import auth from "../middlewares/auth.js"
const router = Router()

router.post('/new',auth, createArticle)
router.get('/all', getAllArticles)
router.get("/my", auth, getMyArticles);
router.get('/all1', getAllArticlesModeration)
router.get('/:id', getArticleById)
router.put('/:id', auth, updateArticle)
router.delete('/:id', auth, deleteArticle)

export default router