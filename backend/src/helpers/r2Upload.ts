import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import config from '../config'

const r2Client = new S3Client({
  region: 'auto',
  endpoint: config.cloudflare_r2.endpoint,
  credentials: {
    accessKeyId: config.cloudflare_r2.access_key_id as string,
    secretAccessKey: config.cloudflare_r2.secret_access_key as string,
  },
})

export const uploadToR2 = async (
  file: Express.Multer.File,
  folder: string = 'products',
): Promise<string> => {
  try {
    const fileName = `${folder}/${Date.now()}-${file.originalname}`
    const bucketName = config.cloudflare_r2.bucket_name as string

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    })

    await r2Client.send(command)

    const publicUrl = config.cloudflare_r2.public_url as string
    return `${publicUrl}/${fileName}`
  } catch (error) {
    throw new Error(`Failed to upload file to R2: ${error}`)
  }
}

export const deleteFromR2 = async (fileUrl: string): Promise<void> => {
  try {
    const publicUrl = config.cloudflare_r2.public_url as string
    const fileName = fileUrl.replace(`${publicUrl}/`, '')

    const command = new DeleteObjectCommand({
      Bucket: config.cloudflare_r2.bucket_name as string,
      Key: fileName,
    })

    await r2Client.send(command)
  } catch (error) {
    throw new Error(`Failed to delete file from R2: ${error}`)
  }
}
