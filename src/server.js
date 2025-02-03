import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose'
import { userRoutes, sessionRoutes } from './routes/index.js'
import { PORT, NODE_ENV, MONGO_URI, SESS_NAME, SESS_SECRET, SESS_LIFETIME } from './config.js'
;(async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('MongoDB connected')

    const app = express()

    app.disable('zounz-powered-by')
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())

    app.use(
      session({
        name: SESS_NAME,
        secret: SESS_SECRET,
        saveUninitialized: false,
        resave: false,
        store: MongoStore.create({
          mongoUrl: MONGO_URI,
          collectionName: 'sessions',
          ttl: parseInt(SESS_LIFETIME) / 1000
        }),
        cookie: {
          sameSite: true,
          secure: NODE_ENV === 'production',
          maxAge: parseInt(SESS_LIFETIME)
        }
      })
    )

    app.use('/api/users', userRoutes)
    app.use('/api/session', sessionRoutes)

    app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
