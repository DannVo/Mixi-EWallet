const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const generator = require("generate-password");
const Account = require('../models/Account');
const Transaction = require('../models/Transaction')
const { validationResult } = require("express-validator");
const sender = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "ewallet.webnc@gmail.com",
        pass: "jvotmzepzjbsxanz",

        
    },
});

let OTP_code_check = "";
let OTP_timecheck = "";
let receiver_email = '',
    receiver_id = '',
    receiver_account_balance = 0;
    
class UserController {
    index(req,res){
        let id = req.session.account._id;
        Account.findById(id, (err, data) => {
            return res.render("user", {
                fullname: data.fullname,
                email: data.email,
                phone: data.phone,
                address: data.address,
                birthday: data.birthday,
                idcard_front: "",
                idcard_back: "",
                account_balance: data.account_balance,
                status: data.status,
            });
        });
    }

    add_money_index(req, res){
        let user = req.session.account;
        Account.findById(user._id, function(err, data) {
            if (data.status == 0 || data.status == 2) {
                res.render("notactive", {
                    fullname: user.fullname,
                    pagename: "Chức năng nạp tiền"
                })
            } else {
                res.render("addMoney", {
                    error: "",
                    fullname: user.fullname,
                });
            }
        })
    }

    add_money(req, res){
        let id = req.session.account._id;
        let { numberCard, dateExp, cvv, money } = req.body;
        money = parseInt(money);
        Account.findById(id, (err, data) => {
            if (numberCard === "111111") {
                if (dateExp === "2022-10-10") {
                    if (cvv === "411") {
                        Account.findByIdAndUpdate(id, {
                                $inc: { account_balance: money }
                            })
                            .then(() => {
                                let transaction = new Transaction({
                                    username: data.username,
                                    money,
                                    kind: 0,
                                    status_transaction: 0,
                                });
                                return transaction.save()

                            }).then(() => {
                                return res.redirect("/user/addMoney?message=addmoneysuccess");
                            })
                            .catch((err) => {
                                return res.render("addMoney", {
                                    error: err.message,
                                    fullname: data.fullname,
                                });
                            });
                    } else {
                        return res.render("addMoney", {
                            error: "Sai mã cvv",
                            fullname: data.fullname,
                        });
                    }
                } else {
                    return res.render("addMoney", {
                        error: "Sai ngày hết hạn",
                        fullname: data.fullname,
                    });
                }
            } else if (numberCard === "222222") {
                if (dateExp === "2022-11-11") {
                    if (cvv === "443") {
                        if (money > 1000000) {
                            return res.render("addMoney", {
                                error: "Chỉ được nạp tối đa 1 triệu",
                                fullname: data.fullname,
                            });
                        } else {
                            Account.findByIdAndUpdate(id, {
                                    $inc: { account_balance: money }
                                })
                                .then(() => {
                                    let transaction = new Transaction({
                                        username: data.username,
                                        money,
                                        kind: 0,
                                        status_transaction: 0,
                                    });
                                    return transaction.save()

                                }).then(() => {
                                    return res.redirect("/user/addMoney?message=addmoneysuccess");
                                })
                                .catch((err) => {
                                    return res.render("addMoney", {
                                        error: err.message,
                                        fullname: data.fullname,
                                    });
                                });
                        }
                    } else {
                        return res.render("addMoney", {
                            error: "Sai mã cvv",
                            fullname: user.fullname,
                        });
                    }
                } else {
                    return res.render("addMoney", {
                        error: "Sai ngày hết hạn",
                        fullname: user.fullname,
                    });
                }
            } else if (numberCard === "333333") {
                if (dateExp === "2022-12-12") {
                    if (cvv === "577") {
                        return res.render("addMoney", {
                            error: "Thẻ hết tiền",
                            fullname: data.fullname,
                        });
                    } else {
                        return res.render("addMoney", {
                            error: "Sai mã CVV",
                            fullname: data.fullname,
                        });
                    }
                } else {
                    return res.render("addMoney", {
                        error: "Sai ngày hết hạn",
                        fullname: data.fullname,
                    });
                }
            } else if (numberCard.length === 6) {
                return res.render("addMoney", {
                    error: "Thẻ này không được hỗ trợ",
                    fullname: data.fullname,
                });
            } else {
                return res.render("addMoney", {
                    error: "Sai mã thẻ",
                    fullname: data.fullname,
                });
            }
        });
    }

