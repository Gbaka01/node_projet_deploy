import joi from 'joi'
function userValidation(body) {
    const userLawRegister = joi.object({
        nom : joi.string(),
        email : joi.string().email().required(),
        // Regex : Minimum 8 caractères, une majuscule, une minuscule,, un chiffre et un caractère spécial
        password : joi.string().required()
    })
    
    
    const userLawLogin = joi.object({
        email : joi.string().email().required(),
        password : joi.string().required()
    })
    
    const userLawUpdate = joi.object({
        nom : joi.string(),
        email : joi.string().required(),
        // Regex : Minimum 8 caractères, une majuscule, une minuscule,, un chiffre et un caractère spécial
        password : joi.string().required()
    })
    const userLawReNewPassword = joi.object({
        // password : joi.string().required(),
        oldPassword: joi.string().required(),
        newPassword: joi.string().required()
        
    })

    
    return {
        userLawRegister : userLawRegister.validate(body),
        userLawLogin : userLawLogin.validate(body),
        userLawUpdate : userLawUpdate.validate(body),
        userLawReNewPassword : userLawReNewPassword.validate(body)
    }
}

export default userValidation
