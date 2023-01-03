const { check } = require('express-validator');
module.exports = [
    check('email')
    .exists().withMessage('Vui lòng không để trống email')
    .notEmpty().withMessage('Vui lòng không để trống email')
    .isEmail().withMessage('Email đăng kí không hợp lệ'),
    check('phone')
    .exists().withMessage('Vui lòng không được để trống số điện thoại')
    .notEmpty().withMessage('Vui lòng không được để trống số điện thoại')
    .isNumeric().withMessage('Số điện thoại đăng kí không hợp lệ'),
    check('fullname')
    .exists().withMessage('Vui lòng không để trống Họ tên')
    .notEmpty().withMessage('Vui lòng không để trống Họ tên')
    .isLength({ min: 5 }).withMessage('Yêu cầu họ và tên có ít nhất 6 kí tự'),
    check('birthday')
    .exists().withMessage('Vui lòng không để trống ngày sinh')
    .notEmpty().withMessage('Vui lòng không để trống ngày sinh'),
    check('address')
    .exists().withMessage('Vui lòng không để trống địa chỉ')
    .notEmpty().withMessage('Vui lòng không để trống địa chỉ')
    .isLength({ min: 6 }).withMessage('Yêu cầu địa chỉ có ít nhất 6 kí tự'),
];