import express from 'express'
import { User } from '../models/user.js'
const router = express.Router()

router.post('/signin', async (req, res) => {
  try {
    const { userName, password } = req.body
    const user = await User.findOne({ username: userName })

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    const isValidPassword = await user.comparePassword(password)
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    req.session.userId = user._id

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/signout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Could not sign out' })
    }
    res.clearCookie(process.env.SESS_NAME)
    res.json({ message: 'Signed out successfully' })
  })
})

router.get('/check', async (req, res) => {
  try {
    if (req.session.userId) {
      const user = await User.findById(req.session.userId)
      if (user) {
        res.json({
          authenticated: true,
          user: {
            id: user._id,
            username: user.username,
            email: user.email
          }
        })
      } else {
        res.json({ authenticated: false })
      }
    } else {
      res.json({ authenticated: false })
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
