import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema(
    {
        nom : {
            type : String,
            default : false
        },
        prenom : {
            type : String,
            default : false
          },
        email : {
            type : String,
            required : true
        },
        password : {
            type : String,
            required : true
        }
    },
    {
        timestamps : true
    }
)

userSchema.pre("save", async function() {
    if ( this.isModified("password") ) {
        this.password = await bcrypt.hash(this.password, 10)
    }
})

userSchema.pre("findOneAndUpdate", async function () {
  let update = this.getUpdate();

  // Si l'utilisateur met à jour le password
  if (update.password) {
    const hashed = await bcrypt.hash(update.password, 10);

    // On met à jour avec le password hashé
    this.setUpdate({
      ...update,
      password: hashed
    });
  }
})

const User = mongoose.model('User', userSchema)

export default User