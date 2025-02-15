import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    profilePicture: {
      type: String,
      default: 'https://via.placeholder.com/150'
    },
    bio: {
      type: String,
      default: 'gotta update this'
    },
    streams: {
      type: Number,
      default: 0
    },
    city: {
      type: String,
      default: 'Springville'
    },
    state: {
      type: String,
      default: 'Utah'
    },
    country: {
      type: String,
      default: 'United States'
    },
    songs: [
      {
        title: {
          type: String,
          required: true
        },
        album: {
          type: String,
          required: true
        },
        streams: {
          type: Number,
          default: 0
        },
        audioUrl: {
          type: String,
          required: true
        },
        image: {
          type: String,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
)

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

export const User = mongoose.model('User', userSchema)
