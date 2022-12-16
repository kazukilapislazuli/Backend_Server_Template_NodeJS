const asyncHandler = require('../../middleware/async');
const User = require('../user/model');
const {errorResponse, successResponse} = require("../../util/response");

exports.register = asyncHandler(async (req, res, next)=>{
    const {name, email, password, username} = req.body;
    const user = await User.create({name, email, password, username});
    sendTokenResponse(user, 200, res);
});

exports.login = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;

    // Validate email & password
    if (!email || !password) {
        return res.status(400).json(errorResponse("Please provide an email and password"));
    }

    // Check for user
    const user = await User.findOne({email}).select('+password');

    if (!user) {
        return res.status(401).json(errorResponse("Invalid credentials"));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return res.status(401).json(errorResponse("Invalid credentials"));
    }
    sendTokenResponse(user, 200, res);
});

exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        data: {},
    });
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return res.status(401).json(errorResponse("Password is incorrect"));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true
    };
    res.status(statusCode).cookie('token', token, options).json(successResponse({token}, 1, 1));
};
