import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import Permission from './permission.model'
import RolePermission from '../rolePermission/rolePermission.model'

/**
 * Response type for permission operations
 */
type TPermissionResponse = {
  _id: string
  key: string
  name: string
  description?: string
  group?: string
  module?: string
  isSystem: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * Creates a new permission
 * @param payload - Permission creation data (key, name, description, group, module)
 * @returns Promise<TPermissionResponse> - Created permission data
 */
const createPermission = async (payload: {
  key: string
  name: string
  description?: string
  group?: string
  module?: string
}): Promise<TPermissionResponse> => {
  const { key, name, description, group, module } = payload

  const existingPermission = await Permission.findOne({ key })
  if (existingPermission) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Permission with this key already exists',
    )
  }

  const permission = await Permission.create({
    key,
    name,
    description,
    group,
    module,
    isSystem: false,
  })

  return {
    _id: permission._id.toString(),
    key: permission.key,
    name: permission.name,
    description: permission.description,
    group: permission.group,
    module: permission.module,
    isSystem: permission.isSystem,
    createdAt: permission.createdAt,
    updatedAt: permission.updatedAt,
  }
}

/**
 * Retrieves all permissions sorted by module, group, and key
 * @returns Promise<TPermissionResponse[]> - Array of all permissions
 */
const getAllPermissions = async (): Promise<TPermissionResponse[]> => {
  const permissions = await Permission.find().sort({
    module: 1,
    group: 1,
    key: 1,
  })

  return permissions.map(permission => ({
    _id: permission._id.toString(),
    key: permission.key,
    name: permission.name,
    description: permission.description,
    group: permission.group,
    module: permission.module,
    isSystem: permission.isSystem,
    createdAt: permission.createdAt,
    updatedAt: permission.updatedAt,
  }))
}

/**
 * Retrieves a permission by ID
 * @param id - Permission ID
 * @returns Promise<TPermissionResponse> - Permission data
 */
const getPermissionById = async (id: string): Promise<TPermissionResponse> => {
  const permission = await Permission.findById(id)

  if (!permission) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Permission not found')
  }

  return {
    _id: permission._id.toString(),
    key: permission.key,
    name: permission.name,
    description: permission.description,
    group: permission.group,
    module: permission.module,
    isSystem: permission.isSystem,
    createdAt: permission.createdAt,
    updatedAt: permission.updatedAt,
  }
}

/**
 * Updates a permission by ID
 * @param id - Permission ID to update
 * @param payload - Partial permission data to update
 * @returns Promise<TPermissionResponse> - Updated permission data
 */
const updatePermission = async (
  id: string,
  payload: Partial<{
    key: string
    name: string
    description: string
    group: string
    module: string
  }>,
): Promise<TPermissionResponse> => {
  const permission = await Permission.findById(id)
  if (!permission) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Permission not found')
  }

  if (payload.key && payload.key !== permission.key) {
    const existingPermission = await Permission.findOne({ key: payload.key })
    if (existingPermission) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Permission with this key already exists',
      )
    }
  }

  const updatedPermission = await Permission.findByIdAndUpdate(id, payload, {
    new: true,
  })

  return {
    _id: updatedPermission!._id.toString(),
    key: updatedPermission!.key,
    name: updatedPermission!.name,
    description: updatedPermission!.description,
    group: updatedPermission!.group,
    module: updatedPermission!.module,
    isSystem: updatedPermission!.isSystem,
    createdAt: updatedPermission!.createdAt,
    updatedAt: updatedPermission!.updatedAt,
  }
}

/**
 * Deletes a permission by ID
 * @param id - Permission ID to delete
 * @throws Error if permission is assigned to one or more roles
 */
const deletePermission = async (id: string): Promise<void> => {
  const permission = await Permission.findById(id)
  if (!permission) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Permission not found')
  }

  const rolePermissionCount = await RolePermission.countDocuments({
    permission: id,
  })
  if (rolePermissionCount > 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Cannot delete permission. It is assigned to one or more roles',
    )
  }

  await Permission.findByIdAndDelete(id)
}

export const PermissionService = {
  createPermission,
  getAllPermissions,
  getPermissionById,
  updatePermission,
  deletePermission,
}
