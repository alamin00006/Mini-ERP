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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = __importDefault(require("./config"));
const user_model_1 = __importDefault(require("./app/modules/user/user.model"));
const role_model_1 = __importDefault(require("./app/modules/role/role.model"));
const permission_model_1 = __importDefault(require("./app/modules/permission/permission.model"));
const userRole_model_1 = __importDefault(require("./app/modules/userRole/userRole.model"));
const rolePermission_model_1 = __importDefault(require("./app/modules/rolePermission/rolePermission.model"));
const passwordHelpers_1 = require("./helpers/passwordHelpers");
const category_model_1 = __importDefault(require("./app/modules/category/category.model"));
dotenv_1.default.config();
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
];
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
];
const defaultCategories = [
    { name: 'Electronics', description: 'Electronic devices and gadgets' },
    { name: 'Clothing', description: 'Clothing and apparel' },
    { name: 'Food & Beverages', description: 'Food and beverage items' },
    { name: 'Home & Garden', description: 'Home and garden products' },
];
const seedDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongoUri = config_1.default.database_url;
        if (!mongoUri)
            throw new Error('MONGO_URI not defined');
        yield mongoose_1.default.connect(mongoUri);
        console.log('MongoDB Connected for seeding');
        // Clear old data
        yield user_model_1.default.deleteMany({});
        yield role_model_1.default.deleteMany({});
        yield permission_model_1.default.deleteMany({});
        yield userRole_model_1.default.deleteMany({});
        yield rolePermission_model_1.default.deleteMany({});
        yield category_model_1.default.deleteMany({});
        console.log('Cleared existing data');
        // Create permissions
        const createdPermissions = yield permission_model_1.default.insertMany(defaultPermissions);
        console.log(`Seeded ${createdPermissions.length} permissions`);
        // Create permission map
        const permissionMap = new Map(createdPermissions.map(p => [p.key, p._id]));
        // Create roles
        for (const roleData of defaultRoles) {
            const { permissions } = roleData, roleInfo = __rest(roleData, ["permissions"]);
            const role = yield role_model_1.default.create(roleInfo);
            // Assign permissions to role
            const rolePermissions = permissions
                .filter((key) => permissionMap.has(key))
                .map(permissionKey => ({
                role: role._id,
                permission: permissionMap.get(permissionKey),
                allowed: true,
            }));
            yield rolePermission_model_1.default.insertMany(rolePermissions);
            console.log(`Created role: ${role.name} with ${rolePermissions.length} permissions`);
        }
        // Create default admin user
        const adminRole = yield role_model_1.default.findOne({ name: 'Admin' });
        if (adminRole) {
            const hashedPassword = yield (0, passwordHelpers_1.hashPassword)('admin123');
            const adminUser = yield user_model_1.default.create({
                name: 'Admin User',
                email: 'admin@example.com',
                password: hashedPassword,
                isActive: true,
            });
            yield userRole_model_1.default.create({
                user: adminUser._id,
                role: adminRole._id,
            });
            console.log('Created default admin user: admin@example.com / admin123');
        }
        // Create default categories
        yield category_model_1.default.insertMany(defaultCategories);
        console.log(`Seeded ${defaultCategories.length} categories`);
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
