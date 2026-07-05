import mongoose from 'mongoose'
import dotenv from 'dotenv'
import config from './config'

import { Job } from './app/modules/job/job.model'
import { Location } from './app/modules/location/location.model'
import { UserRegistration } from './app/modules/clientRegistration/user.model'

dotenv.config()

/* ================================
    SAMPLE USERS (WITH PASSWORD)
================================ */

const sampleUsers = [
  {
    id: 'U-001',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    status: 'active',
  },
  {
    id: 'U-002',
    name: 'Client User',
    email: 'client@example.com',
    password: 'client123',
    role: 'client',
    status: 'active',
  },
  {
    id: 'U-003',
    name: 'HR Manager BD',
    email: 'hr@companybd.com',
    password: 'hr123456',
    role: 'client',
    status: 'active',
  },
]

/* ================================
    SAMPLE JOBS
================================ */

const sampleJobs = [
  {
    title: 'Brand Designer',
    company: 'Dropbox',
    location: 'San Francisco, USA',
    category: 'Design',
    type: 'Full Time',
    description: 'Join our design team to create stunning visual identities.',
    tags: ['Design', 'Business'],
  },
  {
    title: 'Interactive Developer',
    company: 'Terraform',
    location: 'Hamburg, Germany',
    category: 'Technology',
    isFeatured: true,
    type: 'Full Time',
    description: 'Build immersive web experiences using modern frameworks.',
    tags: ['Technology', 'Engineering'],
  },
  {
    title: 'Frontend Developer',
    company: 'Brain Station 23',
    location: 'Dhaka, Bangladesh',
    category: 'Technology',
    isFeatured: true,
    type: 'Full Time',
    description: 'Looking for a React & TypeScript developer.',
    tags: ['Technology', 'Engineering'],
  },
  {
    title: 'Digital Marketing Executive',
    company: 'Anwar Group',
    location: 'Chattogram, Bangladesh',
    category: 'Marketing',
    type: 'Full Time',
    description: 'Execute digital campaigns and SEO strategies.',
    tags: ['Marketing', 'Sales'],
  },
  {
    title: 'UI/UX Designer',
    company: 'Tiger IT',
    location: 'Sylhet, Bangladesh',
    category: 'Design',
    type: 'Full Time',
    description: 'Design user-centered web & mobile experiences.',
    tags: ['Design', 'Technology'],
  },
  {
    title: 'Sales Executive',
    company: 'PRAN-RFL Group',
    location: 'Khulna, Bangladesh',
    category: 'Sales',
    type: 'Full Time',
    description: 'Build customer relationships and grow revenue.',
    tags: ['Sales', 'Business'],
  },
  {
    title: 'HR Officer',
    company: 'ACI Limited',
    location: 'Rajshahi, Bangladesh',
    category: 'Human Resource',
    type: 'Full Time',
    description: 'Manage recruitment and employee relations.',
    tags: ['Human Resource', 'Business'],
  },
]

/* ================================
    SEED FUNCTION
================================ */

const seedDB = async (): Promise<void> => {
  try {
    const mongoUri = config.database_url
    if (!mongoUri) throw new Error('MONGO_URI not defined')

    await mongoose.connect(mongoUri)
    console.log('MongoDB Connected for seeding')

    // 🧹 Clear old data
    await UserRegistration.deleteMany({})
    await Job.deleteMany({})
    await Location.deleteMany({})
    console.log('Cleared Users, Jobs & Locations')

    /* ======================
        Insert Users (SAFE WAY)
    ====================== */

    for (const user of sampleUsers) {
      await UserRegistration.create(user)
    }

    console.log(`Seeded ${sampleUsers.length} users`)

    /* ======================
        Insert Locations + Jobs
    ====================== */

    const createdJobs = []

    for (const job of sampleJobs) {
      const [city, country] = job.location.split(',').map(str => str.trim())

      let existingLocation = await Location.findOne({ city, country })

      if (!existingLocation) {
        existingLocation = await Location.create({ city, country })
      }

      const newJob = await Job.create({
        ...job,
        location: existingLocation._id,
      })

      createdJobs.push(newJob)
    }

    console.log(`Seeded ${createdJobs.length} jobs`)

    await mongoose.connection.close()
    console.log('Database connection closed')
    process.exit(0)
  } catch (error: any) {
    console.error('Seeding error:', error.message)
    process.exit(1)
  }
}

seedDB()
