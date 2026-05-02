import User from '../models/Users.js';
import ApiError from '../utils/ApiError.js';
import pick from '../utils/pick.js';

export const createUserService = async (payload) => {
  const exists = await User.findOne({ email: payload.email.toLowerCase() });
  if (exists) {
    throw new ApiError(409, 'User already exists');
  }

  const user = await User.create({
    name: payload.name,
    email: payload.email.toLowerCase(),
    password: payload.password,
    role: payload.role || 'user', // 🔥 BURDA FIX
  });

  return user;
};
export const getUsersService = async (query) => {
  const page = Number.parseInt(query.page, 10) || 1;
  const limit = Number.parseInt(query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const filter = pick(query, ['role', 'isActive']);
  if (filter.isActive !== undefined) {
    filter.isActive = filter.isActive === 'true';
  }

  const [items, total] = await Promise.all([
    User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getUserByIdService = async (id) => {
  const user = await User.findById(id).select('-password');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

export const updateUserService = async (id, payload) => {
  const user = await User.findById(id).select('+password');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (payload.email && payload.email !== user.email) {
    const exists = await User.findOne({ email: payload.email.toLowerCase() });
    if (exists) {
      throw new ApiError(409, 'Email is already in use');
    }
  }

  Object.assign(user, payload);
  if (payload.email) {
    user.email = payload.email.toLowerCase();
  }

  await user.save();
  return User.findById(id).select('-password');
};

export const softDeleteUserService = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.isActive = false;
  await user.save();
};
