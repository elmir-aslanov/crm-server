import asyncHandler from '../utils/asyncHandler.js';
import {
  createUserService,
  getUserByIdService,
  getUsersService,
  softDeleteUserService,
  updateUserService,
} from '../services/userService.js';

export const createUser = asyncHandler(async (req, res) => {
  const user = await createUserService(req.body);
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

export const getUsers = asyncHandler(async (req, res) => {
  const data = await getUsersService(req.query);
  res.status(200).json({
    success: true,
    data,
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await getUserByIdService(req.params.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await updateUserService(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  await softDeleteUserService(req.params.id);
  res.status(200).json({
    success: true,
    message: 'User deactivated successfully',
  });
});
