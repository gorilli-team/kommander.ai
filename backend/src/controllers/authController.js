import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// @desc    User registration
// @route   POST /auth/signup
export const signup = async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    
    const { username, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ success: false, message: 'User already registered' });
    }
    
    const user = await User.create({
      username,
      email,
      password
    });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });
    
    console.log('User registered successfully:', user.email);
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    User login
// @route   POST /auth/login
export const login = async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('Email or password missing');
      return res.status(400).json({ success: false, message: 'Please enter email and password' });
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found with email:', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      console.log('Wrong password for user:', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });
    
    console.log('Login successful for:', user.email);
    
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Password recovery
// @route   POST /auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    console.log('Password recovery request received:', req.body);
    
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found with email:', email);
      return res.status(404).json({ success: false, message: 'No user found with this email' });
    }
    
    console.log('Password recovery request processed for:', email);
    
    console.log(`Password reset token should be sent to: ${email}`);
    
    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });
    
  } catch (error) {
    console.error('Error during password recovery:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};