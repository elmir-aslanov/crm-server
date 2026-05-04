import User from '../models/Users.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// 🔐 TOKEN CREATE
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

// ✅ REGISTER
export const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, phone, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, 'User already exists');
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        phone,
        role,
    });

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            accessToken: generateToken(user._id),
        },
    });
});

// ✅ LOGIN
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        throw new ApiError(401, 'Invalid credentials');
    }

    // 🔥 BURDA FIX
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new ApiError(401, 'Invalid credentials');
    }

    user.lastLoginAt = new Date();
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            accessToken: generateToken(user._id),
        },
    });
});