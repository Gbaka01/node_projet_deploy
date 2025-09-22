import User from '../models/user.model.js'
import userValidation from '../validation/user.validation.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const register = async (req, res) => {
    try {
        const { body } = req
        
        const { error } = userValidation(body).userLawRegister
        console.log(error)
        if ( error ) {
            return res.status(401).json(error.details[0].message)
        }

        const searchUser = await User.findOne({email : req.body.email})

        if ( searchUser ) {
            return res.status(403).json({msg : `Un utilisateur avec l'email ${req.body.email} existe déjà`})
        }

        const user = new User(req.body)
        const newUser = await user.save()
        return res.status(201).json({ msg : "Utilisateur crée", newUser })
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

const login = async (req,res) => {
    try {
        const { email, password } = req.body

        const { error } = userValidation(req.body).userLawLogin

        if ( error ) {
            return res.status(401).json(error.details[0].message)
        }

        const user = await User.findOne({ email : email })

        if ( !user ) {
            return res.status(400).json({ msg : "Identifiants invalides" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if ( !isMatch ) {
            return res.status(400).json({ msg : "identifiants invalides" })
        }

        res.status(200).json({
            user : { id : user._id, nom : user.nom, email : user.email },
            token : jwt.sign({id : user._id, nom : user.nom, prenom : user.prenom, email : user.email }, process.env.SECRET_KEY)
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }
}

const getAll = async (req, res) => {
    try {
        const userList = await User.find().select('-password')

        if ( userList.length == 0 ) {
            return res.status(200).json({ msg : "Liste d'utilisateurs vide" })
        }

        return res.status(200).json(userList)
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }
}

const getOne = async (req,res) => {
    try {
        const user = await User.findById(req.params.id).select('-password')

        if ( !user ) {
            return res.status(400).json({ msg : "Cet utilisateur n'existe pas" })
        }

        return res.status(200).json(user)
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }
}

// const updateOne = async (req, res) => {
//     try {
//         const userId = req.params.id
        
//         const updatedUser = req.body

//         const user = await User.findById(userId)

//         const { error } = userValidation(body).userLawUpdate
        
//         if ( error ) {
//             return res.status(401).json(error.details[0].message)
//         }

//         if ( !user ) {
//             return res.status(400).json({ msg : "Cet utilisateur n'existe pas" })
//         }

//         Object.assign(user, updatedUser)
//         const modifiedUser = await user.save()
//         return res.status(200).json({ msg : "utilisateur mis à jour", modifiedUser })
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ msg : "Erreur lors de la mise à jour de l'utilisateur" })
//     }
// }

// Autre méthode d'update

const updateUser = async (req, res) => {
    try {
        const { body } = req

        if ( !body ) {
            return res.status(400).json({ msg : "Pas de données dans la requête" })
        }

        const { error } = userValidation(body).userLawUpdate
        
        if ( error ) {
            return res.status(401).json(error.details[0].message)
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, body, { new : true })

        if ( !updatedUser ) {
            res.status(404).json({ msg : "L'utilisateur n'existe pas" })
        }

        return res.status(200).json(updatedUser)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg : "Erreur serveur", error : error })
    }
}

const deleteOne = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if ( !user ) {
            return res.status(404).json({ msg : "Cet utilisateur n'existe pas" })
        }

        res.status(200).json({ msg : `L'utilisateur ${ user.prenom } ${ user.nom } à bien été supprimé` })
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }
}

export { register, login, getAll, getOne, updateUser, deleteOne }