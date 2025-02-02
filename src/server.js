import express from 'express'
import mongoose from 'mongoose'
import { userRoutes } from './routes/index.js'
import { PORT, NODE_ENV, MONGO_URI, SESS_NAME, SESS_SECRET, SESS_LIFETIME } from './config.js'
;(async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true })
    console.log('MongoDB connected')
    const app = express()
    app.disable('x-powered-by')
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    const apiRouter = express.Router()
    app.use('/api', apiRouter)
    apiRouter.use('/users', userRoutes)
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
  } catch (err) {
    console.log(err)
  }
})()
