import User from '../models/Users.js';
import generateToken from '../utils/generateToken.js';
import generateRefreshToken from '../utils/generateRefreshToken.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const sendUserResponse = (user) => ({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    accessToken: generateToken(user._id),
    refreshToken: generateRefreshToken(user._id),
});

const buildTokens = (user) => ({
    accessToken: generateToken(user._id),
    refreshToken: generateRefreshToken(user._id),
});

// REGISTER
export const registerUser = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, phone, role } = req.body;

        if (!firstName || !lastName || !email || !password || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const user = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password,
            phone,
            role: role || 'manager',
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: sendUserResponse(user),
        });
    } catch (error) {
        next(error);
    }
};

// LOGIN
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.isActive === false) {
            return res.status(403).json({ message: 'User account is inactive' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        user.lastLoginAt = Date.now();
        await user.save({ validateBeforeSave: false });

        res.status(200).json(sendUserResponse(user));
    } catch (error) {
        next(error);
    }
};

// GET ME
export const me = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// REFRESH TOKEN
export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        res.status(200).json({
            user,
            ...buildTokens(user),
        });
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
};