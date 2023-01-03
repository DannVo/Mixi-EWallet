const express = require('express')
const router = express.Router()
const multer = require("multer");
const CheckLogin = require("../auth/checkIsUser");
const FirstTime = require("../auth/checkFirstLogin");
const changePassValidator = require("../routers/check_noti/checkChangedPW");
const userController = require("../controller/UserController")

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/uploads");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    },
});
var upload = multer({ storage: storage });
var multipleUpload = upload.fields([
    { name: "idcard_front" },
    { name: "idcard_back" },
]);

router.get('/', CheckLogin, FirstTime, userController.index)
router.get('/addMoney', CheckLogin, FirstTime, userController.add_money_index)
router.post('/addMoney', CheckLogin, FirstTime, userController.add_money)
router.get('/withdrawMoney', CheckLogin, FirstTime, userController.withdraw_index)
router.post('/withdrawMoney', CheckLogin, FirstTime, userController.withdraw_money)

router.get('/transferMoney', CheckLogin, FirstTime, userController.transfer_money_index)
router.post('/transferMoney', CheckLogin, FirstTime, userController.transfer_money)

router.get('/buyCard', CheckLogin, FirstTime, userController.buycard_index)
router.post('/buyCard', CheckLogin, FirstTime, userController.buycard)
router.get('/buyCard_done', CheckLogin, FirstTime, userController.buycard_done_index)

router.get('/history', CheckLogin,userController.view_history)
router.get('/detailhistory/:id', CheckLogin,userController.view_detailHistory)

router.get('/changePassworduser', CheckLogin, FirstTime, userController.changePW_user_index)
router.post('/changePassworduser', changePassValidator, userController.changePW_user)
router.post('/updateprofile', multipleUpload, userController.update_profile)
router.get('/logout', userController.logout)

module.exports = router