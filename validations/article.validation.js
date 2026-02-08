import joi from "joi";

export default function articleValidation(body){
    const articleCreate = joi.object({
      titre: joi.string().required(),
      contenu: joi.string().required()
    })

    const articleUpdate = joi.object({
      titre: joi.string(),
      contenu: joi.string()
    })

    return {
        articleCreate: articleCreate.validate(body),
        articleUpdate: articleUpdate.validate(body),
    }
}
