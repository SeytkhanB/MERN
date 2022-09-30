
import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import {BadRequestError, UnauthenticatedError} from '../errors/index.js'

const register = async (req, res) => {
  const {name, email, password} = req.body

  if (!name || !email || !password) {
    throw new BadRequestError('Please provide all values')
  }

  const userAlreadyExists = await User.findOne({email})
  if (userAlreadyExists) {
    throw new BadRequestError('Email already in use')
  }

  const user = await User.create({name, email, password})
  // catch token and send it with user.
  // JSON Web Token is most commonly used to identify an authenticated user!
  const token = user.createJWT()
  res
    .status(StatusCodes.CREATED)
    .json({
      user: {
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        location: user.location,
      },
      token,
      location: user.location,
  })
}


const login = async (req, res) => {
  const {email, password} = req.body
  if (!email || !password) {
    throw new BadRequestError('Please provide all values')
  }

  // in order to avoid error we should select ↓ password, because we need this password to check out
  const user = await User.findOne({email}).select('+password')
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
  }

  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }

  const token = user.createJWT()

  user.password = undefined   // <-- in order to remove password from response

  res
    .status(StatusCodes.OK)
    .json({
      user,
      token,
      location: user.location
    })
}


const updateUser = async (req, res) => {
  res.send('update user')
}

export {register, login, updateUser}