    withdraw_index(req, res){
        let user = req.session.account;
        Account.findById(user._id, function(err, data) {
            if (data.status == 0 || data.status == 2) {
                res.render("notactive", {
                    fullname: user.fullname,
                    pagename: "Chức năng rút tiền"
                })
            } else {
                res.render("withdrawMoney", {
                    error: "",
                    fullname: user.fullname,
                });
            }
        })
    }

    withdraw_money(req, res){
        let id = req.session.account._id;
        let { numberCard, dateExp, cvv, money, note } = req.body;
        money = parseInt(money);
        const date_now = new Date();
        let timecurrent = date_now.getDate() + '-' + (date_now.getMonth() + 1) + '-' + date_now.getFullYear();
        timecurrent = String(timecurrent)


        Account.findById(id, (err, data) => {
            Transaction.find({ $and: [{ kind: 2 }, { time: { $regex: timecurrent } }] }).count().then((limit_withdraw) => {
                if (limit_withdraw > 1) {
                    return res.render("withdrawMoney", {
                        error: "Số lần rút tiền đã tối đa trong ngày",
                        fullname: data.fullname,
                    });
                } else if (numberCard === "111111") {
                    if (dateExp === "2022-10-10") {
                        if (cvv === "411") {
                            if (money > data.account_balance) {
                                return res.render("withdrawMoney", {
                                    error: "Số dư không đủ",
                                    fullname: data.fullname,
                                });
                            } else if (money % 50 != 0) {
                                return res.render("withdrawMoney", {
                                    error: "Số tiền rút phải là bội số của 50,000",
                                    fullname: data.fullname,
                                });
                            } else if (money > 5000000) {
                                let transaction = new Transaction({
                                    username: data.username,
                                    money,
                                    fee: money * 0.05,
                                    kind: 2,
                                    status_transaction: 1,
                                    note,
                                });

                                return transaction.save().then(() => {
                                        return res.redirect(
                                            "/user/withdrawMoney?message=withdrawmoneywaiting"
                                        );
                                    })
                                    .catch((err) => {
                                        return res.render("withdrawMoney", {
                                            error: err.message,
                                            fullname: data.fullname,
                                        });
                                    });


                            } else {
                                Account.findByIdAndUpdate(id, {
                                        account_balance: data.account_balance - money - money * 0.05,
                                    })
                                    .then(() => {
                                        let transaction = new Transaction({
                                            username: data.username,
                                            money,
                                            fee: money * 0.05,
                                            kind: 2,
                                            status_transaction: 0,
                                            note,
                                        });
                                        return transaction.save()

                                    }).then(() => {
                                        return res.redirect(
                                            "/user/withdrawMoney?message=withdrawmoneysuccess"
                                        );
                                    })
                                    .catch((err) => {
                                        return res.render("withdrawMoney", {
                                            error: err.message,
                                            fullname: data.fullname,
                                        });
                                    });
                            }
                        } else {
                            return res.render("withdrawMoney", {
                                error: "Sai mã CVV",
                                fullname: data.fullname,
                            });
                        }
                    } else {
                        return res.render("withdrawMoney", {
                            error: "Sai ngày hết hạn",
                            fullname: data.fullname,
                        });
                    }
                } else if (numberCard.length === 6) {
                    return res.render("withdrawMoney", {
                        error: "Thẻ này không được hỗ trợ",
                        fullname: data.fullname,
                    });
                } else {
                    return res.render("withdrawMoney", {
                        error: "Sai mã thẻ",
                        fullname: data.fullname,
                    });
                }
            });
        });
    }

    transfer_money_index(req, res){
        let user = req.session.account;
        Account.findById(user._id, function(err, data) {
            if (data.status == 0 || data.status == 2) {
                res.render("notactive", {
                    fullname: user.fullname,
                    pagename: "Chức năng chuyển tiền"
                })
            } else {
                res.render("transferMoney", {
                    fullname: user.fullname,
                    phone: "",
                    money: "",
                    note: "",
                    receiver: "",
                    fee: "",
                    nguoitra: "",
                    OTP_code: "",
                    block: 0,
                    error: '',
                });
            }
        });
    }

