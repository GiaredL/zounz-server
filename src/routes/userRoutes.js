import express from 'express'
import { User } from '../models/user.js'

const router = express.Router()

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    })

    if (existingUser) {
      return res.status(400).json({
        message: 'Username or email already exists'
      })
    }

    const user = new User({
      username,
      email,
      password
    })

    await user.save()

    req.session.userId = user._id

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'Error creating user' })
  }
})

router.get('/profile', async (req, res) => {
  try {
    const userId = req.session.userId
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        location: user.location,
        songs: user.songs
      }
    })
  } catch (err) {
    console.error('Error fetching user:', err)
    res.status(500).json({ message: 'Error fetching user' })
  }
})

export default router
