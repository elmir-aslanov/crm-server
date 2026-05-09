import User from '../models/Users.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import generateRefreshToken from '../utils/generateRefreshToken.js';

const signAccessToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    });

// REGISTER
export const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, phone, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, 'User already exists');
    }

    const user = await User.create({ firstName, lastName, email, password, phone, role });

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            accessToken: signAccessToken(user._id),
            refreshToken: generateRefreshToken(user._id),
        },
    });
});

// LOGIN
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, 'Email and password are required');
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new ApiError(401, 'Invalid credentials');
    }

    if (!user.isActive) {
        throw new ApiError(403, 'Account is deactivated');
    }

    await User.updateOne({ _id: user._id }, { lastLoginAt: new Date() });

    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            accessToken: signAccessToken(user._id),
            refreshToken: generateRefreshToken(user._id),
        },
    });
});

// GET CURRENT USER
export const getMe = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        data: req.user,
    });
});

// REFRESH TOKEN
export const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken: token } = req.body;

    if (!token) {
        throw new ApiError(400, 'Refresh token is required');
    }

    let decoded;
    try {
        decoded = jwt.verify(
            token,
            process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
        );
    } catch {
        throw new ApiError(401, 'Invalid or expired refresh token');
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
        throw new ApiError(401, 'User not found or deactivated');
    }

    res.status(200).json({
        success: true,
        data: {
            accessToken: signAccessToken(user._id),
            refreshToken: generateRefreshToken(user._id),
        },
    });
});
