import Joi from 'joi'
import express from 'express'
import User from '../models/user.js'
import { signUp } from '../validation/user.js'

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
    await newUser.save()
    res.json({ userId: newUser.id, username })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

export default userRouter
