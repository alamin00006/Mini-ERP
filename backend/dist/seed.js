"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = __importDefault(require("./config"));
const job_model_1 = require("./app/modules/job/job.model");
const location_model_1 = require("./app/modules/location/location.model");
const user_model_1 = require("./app/modules/clientRegistration/user.model");
dotenv_1.default.config();
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
];
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
];
/* ================================
    SEED FUNCTION
================================ */
const seedDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongoUri = config_1.default.database_url;
        if (!mongoUri)
            throw new Error('MONGO_URI not defined');
        yield mongoose_1.default.connect(mongoUri);
        console.log('MongoDB Connected for seeding');
        // 🧹 Clear old data
        yield user_model_1.UserRegistration.deleteMany({});
        yield job_model_1.Job.deleteMany({});
        yield location_model_1.Location.deleteMany({});
        console.log('Cleared Users, Jobs & Locations');
        /* ======================
            Insert Users (SAFE WAY)
        ====================== */
        for (const user of sampleUsers) {
            yield user_model_1.UserRegistration.create(user);
        }
        console.log(`Seeded ${sampleUsers.length} users`);
        /* ======================
            Insert Locations + Jobs
        ====================== */
        const createdJobs = [];
        for (const job of sampleJobs) {
            const [city, country] = job.location.split(',').map(str => str.trim());
            let existingLocation = yield location_model_1.Location.findOne({ city, country });
            if (!existingLocation) {
                existingLocation = yield location_model_1.Location.create({ city, country });
            }
            const newJob = yield job_model_1.Job.create(Object.assign(Object.assign({}, job), { location: existingLocation._id }));
            createdJobs.push(newJob);
        }
        console.log(`Seeded ${createdJobs.length} jobs`);
        yield mongoose_1.default.connection.close();
        console.log('Database connection closed');
        process.exit(0);
    }
    catch (error) {
        console.error('Seeding error:', error.message);
        process.exit(1);
    }
});
seedDB();
