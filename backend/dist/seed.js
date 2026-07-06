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
const product_model_1 = __importDefault(require("./app/modules/product/product.model"));
const sale_model_1 = __importDefault(require("./app/modules/sale/sale.model"));
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
    // Category permissions
    {
        key: 'category.create',
        name: 'Create Category',
        description: 'Create new category',
        group: 'Category',
        module: 'Category',
    },
    {
        key: 'category.read',
        name: 'Read Category',
        description: 'View categories',
        group: 'Category',
        module: 'Category',
    },
    {
        key: 'category.update',
        name: 'Update Category',
        description: 'Update category',
        group: 'Category',
        module: 'Category',
    },
    {
        key: 'category.delete',
        name: 'Delete Category',
        description: 'Delete category',
        group: 'Category',
        module: 'Category',
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
            'category.create',
            'category.read',
            'category.update',
            'sale.create',
            'sale.read',
            'dashboard.read',
            'user.read',
        ],
    },
    {
        name: 'Employee',
        description: 'Employee with basic access',
        permissions: [
            'product.read',
            'category.read',
            'sale.create',
            'dashboard.read',
        ],
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
        // Seed permissions (idempotent)
        console.log('Seeding permissions...');
        for (const permissionData of defaultPermissions) {
            yield permission_model_1.default.findOneAndUpdate({ key: permissionData.key }, permissionData, { upsert: true, new: true });
        }
        console.log(`Seeded ${defaultPermissions.length} permissions`);
        // Get all permissions
        const createdPermissions = yield permission_model_1.default.find();
        const permissionMap = new Map(createdPermissions.map(p => [p.key, p._id]));
        // Seed roles (idempotent)
        console.log('Seeding roles...');
        for (const roleData of defaultRoles) {
            const { permissions } = roleData, roleInfo = __rest(roleData, ["permissions"]);
            const role = yield role_model_1.default.findOneAndUpdate({ name: roleInfo.name }, roleInfo, { upsert: true, new: true });
            // Clear existing permissions for this role
            yield rolePermission_model_1.default.deleteMany({ role: role._id });
            // Assign permissions to role
            const rolePermissions = permissions
                .filter((key) => permissionMap.has(key))
                .map(permissionKey => ({
                role: role._id,
                permission: permissionMap.get(permissionKey),
                allowed: true,
            }));
            yield rolePermission_model_1.default.insertMany(rolePermissions);
            console.log(`Created/Updated role: ${role.name} with ${rolePermissions.length} permissions`);
        }
        // Create default admin user (idempotent)
        const adminRole = yield role_model_1.default.findOne({ name: 'Admin' });
        if (adminRole) {
            const hashedPassword = yield (0, passwordHelpers_1.hashPassword)('admin123');
            const adminUser = yield user_model_1.default.findOneAndUpdate({ email: 'admin@example.com' }, {
                name: 'Admin User',
                email: 'admin@example.com',
                password: hashedPassword,
                isActive: true,
            }, { upsert: true, new: true });
            // Ensure admin user has Admin role
            yield userRole_model_1.default.findOneAndUpdate({ user: adminUser._id }, { user: adminUser._id, role: adminRole._id }, { upsert: true });
            console.log('Created/Updated admin user: admin@example.com / admin123');
        }
        // Seed categories (idempotent)
        console.log('Seeding categories...');
        for (const categoryData of defaultCategories) {
            yield category_model_1.default.findOneAndUpdate({ name: categoryData.name }, categoryData, { upsert: true, new: true });
        }
        console.log(`Seeded ${defaultCategories.length} categories`);
        // Seed products (idempotent)
        console.log('Seeding products...');
        const categories = yield category_model_1.default.find();
        const categoryMap = new Map(categories.map(c => [c.name, c._id]));
        const defaultProducts = [
            {
                name: 'Laptop',
                sku: 'LAP-001',
                category: categoryMap.get('Electronics'),
                purchasePrice: 50000,
                sellingPrice: 65000,
                stockQuantity: 10,
                image: 'https://example.com/laptop.jpg',
            },
            {
                name: 'Smartphone',
                sku: 'PHN-001',
                category: categoryMap.get('Electronics'),
                purchasePrice: 25000,
                sellingPrice: 32000,
                stockQuantity: 25,
                image: 'https://example.com/smartphone.jpg',
            },
            {
                name: 'T-Shirt',
                sku: 'TSH-001',
                category: categoryMap.get('Clothing'),
                purchasePrice: 500,
                sellingPrice: 800,
                stockQuantity: 100,
                image: 'https://example.com/tshirt.jpg',
            },
            {
                name: 'Jeans',
                sku: 'JNS-001',
                category: categoryMap.get('Clothing'),
                purchasePrice: 1200,
                sellingPrice: 1800,
                stockQuantity: 50,
                image: 'https://example.com/jeans.jpg',
            },
            {
                name: 'Rice 5kg',
                sku: 'RIC-001',
                category: categoryMap.get('Food & Beverages'),
                purchasePrice: 400,
                sellingPrice: 550,
                stockQuantity: 200,
                image: 'https://example.com/rice.jpg',
            },
            {
                name: 'Garden Shovel',
                sku: 'GDS-001',
                category: categoryMap.get('Home & Garden'),
                purchasePrice: 800,
                sellingPrice: 1200,
                stockQuantity: 30,
                image: 'https://example.com/shovel.jpg',
            },
        ];
        for (const productData of defaultProducts) {
            yield product_model_1.default.findOneAndUpdate({ sku: productData.sku }, productData, {
                upsert: true,
                new: true,
            });
        }
        console.log(`Seeded ${defaultProducts.length} products`);
        // Seed sales (idempotent)
        console.log('Seeding sales...');
        const products = yield product_model_1.default.find();
        const productMap = new Map(products.map(p => [p.sku, p._id]));
        const adminUser = yield user_model_1.default.findOne({ email: 'admin@example.com' });
        if (adminUser && products.length > 0) {
            const defaultSales = [
                {
                    products: [
                        {
                            product: productMap.get('LAP-001'),
                            quantity: 2,
                            sellingPrice: 65000,
                            subtotal: 130000,
                        },
                        {
                            product: productMap.get('PHN-001'),
                            quantity: 3,
                            sellingPrice: 32000,
                            subtotal: 96000,
                        },
                    ],
                    grandTotal: 226000,
                    createdBy: adminUser._id,
                },
                {
                    products: [
                        {
                            product: productMap.get('TSH-001'),
                            quantity: 10,
                            sellingPrice: 800,
                            subtotal: 8000,
                        },
                        {
                            product: productMap.get('RIC-001'),
                            quantity: 5,
                            sellingPrice: 550,
                            subtotal: 2750,
                        },
                    ],
                    grandTotal: 10750,
                    createdBy: adminUser._id,
                },
            ];
            for (const saleData of defaultSales) {
                yield sale_model_1.default.findOneAndUpdate({ createdBy: saleData.createdBy, grandTotal: saleData.grandTotal }, saleData, { upsert: true, new: true });
            }
            console.log(`Seeded ${defaultSales.length} sales`);
        }
        yield mongoose_1.default.connection.close();
        console.log('Database connection closed');
        console.log('✅ Seeding completed successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('Seeding error:', error.message);
        process.exit(1);
    }
});
seedDB();
