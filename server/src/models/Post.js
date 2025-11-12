const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String },
  slug: { type: String }
}, { timestamps: true });

postSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret._id = ret._id.toString();
    if (ret.author && ret.author.toString) ret.author = ret.author.toString();
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Post', postSchema);
