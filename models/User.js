
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

const UserScheme = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 20,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email'
    },
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 8,
    select: false,    // we don't wanna share the password
  },
  lastName: {
    type: String,
    maxlength: 20,
    default: 'lastName',
    trim: true
  },
  location: {
    type: String,
    maxlength: 20,
    default: 'my city',
    trim: true
  },
})

UserScheme.pre('save', async function() {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserScheme.methods.createJWT = function() {
  return jwt.sign(
      {userId: this._id},
      process.env.JWT_SECRET,
      {expiresIn: process.env.JWT_LIFETIME}
    )
}

UserScheme.methods.comparePassword = async function(candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}

export default mongoose.model('User', UserScheme)