import joi from "joi";

export default function imageValidation(body){
    const imageCreate = joi.object({
      nom: joi.string().required(),
      alt: joi.string()
    })

    const imageUpdate = joi.object({
      nom: joi.string(),
      alt: joi.string()
    })

    return {
        imageCreate: imageCreate.validate(body),
        imageUpdate: imageUpdate.validate(body),
    }
}
