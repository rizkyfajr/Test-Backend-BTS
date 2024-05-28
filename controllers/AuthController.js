require('dotenv').config({ path: require('find-config')('.env') })
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.users

exports.register = async (req, res) => {
    const { email, username, password } = req.body

    if (!email || !username || !password) {
        return res.status(400).json({
        status: 400,
        message: 'Please insert all required fields.',
        })
    }

    const isUniqueUsername = await User.findOne({ where: { username: username } })
    if (isUniqueUsername) {
        return res.status(400).json({
        status: 400,
        message: 'Username already registered.',
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create(
        {
        email : email,
        username : username,
        password : hashedPassword
        }
    ).then((user) => {
        res.status(201).json({
        status: 201,
        message: 'Registration success, please login.',
        })
    }).catch((err) => {
        res.status(500).json({
        status: 500,
        message: 'Ooppss... Server Error.',
        error: err.errors[0].message
        });
    });
}

exports.login = async (req, res) => {
        try {
        const { username, password } = req.body;
    
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }
    
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: 'Invalid username or password.' }); 
        }
    
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }
    
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
    
        res.status(200).json({
            message: 'Login successful.',
            token,
        });
        } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};