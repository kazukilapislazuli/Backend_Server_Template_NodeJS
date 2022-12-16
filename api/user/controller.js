const asyncHandler = require('../../middleware/async');
const User = require('./model');
const {successResponse} = require("../../util/response");

exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json(successResponse(user, 1, 1));
});
