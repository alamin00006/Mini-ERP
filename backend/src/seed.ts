import mongoose from 'mongoose'
import dotenv from 'dotenv'
import config from './config'

import User from './app/modules/user/user.model'
import Role from './app/modules/role/role.model'
import Permission from './app/modules/permission/permission.model'
import UserRole from './app/modules/userRole/userRole.model'
import RolePermission from './app/modules/rolePermission/rolePermission.model'
import { hashPassword } from './helpers/passwordHelpers'
import Category from './app/modules/category/category.model'

dotenv.config()

const defaultPermissions = [
  // Auth permissions
  {
    key: 'auth.login',
    name: 'Login',
    description: 'User login',
    group: 'Auth',
    module: 'Auth',
  },

  // User permissions
  {
    key: 'user.create',
    name: 'Create User',
    description: 'Create new user',
    group: 'User',
    module: 'User',
  },
  {
    key: 'user.read',
    name: 'Read User',
    description: 'View users',
    group: 'User',
    module: 'User',
  },
  {
    key: 'user.update',
    name: 'Update User',
    description: 'Update user',
    group: 'User',
    module: 'User',
  },
  {
    key: 'user.delete',
    name: 'Delete User',
    description: 'Delete/Deactivate user',
    group: 'User',
    module: 'User',
  },

  // Role permissions
  {
    key: 'role.create',
    name: 'Create Role',
    description: 'Create new role',
    group: 'Role',
    module: 'Role',
  },
  {
    key: 'role.read',
    name: 'Read Role',
    description: 'View roles',
    group: 'Role',
    module: 'Role',
  },
  {
    key: 'role.update',
    name: 'Update Role',
    description: 'Update role',
    group: 'Role',
    module: 'Role',
  },
  {
    key: 'role.delete',
    name: 'Delete Role',
    description: 'Delete/Deactivate role',
    group: 'Role',
    module: 'Role',
  },

  // Permission permissions
  {
    key: 'permission.create',
    name: 'Create Permission',
    description: 'Create new permission',
    group: 'Permission',
    module: 'Permission',
  },
  {
    key: 'permission.read',
    name: 'Read Permission',
    description: 'View permissions',
    group: 'Permission',
    module: 'Permission',
  },
  {
    key: 'permission.update',
    name: 'Update Permission',
    description: 'Update permission',
    group: 'Permission',
    module: 'Permission',
  },
  {
    key: 'permission.delete',
    name: 'Delete Permission',
    description: 'Delete permission',
    group: 'Permission',
    module: 'Permission',
  },

  // Product permissions
  {
    key: 'product.create',
    name: 'Create Product',
    description: 'Create new product',
    group: 'Product',
    module: 'Product',
  },
  {
    key: 'product.read',
    name: 'Read Product',
    description: 'View products',
    group: 'Product',
    module: 'Product',
  },
  {
    key: 'product.update',
    name: 'Update Product',
    description: 'Update product',
    group: 'Product',
    module: 'Product',
  },
  {
    key: 'product.delete',
    name: 'Delete Product',
    description: 'Delete product',
    group: 'Product',
    module: 'Product',
  },

  // Sale permissions
  {
    key: 'sale.create',
    name: 'Create Sale',
    description: 'Create new sale',
    group: 'Sale',
    module: 'Sale',
  },
  {
    key: 'sale.read',
    name: 'Read Sale',
    description: 'View sales',
    group: 'Sale',
    module: 'Sale',
  },

  // Dashboard permissions
  {
    key: 'dashboard.read',
    name: 'Read Dashboard',
    description: 'View dashboard',
    group: 'Dashboard',
    module: 'Dashboard',
  },
]

const defaultRoles = [
  {
    name: 'Admin',
    description: 'Administrator with full access',
    permissions: defaultPermissions.map(p => p.key),
  },
  {
    name: 'Manager',
    description: 'Manager with limited access',
    permissions: [
      'product.create',
      'product.read',
      'product.update',
      'sale.create',
      'sale.read',
      'dashboard.read',
      'user.read',
    ],
  },
  {
    name: 'Employee',
    description: 'Employee with basic access',
    permissions: ['product.read', 'sale.create', 'dashboard.read'],
  },
]

const defaultCategories = [
  { name: 'Electronics', description: 'Electronic devices and gadgets' },
  { name: 'Clothing', description: 'Clothing and apparel' },
  { name: 'Food & Beverages', description: 'Food and beverage items' },
  { name: 'Home & Garden', description: 'Home and garden products' },
]

const seedDB = async (): Promise<void> => {
  try {
    const mongoUri = config.database_url
    if (!mongoUri) throw new Error('MONGO_URI not defined')

    await mongoose.connect(mongoUri)
    console.log('MongoDB Connected for seeding')

    // Clear old data
    await User.deleteMany({})
    await Role.deleteMany({})
    await Permission.deleteMany({})
    await UserRole.deleteMany({})
    await RolePermission.deleteMany({})
    await Category.deleteMany({})
    console.log('Cleared existing data')

    // Create permissions
    const createdPermissions = await Permission.insertMany(defaultPermissions)
    console.log(`Seeded ${createdPermissions.length} permissions`)

    // Create permission map
    const permissionMap = new Map(createdPermissions.map(p => [p.key, p._id]))

    // Create roles
    for (const roleData of defaultRoles) {
      const { permissions, ...roleInfo } = roleData
      const role = await Role.create(roleInfo)

      // Assign permissions to role
      const rolePermissions = permissions
        .filter((key): key is string => permissionMap.has(key))
        .map(permissionKey => ({
          role: role._id,
          permission: permissionMap.get(permissionKey),
          allowed: true,
        }))

      await RolePermission.insertMany(rolePermissions)
      console.log(
        `Created role: ${role.name} with ${rolePermissions.length} permissions`,
      )
    }

    // Create default admin user
    const adminRole = await Role.findOne({ name: 'Admin' })
    if (adminRole) {
      const hashedPassword = await hashPassword('admin123')
      const adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        isActive: true,
      })

      await UserRole.create({
        user: adminUser._id,
        role: adminRole._id,
      })

      console.log('Created default admin user: admin@example.com / admin123')
    }

    // Create default categories
    await Category.insertMany(defaultCategories)
    console.log(`Seeded ${defaultCategories.length} categories`)

    await mongoose.connection.close()
    console.log('Database connection closed')
    process.exit(0)
  } catch (error: any) {
    console.error('Seeding error:', error.message)
    process.exit(1)
  }
}

seedDB()
