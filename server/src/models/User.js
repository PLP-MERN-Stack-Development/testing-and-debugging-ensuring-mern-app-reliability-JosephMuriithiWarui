const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret._id = ret._id.toString();
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
