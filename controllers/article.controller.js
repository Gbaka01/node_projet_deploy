import Article from "../models/article.model.js"
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

const getAllArticles = async(req, res) => {
    try {
        const articles = await Article.find().populate("author", "nom")
        return res.status(200).json(articles)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server Error", error: error})
    }
}

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

const updateArticle = async(req,res) => {
    try {
        const {body} = req
        if(!body){
            return res.status(400).json({message: "No data in the request"})
        }

        const {error} = articleValidation(body).articleUpdate
        if(error){
            return res.status(401).json(error.details[0].message)
        }
        const updatedArticle = await Article.findByIdAndUpdate(req.params.id, body, {new: true})
        if(!updatedArticle){
            res.status(404).json({message: "article doesn't exist"})
        }
        return res.status(200).json(updatedArticle)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const deleteArticle = async(req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id)
        if(!article){
            return res.status(404).json({message: "article doesn't exist"})
        }
        return res.status(200).json({message: "article has been deleted"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

export { createArticle, getAllArticles, getArticleById, updateArticle, deleteArticle }