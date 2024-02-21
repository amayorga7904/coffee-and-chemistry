const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const accountSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  born: {
    type: Date
  },
  bio: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userAvatar: String, 
}, {
  timestamps: true
});

module.exports = mongoose.model('Account', accountSchema);