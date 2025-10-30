import User from '../models/user.model.js'
import userValidation from '../validation/user.validation.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

 const register = async (req, res) => {
  try {
    const { nom, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email déjà utilisé" });

    const user = new User({ nom, email, password, role });
    await user.save();

    res.status(201).json({ message: `Utilisateur ${role} créé`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation Joi
    const { error } = userValidation(req.body).userLawLogin
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }

    // Chercher l'utilisateur
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Identifiants invalides" })
    }

    // Vérifier mot de passe
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Identifiants invalides" })
    }

    // ✅ Générer un token avec la même clé que dans auth.js
    const token = jwt.sign(
      { id: user._id, nom: user.nom, email: user.email, role: user.role },
      process.env.SECRET_KEY,          // ⚠️ même nom que dans auth.js
      { expiresIn: "1h" }              // durée d’expiration
    )

    res.status(200).json({
      user: { id: user._id, nom: user.nom, email: user.email, role: user.role },
      token
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erreur serveur" })
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
const reNewPassword = async (req, res) => {
  try {
     const { oldPassword, newPassword } = req.body
    console.log(req.body)
    const { error } = userValidation(req.body).userLawReNewPassword
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }

   

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Utilisateur non authentifié" })
    }

    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" })
    }

    // Vérifier l'ancien mot de passe
    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: "Ancien mot de passe incorrect" })
    }

    // Hasher et sauvegarder le nouveau mot de passe
    // const salt = await bcrypt.genSalt(10)
    // user.password = await bcrypt.hash(newPassword, 10)
    user.password = newPassword

    await user.save()

    res.json({ message: "✅ Mot de passe mis à jour avec succès" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Erreur serveur" })
  }
}


export { register, login, getAll, getOne, updateUser, deleteOne, reNewPassword }