import Joi from 'joi';

export const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  role: Joi.string().valid('admin', 'manager', 'user').required(),
  isActive: Joi.boolean().optional(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).max(128).optional(),
  role: Joi.string().valid('admin', 'manager', 'user').optional(),
  isActive: Joi.boolean().optional(),
}).min(1);
