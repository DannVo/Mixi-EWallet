//new
const Account = require('../models/Account')
const { validationResult } = require('express-validator');
const generator = require('generate-password');
const nodemailer = require('nodemailer');

const bcrypt = require('bcrypt');
const sender = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ewallet.webnc@gmail.com',
        pass: 'jvotmzepzjbsxanz'
    }
});
class AccountController {

    //login
    //GET
    login_index(req,res){
        res.render('login', {username: '', password: '', error: '' });
    }
    //POST
    login(req, res){
        let now = new Date();
        let result = validationResult(req);

        if (result.errors.length === 0) {
            let { username, password } = req.body;

            Account.findOne({ username }).then(acc => {
                if (!acc) {
                    throw new Error('Tài khoản không tồn tại');
                } else if (acc.inconstant_login === 1) {
                    throw new Error('Tài khoản đã bị khóa do nhập sai mật khẩu nhiều lần, vui lòng liên hệ quản trị viên để được hỗ trợ ');
                } else if (acc.status === 3) {
                    throw new Error('Tài khoản đã bị vô hiệu hóa, vui lòng liên hệ tổng đài 18001008');
                }else
                if (acc.waitLogin > now) {
                    let waiting = parseInt(acc.waitLogin - now)
                    throw new Error('Tài khoản hiện đang tạm khóa, vui lòng thử lại sau ' + (parseInt(waiting / 1000)) + ' giây');
                    // throw new Error('Tài khoản hiện đang tạm khóa trong' + (parseInt((acc.waitLogin - now) / 1000)) + ' giây');
                } else
                if (bcrypt.compareSync(password, acc.password)) {
                    return acc;
                } else {
                    if (acc.isAdmin == false) {
                        if (acc.wrong_pass < 5) {
                            if (acc.wrong_pass === 2) {
                                // var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                // var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                                // var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                                Account.findByIdAndUpdate(acc._id, {
                                    $inc: { wrong_pass: 1 },
                                    // $set: { waitLogin: minutes + seconds }
                                    $set: { waitLogin: now.setSeconds(now.getSeconds() + 60) }
                                })
                                .then(() => {
                                    return null;
                                })
                                .catch(error => {
                                    console.log(error);
                                })
                            } else {
                                Account.findByIdAndUpdate(acc._id, { 
                                    // $set: { wrong_pass: 1 },
                                    $inc: { wrong_pass: 1 } 
                                })
                                .then(() => {
                                    return null;
                                })
                                .catch(error => {
                                    console.log(error);
                                })
                            }
                        } else {
                            Account.findByIdAndUpdate(acc._id, { 
                                $set: { inconstant_login: 1 } 
                            }).then(() => {
                                return null;
                            }).catch(error => {
                                console.log(error);
                            })
                        }
                    } else {
                        return null;
                    }
                }
            }).then(acc => {
                if (!acc) {
                    throw new Error('Mật khẩu nhập sai, vui lòng nhập lại.', 'password', username);
                } else {
                    req.session.account = acc;
                    Account.findByIdAndUpdate(acc._id, {
                        $unset: { waitLogin: '' },
                        $set: { wrong_pass: 0 },
                    }).then(() => {
                        if (acc.isAdmin) {
                            return res.redirect('/admin');
                        }
                        return res.redirect('/user');
                    }).catch(error => {
                        console.log(error);
                    });
                }
            }).catch(error => {
                return res.render('login', {username, password: '', error: error.message });
            })
        } else {
            let err_msg = '';
            let messages = result.mapped();
            
            for (var msg in messages) {
                err_msg = messages[msg].msg;
                // console.log("message ",err_msg);
                break;
            }
            return res.render('login', {username: '', password: '', error: err_msg });
        }
    }

    //register
    //GET
    regis_index(req, res){
        res.render('register', { fullname: '', phone: '', address: '', birthday: '', email: '', 
            idcard_front: '', idcard_back: '', error: '',
        });
    }

    //POST
    regis(req,res){
        let result = validationResult(req);
        let { email, fullname, phone, address, birthday,
            idcard_front = req.files.idcard_front[0].originalname,
            idcard_back = req.files.idcard_back[0].originalname,
            //Generate username
            username = generator.generate({
                length: 10,
                numbers: true,
                uppercase: false,
                exclude: 'abcdefghijklmnopqrstuvwxyz'
            }),
            password = generator.generate({
                // Generate password
                length: 6,
                numbers: true,
                // include: '1234567890abcdefghijklmnopqrstuvwxyz'
            }),
            // 
        } = req.body;
        if (result.errors.length === 0) {

            Account.findOne({ $or: [{ email }, { phone }] }).then(acc => {
                    if (acc) {
                        throw new Error('Tài khoản người dùng đã tồn tại');
                    }
                })
                .then(() => bcrypt.hash(password, 10)).then(hashed_pass => {
                    let user = new Account({
                        email,
                        username,
                        phone,
                        password: hashed_pass,
                        address,
                        fullname,
                        birthday,
                        idcard_front,
                        idcard_back,
                    });
                    return user.save();
                }).then(() => {
                    var detailMail = {
                        from: 'ewallet.webnc@gmail.com',
                        to: email,
                        subject: 'MIXI E-WALLET | THÔNG TIN ĐĂNG NHẬP',
                        text: 'Thông tin tài khoản của bạn đã được tạo | \nUsername: ' + username + '\nPassword: ' + password
                    };
                    console.log("Username: ", username," Password: ",password)
                    sender.sendMail(detailMail, function(error, info) {
                        if (error) {
                            console.log(error);
                        } else {

                            //console.log("Info User: ", info)
                            return res.redirect('/' + '?message=thanhcong');
                        }
                    });
                }).catch(err => {
                    return res.render('register', { fullname, birthday, phone, address, email,
                        idcard_front, idcard_back, error: err.message
                    });
                })
        } else {
            let err_msg = '';
            let messages = result.mapped();
            // err_msg = message[value].msg;

            for (var msgs in messages) {
                err_msg = messages[msgs].msg;
                break;
                //console.log("message ",err_msg)
            }
            res.render('register', { fullname, birthday, phone, address, email,
                idcard_front, idcard_back, error: err_msg
            });
        }
    }

    //change_password
    //GET
    changePW_index(req, res){
        res.render('changePassword', {error: ''});
    }

    //POST
    changePassWord(req,res){
        // let { password, recheck_pass  } = req.body;
        let { confirm1, confirm2 } = req.body;
        let result = validationResult(req);
        if (result.errors.length === 0) {
            if (req.session.account) {
                if (confirm1 === confirm2) {
                    bcrypt.hash(confirm2, 10).then(hashed_pass => {
                        Account.findByIdAndUpdate(req.session.account._id, {
                            password: hashed_pass,
                            firsttime: false
                        }).then(() => {
                            req.session.account.firsttime = false;
                            if (req.session.account.isAdmin) {
                                return res.redirect('/admin');
                            }
                            return res.redirect('/user');
                        })
                    }).catch(error => {
                        return res.render('changePassword', { error: error.message });
                    })
                } 
                else 
                {
                    return res.render('changePassword', { error: 'Mật khẩu không khớp' });
                }
            } else {
                // return res.render('changePassword', {code:104, message: "Mật khẩu sai" });
                res.redirect('/');
            }
        } else {
            let err_msg = '';
            let messages = result.mapped();
            // err_msg = message[value].msg;
            
            for (var msgs in messages) {
                err_msg = messages[msgs].msg;
                break;
            }
            res.render('changePassword', { error: err_msg });
        }
    }

    //reset_password
    //GET
    resetPW_index(req, res){
        res.render('resetPassword', { email: '', phone: '', error: '',});
    }
    //POST
    resetPassWord(req,res){
        let result = validationResult(req);
        let { email, phone,
            password = generator.generate({
                // Password include > 6 characters
                // Generate password
                length: 6,
                numbers: true
            }),
        } = req.body;
        if (result.errors.length === 0) {
            Account.findOne({ $or: [{ email }, { phone }] }).then(acc => {
                if (!acc) {
                    throw new Error('Tài khoản người dùng không tồn tại');
                } else {
                    bcrypt.hash(password, 10).then(hashed_pass => {
                        Account.findByIdAndUpdate(acc._id, {
                            password: hashed_pass,
                            firsttime: true
                        }).catch(err => {
                            return res.render('resetPassword', { email: '', phone: '', error: err.message,});
                        });
                    });
                }
            }).then(() => {
                var detailMail = {
                    from: 'ewallet.webnc@gmail.com',
                    to: email,
                    subject: 'MIXI E-WALLET | THÔNG TIN ĐĂNG NHẬP',
                    text: 'Mật khẩu mới của bạn: ' + password
                };
                console.log("New Password: ",password)
                // console.log("Mail: ",email)

                sender.sendMail(detailMail, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        return res.redirect('/' + '?message=thanhcong');
                    }
                });
            }).catch(err => {
                res.render('resetPassword', { email, phone, error: err.message });
            })
        } else {
            let err_msg = '';
            let messages = result.mapped();
            // err_msg = message[value].msg;
            for (var msgs in messages) {

                err_msg = messages[msgs].msg;
                break;
            }
            res.render('resetPassword', { email, phone, error: err_msg });
        }
    }
    
}
module.exports = new AccountController;