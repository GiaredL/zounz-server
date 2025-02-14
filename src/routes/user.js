import Joi from 'joi'
import express from 'express'
import User from '../models/user.js'
import { signUp } from '../validation/user.js'
import { parseError, sessionizeUser } from '../util/helpers.js'
import { TokenHelper } from '../helpers/tokenHelper.js'

const userRouter = express.Router()

userRouter.post('', async (req, res) => {
  try {
    const { username, email, password } = req.body

    const { error } = signUp.validate({ username, email, password })
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    // Create user and hash password here
    const user = await User.create({ username, email, password })

    // Create a session
    req.session.userId = user.id

    // Set cookie options
    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    }

    res.status(201).json({ user: sessionizeUser(user) })
  } catch (err) {
    res.status(400).send(parseError(err))
  }
})

export default userRouter
