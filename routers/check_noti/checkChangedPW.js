const { check } = require('express-validator');
module.exports = [
    
    check('confirm1')
    .exists().withMessage('Vui lòng nhập password mới')
    .notEmpty().withMessage('Không được để trống password mới')
    .isLength({ min: 6 }).withMessage('Yêu cầu password gồm 6 kí tự trỡ lên'),
    check('confirm1')
    .exists().withMessage('Yêu cầu password không được để trống')
    .notEmpty().withMessage('Yêu cầu password không được để trống')
    .isLength({ min: 6 }).withMessage('Vui lòng nhập password gồm 6 ký tự trở lên'),
];