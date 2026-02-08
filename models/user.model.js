import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      default : false, // ou default: "" si tu veux le rendre optionnel
    },
    email: {
      type: String,
      required: true,
      unique: true, // ⚡ bon pour éviter les doublons
    },
    password: {
      type: String,
      required: true,
    },
    role:{
     type: String,
     enum:["user", "moderateur", "admin"],
     default: "user",
    } 
    
  },
  {
    timestamps: true,
  }
);

// Hash avant save
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Hash avant update
userSchema.pre("findOneAndUpdate", async function (next) {
  let update = this.getUpdate();

  // Vérifie si le password est dans $set
  if (update.password || (update.$set && update.$set.password)) {
    const newPassword = update.password || update.$set.password;
    const hashed = await bcrypt.hash(newPassword, 10);

    if (update.password) {
      update.password = hashed;
    } else {
      update.$set.password = hashed;
    }

    this.setUpdate(update);
  }

  next();
});

const User = mongoose.model("User", userSchema);

export default User;
