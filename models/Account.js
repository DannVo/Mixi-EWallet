const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const date_now = new Date();
const AccountSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    username: String,
    phone: {
        type: String,
        unique: true
    },
    password: String,
    address: String,
    fullname: String,
    date_register: {
        type: String,
        default: date_now.getDate() + '-' + (date_now.getMonth() + 1) + '-' + date_now.getFullYear() + ' ' +
            date_now.getHours() + ":" + date_now.getMinutes() + ":" + date_now.getSeconds()
    },

    birthday: String,

    idcard_front: String,
    idcard_back: String,
    // 0: chờ xác minh, 1: đã xác minh, 2: chờ cập nhật, 3: vô hiệu hóa bởi admin 4:bị khóa do đăng nhập
    status: { type: Number, default: 0 },
    //kiểm tra xem có phải là đăng nhập lần đầu không true là 1st false đã đổi mk  
    firsttime: { type: Boolean, default: true },
    isAdmin: { type: Boolean, default: false },
    account_balance: { type: Number, default: 0 },
    //khóa tài khoản
    login_fail: { type: Number, default: 0 },
    wrong_pass: { type: Number, default: 0 },

    waitLogin: { type: Date },
    //đăng nhập bất thường
    inconstant_login:{type:Number,default:0}


});
module.exports = mongoose.model('Account', AccountSchema);