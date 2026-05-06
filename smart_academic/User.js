const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    fullName: { type: String, default: '' },
    rollNo: { type: String, default: '' },
    department: { type: String, default: '' },
    cgpa: { type: String, default: '' },
    attendance: { type: String, default: '' },
    marks: { type: String, default: '' },
    activities: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
