import express from 'express'
import multer from 'multer'
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3Client } from '../utils/s3.js'

const router = express.Router()
const upload = multer()

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const fileKey = `${Date.now()}-${req.file.originalname}`

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    })

    await s3Client.send(command)

    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey
    })

    const fileUrl = await getSignedUrl(s3Client, getObjectCommand, { expiresIn: 3600 })

    res.status(200).json({
      message: 'File uploaded successfully',
      fileUrl,
      key: fileKey
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ message: 'Error uploading file' })
  }
})

export default router
