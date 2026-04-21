import bcrypt from 'bcrypt';
import User from '../models/Users.js';
import generateToken from '../utils/generateToken.js';

// 🔹 Response helper
const sendUserResponse = (user) => ({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    token: generateToken(user._id),
    role: user.role
});

// 🔹 REGISTER
export const registerUser = async (req, res, next) => {
    try {
        let { firstName, lastName, email, password, phone } = req.body;

        if (!firstName || !lastName || !email || !password || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // 🔥 email normalize
        email = email.toLowerCase();

        // 🔥 password validation
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone
        });

        res.status(201).json(sendUserResponse(user));

    } catch (error) {
        next(error);
    }
};

// 🔹 LOGIN
export const loginUser = async (req, res, next) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // 🔥 email normalize
        email = email.toLowerCase();

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // 🔥 last login update (əgər modeldə varsa)
        user.lastLoginAt = Date.now();
        await user.save({ validateBeforeSave: false });

        res.status(200).json(sendUserResponse(user));

    } catch (error) {
        next(error);
    }
};

// 🔹 GET ME
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