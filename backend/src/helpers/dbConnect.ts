import mongoose from 'mongoose'
import config from '../config'

mongoose.set('strictQuery', false)

// MongoDB connection options
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000,
  autoIndex: true,
  maxPoolSize: 10,
  socketTimeoutMS: 45000,
  family: 4,
}

export const databaseConnect = async (server: any) => {
  try {
    await mongoose.connect(config.database_url as string, mongooseOptions)
    console.log('🛢 Database connected successfully')

    server.listen(config.port || 8000, () => {
      console.log(`Application listening on port ${config.port || 8000}`)
    })
  } catch (err) {
    console.error('Failed to connect to database', err)
    process.exit(1)
  }
}
