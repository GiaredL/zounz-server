import Joi from 'joi'
import express from 'express'
import User from '../models/user.js'
import { signUp } from '../validation/user.js'
import { parseError, sessionizeUser } from '../util/helpers.js'

const userRouter = express.Router()
userRouter.post('', async (req, res) => {
  try {
    const { username, email, password } = req.body
    // Change this line:
    const { error } = signUp.validate({ username, email, password })
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const newUser = new User({ username, email, password })
    const sessionUser = sessionizeUser(newUser)
    await newUser.save()

    req.session.user = sessionUser
    res.send(sessionUser)
    console.log(req.session)
  } catch (err) {
    res.status(400).send(parseError(err))
  }
})

export default userRouter