    transfer_money(req, res){
        let user = req.session.account;
        let id = req.session.account._id;
        let OTP_timecheck_curren = new Date().getTime();
        let { phone, money, note, receiver, fee, nguoitra, OTP_code } = req.body;

        if (phone === '' && money === "" && note === "" && receiver === "" && fee === "" && OTP_code == '') {
            return res.render("transferMoney", {
                fullname: user.fullname,
                phone: '',
                money: '',
                note: '',
                block: 0,
                receiver: '',
                OTP_code: '',
                fee: fee,
                error: 'Vui lòng nhập đủ thông tin gồm: Số điện thoại, số tiền và ghi chú.',
            });
        } else if (phone !== '' && money === '' && note !== "" && receiver === "" && fee === "" && OTP_code == '') {
            return res.render("transferMoney", {
                fullname: user.fullname,
                phone: '',
                money: '',
                note: '',
                block: 0,
                receiver: '',
                OTP_code: '',
                fee: fee,
                error: 'Vui lòng nhập đủ thông tin gồm: Số điện thoại, số tiền và ghi chú.',
            });
        } else if (phone === user.phone) {
            return res.render("transferMoney", {
                fullname: user.fullname,
                phone: '',
                money: '',
                note: '',
                receiver: '',
                block: 0,
                OTP_code: '',
                fee: fee,
                error: 'Đây là số điện thoại của bạn! Hãy nhập số điện thoại của người nhận.',
            });
        } else if (isNaN(money)) {
            return res.render("transferMoney", {
                fullname: user.fullname,
                phone: '',
                money: '',
                note: '',
                receiver: '',
                block: 0,
                OTP_code: '',
                fee: fee,
                error: 'Vui lòng nhập số tiền là một số.',
            });
        } else if (phone !== "" && money !== "" && note !== "" && receiver === "") {
            //check infor receiver
            money = parseInt(money);
            fee = (money / 100) * 5;
            fee = parseInt(fee);
            Account.findById(id, (err, data) => {
                if (data.account_balance < money) {
                    return res.render("transferMoney", {
                        fullname: user.fullname,
                        phone: phone,
                        money: money,
                        note: note,
                        block: 0,
                        receiver: '',
                        OTP_code: '',
                        fee: fee,
                        error: 'Số dư của bạn không đủ thực hiện giao dịch.',
                    });
                }
            });
            Account.findOne({ phone: phone }, (err, data) => {
                if (!data) {
                    return res.render("transferMoney", {
                        fullname: user.fullname,
                        phone: '',
                        money: '',
                        note: '',
                        block: 0,
                        receiver: '',
                        OTP_code: '',
                        fee: '',
                        error: 'Không tìm thấy người nhận!',
                    });
                } else {
                    receiver_id = data._id;
                    receiver_account_balance = data.account_balance;
                    receiver_email = data.email;
                    return res.render("transferMoney", {
                        fullname: user.fullname,
                        phone: phone,
                        money: money,
                        note: note,
                        block: 1,
                        receiver: data.fullname,
                        OTP_code: '',
                        fee: fee,
                        error: '',
                    });
                }
            });
        } else if (phone !== "" && money !== "" && note !== "" && receiver !== "" && OTP_code === "") {
            //button get OTP
            money = parseInt(money);
            fee = (money / 100) * 5;
            fee = parseInt(fee);
            Account.findById(id, (err, data) => {
                if (data.account_balance < money) {
                    return res.render("transferMoney", {
                        fullname: user.fullname,
                        phone: phone,
                        money: money,
                        note: note,
                        block: 0,
                        receiver: '',
                        OTP_code: '',
                        fee: fee,
                        error: 'Số dư của bạn không đủ thực hiện giao dịch.',
                    });
                }
            });
            Account.findOne({ phone: phone }, (err, data) => {
                if (!data) {
                    return res.render("transferMoney", {
                        fullname: user.fullname,
                        phone: '',
                        block: 0,
                        money: '',
                        note: '',
                        receiver: '',
                        OTP_code: '',
                        fee: '',
                        error: 'Không tìm thấy người nhận!',
                    });
                }
            });
            OTP_code_check = generator.generate({
                //Tự tạo OTP
                length: 6,
                numbers: true,
            });
            OTP_timecheck = new Date().getTime();
            var mailOptions = {
                from: "ewallet.webnc@gmail.com",
                to: user.email,
                subject: "MIXI E-WALLET | MÃ OTP CHUYỂN TIỀN",
                text: "Người nhận: " +
                    receiver +
                    "\nSố tiền: " +
                    money + " VND." +
                    "\nMã OTP: " +
                    OTP_code_check +
                    "\nLưu ý: Mã OTP chỉ có hiệu lực trong vòng một phút."
            };
            sender.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                }
            });
            return res.render("transferMoney", {
                fullname: user.fullname,
                phone: phone,
                money: money,
                note: note,
                block: 2,
                receiver: receiver,
                error: '',
                fee: fee,
                nguoitra: '',
                OTP_code: '',
            });
        } else if (phone !== "" && money !== "" && note !== "" && receiver !== "" && OTP_code !== "" && fee !== '') {
            //xác nhận giao dịch
            money = parseInt(money);
            fee = (money / 100) * 5;
            fee = parseInt(fee);
            Account.findById(id, (err, data) => {
                if (data.account_balance < money) {
                    return res.render("transferMoney", {
                        fullname: user.fullname,
                        phone: phone,
                        money: money,
                        note: note,
                        block: 0,
                        receiver: '',
                        OTP_code: '',
                        fee: fee,
                        error: 'Số dư của bạn không đủ thực hiện giao dịch.',
                    });
                }
            });
            Account.findOne({ phone: phone }, (err, data) => {
                if (!data) {
                    return res.render("transferMoney", {
                        fullname: user.fullname,
                        phone: '',
                        money: '',
                        note: '',
                        block: 0,
                        receiver: '',
                        OTP_code: '',
                        fee: '',
                        error: 'Không tìm thấy người nhận!',
                    });
                }
            });
            let timecheck = (OTP_timecheck_curren - OTP_timecheck) / 1000;
            let time = new Date().toISOString();
            if (OTP_code === OTP_code_check && timecheck < 61) {
                if (money > 5000000) {
                    Account.findById(id, (err, data) => {
                        if (nguoitra === 'nguoichuyentra') {
                            Account.findByIdAndUpdate(id, {
                                    account_balance: data.account_balance - money - fee
                                })
                                .catch((err) => {
                                    return res.render("transferMoney", {
                                        fullname: user.fullname,
                                        phone: '',
                                        money: '',
                                        note: '',
                                        block: 0,
                                        receiver: '',
                                        error: 'Lỗi cập nhật số dư ví người gửi',
                                        fee: '',
                                        nguoitra: '',
                                        OTP_code: '',
                                    });
                                });
                        } else if (nguoitra === 'nguoinhantra') {
                            Account.findByIdAndUpdate(id, {
                                account_balance: data.account_balance - money
                            }).catch((err) => {
                                return res.render("transferMoney", {
                                    fullname: user.fullname,
                                    phone: '',
                                    money: '',
                                    note: '',
                                    block: 0,
                                    receiver: '',
                                    error: 'Lỗi cập nhật số dư ví người gửi',
                                    fee: '',
                                    nguoitra: '',
                                    OTP_code: '',
                                });
                            });
                        }
                    });
                    let transaction = new Transaction({
                        username: user.username,
                        money: money,
                        kind: 1,
                        status_transaction: 1,
                        note: note,
                        fee,
                        price: 0,
                        number_card: '',
                        name_card: '',
                        receiver_id: receiver_id,
                        nguoitra: nguoitra,
                    });
                    return transaction.save().then(() => {
                            var mailOptions = {
                                from: "ewallet.webnc@gmail.com",
                                to: user.email,
                                subject: "MIXI E-WALLET | CHỜ DUYỆT GIAO DỊCH",
                                text: "Tài khoản của bạn: " +
                                    user.fullname +
                                    "\nVừa chuyển: " +
                                    money + " VND." +
                                    "\nTrạng thái: Chờ duyệt" +
                                    "\nNgày giao dich: " + time + ".",
                            };
                            sender.sendMail(mailOptions, function(error, info) {
                                if (error) {
                                    console.log(error);
                                }
                            });
                        })
                        .then(() => {
                            return res.redirect('/user/transferMoney' + '?message=transferMoneychoduyet');
                        });
                } else {
                    //update balance 
                    Account.findById(id, (err, data) => {
                        if (nguoitra === 'nguoichuyentra') {
                            Account.findByIdAndUpdate(id, {
                                    account_balance: data.account_balance - money - fee
                                })
                                .catch((err) => {
                                    return res.render("transferMoney", {
                                        fullname: user.fullname,
                                        phone: '',
                                        money: '',
                                        note: '',
                                        block: 0,
                                        receiver: '',
                                        error: 'Lỗi cập nhật số dư ví người gửi',
                                        fee: '',
                                        nguoitra: '',
                                        OTP_code: '',
                                    });
                                });
                        } else if (nguoitra === 'nguoinhantra') {
                            Account.findByIdAndUpdate(id, {
                                account_balance: data.account_balance - money
                            }).catch((err) => {
                                return res.render("transferMoney", {
                                    fullname: user.fullname,
                                    phone: '',
                                    money: '',
                                    note: '',
                                    block: 0,
                                    receiver: '',
                                    error: 'Lỗi cập nhật số dư ví người gửi',
                                    fee: '',
                                    nguoitra: '',
                                    OTP_code: '',
                                });
                            });
                        }
                    });
                    //luu giao dich
                    let transaction = new Transaction({
                        username: user.username,
                        money,
                        kind: 1,
                        status_transaction: 0,
                        note: note,
                        fee,
                        price: 0,
                        number_card: '',
                        name_card: '',
                        receiver_id: receiver_id,
                        nguoitra: nguoitra,
                    });
                    return transaction.save().then(() => {
                            Account.findById(id, (err, data) => {
                                var mailOptions = {
                                    from: "ewallet.webnc@gmail.com",
                                    to: user.email,
                                    subject: "MIXI E-WALLET | GIAO DỊCH THÀNH CÔNG",
                                    text: "Tài khoản của bạn " +
                                        user.fullname +
                                        "\nVừa chuyển: " +
                                        money + " VND." +
                                        "\nPhí chuyển: " +
                                        fee + " VND." +
                                        "\nSố dư: " +
                                        data.account_balance + " VND." +
                                        "\nNgày giao dich: " + time + ".",
                                };
                                sender.sendMail(mailOptions, function(error, info) {
                                    if (error) {
                                        console.log(error);
                                    }
                                });
                            })
                        })
                        .then(() => {
                            if (nguoitra === 'nguoichuyentra') {
                                receiver_account_balance = receiver_account_balance + money;
                            } else if (nguoitra === 'nguoinhantra') {
                                receiver_account_balance = receiver_account_balance + money - fee;
                            }
                        })
                        .then(() => {
                            Account.findByIdAndUpdate(receiver_id, {
                                account_balance: receiver_account_balance
                            }).catch((err) => {
                                return res.render("transferMoney", {
                                    fullname: user.fullname,
                                    phone: phone,
                                    money: money,
                                    note: note,
                                    receiver: receiver,
                                    error: 'Lỗi cập nhật số dư người nhận',
                                    fee: fee,
                                    block: 0,
                                    nguoitra: '',
                                    OTP_code: '',
                                });
                            });
                        })
                        .then(() => {
                            //thong bao so du receiver
                            var mailOptions = {
                                from: "ewallet.webnc@gmail.com",
                                to: receiver_email,
                                subject: "MIXI E-WALLET | GIAO DỊCH THÀNH CÔNG",
                                text: "Tài khoản của bạn " +
                                    receiver +
                                    "\nVừa nhận: " +
                                    money + " VND." +
                                    "\nPhí chuyển: " +
                                    fee + " VND." +
                                    "\nTừ: " +
                                    user.fullname + " VND." +
                                    "\nSố dư: " +
                                    receiver_account_balance + " VND." +
                                    "\nNgày giao dich: " + time + ".",
                            };
                            sender.sendMail(mailOptions, function(error, info) {
                                if (error) {
                                    if (error) {
                                        console.log(error);
                                    }
                                }
                            });
                        })
                        .then(() => {
                            return res.redirect('/user/transferMoney' + '?message=transferMoneySuccess');
                        })
                }
            } else {
                return res.render("transferMoney", {
                    fullname: user.fullname,
                    error: "Mã OTP sai hoặc quá hạn!",
                    phone: '',
                    money: '',
                    note: '',
                    block: 0,
                    receiver: '',
                    OTP_code: '',
                    fee: '',
                });
            }
        } else {
            //not infor
            return res.render("transferMoney", {
                fullname: user.fullname,
                phone: "",
                money: "",
                note: "",
                fee: "",
                block: 0,
                receiver: "",
                OTP_code: "",
                error: 'Vui lòng nhập đủ thông tin gồm: Số điện thoại, số tiền và ghi chú.'
            });
        }
    }

    buycard_index(req, res){
        let user = req.session.account;
        Account.findById(user._id, function(err, data) {
            if (data.status == 0 || data.status == 2) {
                res.render("notactive", {
                    fullname: user.fullname,
                    pagename: "Chức năng mua thẻ cào",
                })
            } else {
                res.render("buyCard", {
                    fullname: user.fullname,
                    error: ''
                });
            }
        });
    }

    buycard(req,res){
        let user = req.session.account._id;
        let {
            number_card = generator.generate({
                length: 5,
                numbers: true,
                uppercase: false,
                exclude: 'abcdefghijklmnopqrstuvwxyz'
            }), name_card, price, fee, quantity, money
        } = req.body;
        money = parseInt(money);
        fee = parseInt(fee);
        price = parseInt(price);

        Account.findById(user, (err, data) => {
            if (name_card === "Viettel") {
                if (quantity > 5) {
                    return res.render("buyCard", {
                        error: "Số lượng card không được lớn hơn 5",
                        fullname: data.fullname,
                    });
                } else {
                    if (price * quantity > data.account_balance) {
                        return res.render("buyCard", {
                            error: "Số dư không đủ",
                            fullname: data.fullname,
                        });
                    } else {
                        number_card = "11111" + number_card;
                        money = price * quantity;
                        Account.findByIdAndUpdate(user, {
                                account_balance: data.account_balance - money,
                            })
                            .then(() => {
                                let transaction = new Transaction({
                                    username: data.username,
                                    kind: 3,
                                    number_card,
                                    status_transaction: 0,
                                    price,
                                    fee: 0,
                                    money: price * quantity,
                                    quantity,
                                    name_card,
                                });
                                return transaction.save()

                            }).then(() => {
                                return res.render("buyCardreceipt", {
                                    username: data.username,
                                    kind: 3,
                                    number_card,
                                    status_transaction: 0,
                                    price,
                                    fee: 0,
                                    money: price * quantity,
                                    quantity,
                                    name_card,
                                    fullname: data.fullname,
                                });
                            })
                            .catch((err) => {
                                return res.render("buyCardreceipt", {
                                    error: err.message,
                                    fullname: data.fullname,
                                });
                            });
                    }
                }
            } else if (name_card === "Mobifone") {
                if (quantity > 5) {
                    return res.render("buyCard", {
                        error: "Số lượng card không được lớn hơn 5",
                        fullname: data.fullname,
                    });
                } else {
                    if (price * quantity > data.account_balance) {
                        return res.render("buyCard", {
                            error: "Số dư không đủ",
                            fullname: data.fullname,
                        });
                    } else {
                        number_card = "22222" + number_card;
                        money = price * quantity;
                        Account.findByIdAndUpdate(user, {
                                account_balance: data.account_balance - money,
                            })
                            .then(() => {
                                let transaction = new Transaction({
                                    username: data.username,
                                    kind: 3,
                                    number_card,
                                    status_transaction: 0,
                                    price,
                                    fee: 0,
                                    money: price * quantity,
                                    quantity,
                                    name_card,
                                });
                                return transaction.save()

                            }).then(() => {
                                return res.render("buyCardreceipt", {
                                    username: data.username,
                                    kind: 3,
                                    number_card,
                                    status_transaction: 0,
                                    price,
                                    fee: 0,
                                    money: price * quantity,
                                    quantity,
                                    name_card,
                                    fullname: data.fullname,
                                });
                            })
                            .catch((err) => {
                                return res.render("buyCardreceipt", {
                                    error: err.message,
                                    fullname: data.fullname,
                                });
                            });
                    }
                }
            } else if (name_card === "Vinaphone") {
                if (quantity > 5) {
                    return res.render("buyCard", {
                        error: "Số lượng card không được lớn hơn 5",
                        fullname: data.fullname,
                    });
                } else {
                    if (price * quantity > data.account_balance) {
                        return res.render("buyCard", {
                            error: "Số dư không đủ",
                            fullname: data.fullname,
                        });
                    } else {
                        number_card = "33333" + number_card;
                        money = price * quantity;
                        Account.findByIdAndUpdate(user, {
                                account_balance: data.account_balance - money,
                            })
                            .then(() => {
                                let transaction = new Transaction({
                                    username: data.username,
                                    kind: 3,
                                    number_card,
                                    status_transaction: 0,
                                    price,
                                    fee: 0,
                                    money: price * quantity,
                                    quantity,
                                    name_card,
                                });
                                return transaction.save()

                            }).then(() => {
                                return res.render("buyCardreceipt", {
                                    username: data.username,
                                    kind: 3,
                                    number_card,
                                    status_transaction: 0,
                                    price,
                                    fee: 0,
                                    money: price * quantity,
                                    quantity,
                                    name_card,
                                    fullname: data.fullname,
                                });
                            })
                            .catch((err) => {
                                return res.render("buyCardreceipt", {
                                    error: err.message,
                                    fullname: data.fullname,
                                });
                            });
                    }
                }

            }
        });
    }

    buycard_done_index(req, res){
        let user = req.session.account;
        Account.findById(user._id, function(err, data) {
            if (data.status == 0) {
                res.render("notactive", {
                    fullname: user.fullname,
                    pagename: "Chức năng mua thẻ cào",
                })
            } else {
                res.render("buyCard", {
                    fullname: user.fullname,
                    error: ''
                });
            }
        });
    }

    view_history(req, res){
        let user = req.session.account;
 
        Account.findById(user._id, function(err, data) {
            if (data.status == 0 || data.status == 2) { // Khóa các tài khoản chưa được xác minh
                res.render("notactive", {
                    fullname: user.fullname,
                    pagename: "Chức năng xem lịch sử giao dịch"
                })
            } else {
                Transaction.find({username:data.username}).then((his) => { // Lấy danh sách các giao dịch theo tên tài khoản
                    res.render("history", {
                        username:data.username,
                        his: his,
                        fullname: user.fullname
                    });
                });
            }
        })
    }

    view_detailHistory(req, res){
        Transaction.findById(req.params.id, function(err, transaction) {
            return res.render('detailhistory', {
                transaction,
                fullname: transaction.fullname
            });
        });
    }

    changePW_user_index(req, res){
        let user = req.session.account;
        return res.render("changePassworduser", { error: "", fullname: user.fullname });
    }

    changePW_user(req, res){
        let user = req.session.account;
        let { oldpass, confirm1, confirm2 } = req.body;
        let result = validationResult(req);
        if (result.errors.length === 0) {
            if (req.session.account) {
                if (bcrypt.compareSync(oldpass, user.password)) {
                    if (confirm1 === confirm2) {
                        bcrypt
                            .hash(confirm2, 10)
                            .then((hashed) => {
                                Account.findByIdAndUpdate(req.session.account._id, {
                                    password: hashed,
                                }).then(() => {
                                    return res.redirect("/user");
                                });
                            })
                            .catch((err) => {
                                return res.render("changePassworduser", {
                                    error: err.message,
                                });
                            });
                    } else {
                        return res.render("changePassworduser", {
                            error: "Mật khẩu không khớp",
                            fullname: user.fullname,
                        });
                    }
                } else {
                    return res.render("changePassworduser", {
                        error: "Mật khẩu cũ không đúng",
                        fullname: user.fullname,
                    });
                }
            } else {
                res.redirect("/");
            }
        } else {
            let messages = result.mapped();
            let message = "";
            for (m in messages) {
                message = messages[m].msg;
                break;
            }
            res.render("changePassworduser", {
                error: message,
                fullname: user.fullname,
            });
        }
    }
    
    update_profile(req, res){
        var date_now = new Date()
        let {
            idcard_front = req.files.idcard_front[0].originalname,
            idcard_back = req.files.idcard_back[0].originalname,
            } = req.body;
        if (req.session.account) {
            Account.findByIdAndUpdate(req.session.account._id, {
                idcard_front: idcard_front,
                idcard_back: idcard_back,
                status: 0,
                date_register: date_now.getDate() + '-' + (date_now.getMonth() + 1) + '-' + date_now.getFullYear() + ' ' +
                    date_now.getHours() + ":" + date_now.getMinutes() + ":" + date_now.getSeconds()

            }).then(() => {
                return res.redirect("/user");
            });
        } else {
            res.redirect("/user");
        }
    }

    logout(req,res){
        req.session.destroy();
        res.redirect("/");
    }
}
module.exports = new UserController;