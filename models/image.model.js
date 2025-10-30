import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    alt: {
      type: String
    },
    nom: {
      type: String,
      required: true
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    }

}, { timestamps: true });

export default mongoose.model('Image', imageSchema);
