import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
    titre: {
      type: String,
      required: true
    },
    contenu: {
      type: String,
      required: true
    },
        author : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        }
}, { timestamps: true });

export default mongoose.model('Article', articleSchema);
