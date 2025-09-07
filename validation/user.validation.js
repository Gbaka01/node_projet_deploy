import joi from 'joi'

function userValidation(body) {
    const userLawRegister = joi.object({
        nom : joi.string(),
        prenom : joi.string(),
        email : joi.string().required(),
        // Regex : Minimum 8 caractères, une majuscule, une minuscule,, un chiffre et un caractère spécial
        password : joi.string().required()
    })
    
    
    const userLawLogin = joi.object({
        email : joi.string().required(),
        password : joi.string().required()
    })
    
    const userLawUpdate = joi.object({
        nom : joi.string(),
        prenom : joi.string(),
        email : joi.string(),
        // Regex : Minimum 8 caractères, une majuscule, une minuscule,, un chiffre et un caractère spécial
        password : joi.string()
    })
    
    return {
        userLawRegister : userLawRegister.validate(body),
        userLawLogin : userLawLogin.validate(body),
        userLawUpdate : userLawUpdate.validate(body)
    }
}

export default userValidation
