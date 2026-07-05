import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import Role from './role.model'
import Permission from '../permission/permission.model'
import RolePermission from '../rolePermission/rolePermission.model'

type TRoleResponse = {
  _id: string
  name: string
  description?: string
  isSystem: boolean
  permissions: string[]
  createdAt: Date
  updatedAt: Date
}

const createRole = async (payload: {
  name: string
  description?: string
  permissions?: string[]
}): Promise<TRoleResponse> => {
  const { name, description, permissions = [] } = payload

  const existingRole = await Role.findOne({ name })
  if (existingRole) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Role with this name already exists',
    )
  }

  const role = await Role.create({
    name,
    description,
    isSystem: false,
  })

  if (permissions.length > 0) {
    const permissionDocs = await Permission.find({ key: { $in: permissions } })

    const rolePermissions = permissionDocs.map(permission => ({
      role: role._id,
      permission: permission._id,
      allowed: true,
    }))

    await RolePermission.insertMany(rolePermissions)
  }

  const populatedRole = await Role.findById(role._id).populate({
    path: 'rolePermissions',
    populate: {
      path: 'permission',
    },
  })

  const rolePermissions = (populatedRole as any).rolePermissions || []
  const permissionKeys = rolePermissions
    .filter((rp: any) => rp.permission && rp.allowed)
    .map((rp: any) => rp.permission.key)

  return {
    _id: role._id.toString(),
    name: role.name,
    description: role.description,
    isSystem: role.isSystem,
    permissions: permissionKeys,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  }
}

const getAllRoles = async (): Promise<TRoleResponse[]> => {
  const roles = await Role.find().populate({
    path: 'rolePermissions',
    populate: {
      path: 'permission',
    },
  })

  return roles.map(role => {
    const rolePermissions = (role as any).rolePermissions || []
    const permissionKeys = rolePermissions
      .filter((rp: any) => rp.permission && rp.allowed)
      .map((rp: any) => rp.permission.key)

    return {
      _id: role._id.toString(),
      name: role.name,
      description: role.description,
      isSystem: role.isSystem,
      permissions: permissionKeys,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    }
  })
}

const getRoleById = async (id: string): Promise<TRoleResponse> => {
  const role = await Role.findById(id).populate({
    path: 'rolePermissions',
    populate: {
      path: 'permission',
    },
  })

  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found')
  }

  const rolePermissions = (role as any).rolePermissions || []
  const permissionKeys = rolePermissions
    .filter((rp: any) => rp.permission && rp.allowed)
    .map((rp: any) => rp.permission.key)

  return {
    _id: role._id.toString(),
    name: role.name,
    description: role.description,
    isSystem: role.isSystem,
    permissions: permissionKeys,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  }
}

const updateRole = async (
  id: string,
  payload: Partial<{
    name: string
    description: string
    permissions: string[]
  }>,
): Promise<TRoleResponse> => {
  const role = await Role.findById(id)
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found')
  }

  if (payload.name && payload.name !== role.name) {
    const existingRole = await Role.findOne({ name: payload.name })
    if (existingRole) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Role with this name already exists',
      )
    }
  }

  const updatedRole = await Role.findByIdAndUpdate(id, payload, { new: true })

  if (payload.permissions) {
    await RolePermission.deleteMany({ role: id })

    const permissionDocs = await Permission.find({
      key: { $in: payload.permissions },
    })

    const rolePermissions = permissionDocs.map(permission => ({
      role: id,
      permission: permission._id,
      allowed: true,
    }))

    await RolePermission.insertMany(rolePermissions)
  }

  const populatedRole = await Role.findById(id).populate({
    path: 'rolePermissions',
    populate: {
      path: 'permission',
    },
  })

  const rolePermissions = (populatedRole as any).rolePermissions || []
  const permissionKeys = rolePermissions
    .filter((rp: any) => rp.permission && rp.allowed)
    .map((rp: any) => rp.permission.key)

  return {
    _id: updatedRole!._id.toString(),
    name: updatedRole!.name,
    description: updatedRole!.description,
    isSystem: updatedRole!.isSystem,
    permissions: permissionKeys,
    createdAt: updatedRole!.createdAt,
    updatedAt: updatedRole!.updatedAt,
  }
}

const deactivateRole = async (id: string): Promise<TRoleResponse> => {
  const role = await Role.findById(id)
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found')
  }

  if (role.isSystem) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot deactivate system role')
  }

  const deactivatedRole = await Role.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  )

  const populatedRole = await Role.findById(id).populate({
    path: 'rolePermissions',
    populate: {
      path: 'permission',
    },
  })

  const rolePermissions = (populatedRole as any).rolePermissions || []
  const permissionKeys = rolePermissions
    .filter((rp: any) => rp.permission && rp.allowed)
    .map((rp: any) => rp.permission.key)

  return {
    _id: deactivatedRole!._id.toString(),
    name: deactivatedRole!.name,
    description: deactivatedRole!.description,
    isSystem: deactivatedRole!.isSystem,
    permissions: permissionKeys,
    createdAt: deactivatedRole!.createdAt,
    updatedAt: deactivatedRole!.updatedAt,
  }
}

export const RoleService = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deactivateRole,
}
