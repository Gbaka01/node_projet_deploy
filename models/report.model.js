import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Article",
    required: true,
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  raisons: { 
    type: String, 
    required: true 
  }, // ✅ tableau de raisons
  description: { 
    type: String,
     default: "" 
    },  // ✅ nom harmonisé
status: {
  type: String,
  enum: [ "en_attente", "approuvé", "rejeté"],
  default: "en_attente",
},
 
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Report", reportSchema);

