const { check } = require('express-validator');
module.exports = [
    check('email')
    .exists().withMessage('Vui lòng không để trống Email')
    .notEmpty().withMessage('Vui lòng không để trống Email')
    .isEmail().withMessage('Email tài khoản không hợp lệ'),
    check('phone')
    .exists().withMessage('Vui lòng không để trống Số điện thoại')
    .notEmpty().withMessage('Số điện thoại không được để trống')
    .isNumeric().withMessage('Số điện thoại của tài khoản không hợp lệ')
];