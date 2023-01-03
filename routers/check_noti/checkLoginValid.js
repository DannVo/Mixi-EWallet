const { check } = require('express-validator');
module.exports = [
    check('username')
    .exists().withMessage('Vui lòng không để trống username')
    .notEmpty().withMessage('Vui lòng không để trống username'),
    check('password')
    .exists().withMessage('Không được để trống password')
    .notEmpty().withMessage('Không được để trống password')
    .isLength({ min: 6 }).withMessage('Vui lòng nhập password gồm 6 kí tự trở lên'),
];