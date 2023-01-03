//new
const express = require('express')
const router = express.Router()
const loginValidator = require('../routers/check_noti/checkLoginValid');
const registerValidator = require('../routers/check_noti/checkRegisValid');
const changePassValidator = require('../routers/check_noti/checkChangedPW');
const resetPassValidator = require('../routers/check_noti/checkResetPW');
const accountController = require('../controller/AccountController');

//upload in register
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {

        cb(null, 'public/uploads');

    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage });
var multipleUpload = upload.fields([{ name: 'idcard_front' }, { name: 'idcard_back' }]);

//login
router.get('/', loginValidator,accountController.login_index)
router.post('/', loginValidator,accountController.login)

//register
router.get('/register', registerValidator,accountController.regis_index)
router.post('/register', multipleUpload,registerValidator,accountController.regis)

//change password
router.get('/changePassword', accountController.changePW_index)
router.post('/changePassword', changePassValidator,accountController.changePassWord)

//reset password
router.get('/resetPassword', accountController.resetPW_index)
router.post('/resetPassword', resetPassValidator,accountController.resetPassWord)

module.exports = router