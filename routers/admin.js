const express = require('express')
const router = express.Router()
const CheckLogin = require('../auth/checkIsAdmin');
const changePassValidator = require('./check_noti/checkChangedPW');
const adminController = require('../controller/AdminController');


//login
router.get('/', CheckLogin,adminController.admin_index)
router.get('/waitActive', CheckLogin,adminController.waiting_list)
router.get('/detailuser/:id', CheckLogin,adminController.detail_waitinglist)
router.get('/activedAccount', CheckLogin,adminController.actived_list)

router.post('/detailuser/:id', CheckLogin,adminController.detail_user)

router.get('/detailban/:id', CheckLogin,adminController.detail_ban_index)
router.post('/detailban/:id', CheckLogin,adminController.detail_ban)

router.get('/banning', CheckLogin,adminController.list_ban)
router.get('/bannedForever', CheckLogin,adminController.list_overban)

//change passworda admin
router.get('/changePasswordadmin', CheckLogin,adminController.changePW_admin_index)
router.post('/changePasswordadmin', changePassValidator,adminController.changePW_admin)

//transaction
router.get('/confirmTransaction', CheckLogin,adminController.transac_index)
router.get('/confirmTransaction/:id', CheckLogin,adminController.transac_detail)
router.post('/confirmTransaction/:id', CheckLogin,adminController.transac_confirm)

module.exports = router

