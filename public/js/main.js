function getIdDetails() {
    var urlParams;
    (window.onpopstate = function() {
        var match,
            pl = /\+/g, // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function(s) {
                return decodeURIComponent(s.replace(pl, " "));
            },
            query = window.location.search.substring(1);

        urlParams = {};
        while ((match = search.exec(query)))
            urlParams[decode(match[1])] = decode(match[2]);
    })();
    return urlParams;
}
if (getIdDetails().message == "thanhcong") {
    swal({
        title: "SUCCESS",
        text: "Thông tin đăng nhập đã được gửi tới Email của bạn",
        icon: "success",
        buttons: false,
        dangerMode: true,
    })
}

if (getIdDetails().message == "addmoneysuccess") {
    swal({
        title: "SUCCESS",
        text: "Nạp tiền thành công",
        icon: "success",
        buttons: false,
        dangerMode: true,
    })
}

if (getIdDetails().message == "withdrawmoneysuccess") {
    swal({
        title: "SUCCESS",
        text: "Rút tiền thành công",
        icon: "success",
        buttons: false,
        dangerMode: true,
    })
}
if (getIdDetails().message == "changePassSuccess") {
    swal({
        title: "SUCCESS",
        text: "Đổi mật khẩu thành công",
        icon: "success",
        buttons: false,
        dangerMode: true,
    })
}
if (getIdDetails().message == "transferMoneySuccess") {
    swal({
        title: "SUCCESS",
        text: "Giao dịch hoàn tất",
        icon: "success",
        buttons: false,
        dangerMode: true,
    })
}
if (getIdDetails().message == "transferMoneychoduyet") {
    swal({
        title: "SUCCESS",
        text: "Vui lòng chờ hệ thống phê duyệt giao dịch",
        icon: "success",
        buttons: false,
        dangerMode: true,
    })
}
//auto close lert
function setTimeAutoClosing(selector, delay) {
    var alert = $(selector).alert();
    window.setTimeout(function() { alert.alert('close') }, delay);
}

//navbar in page admin
var showup = document.getElementsByClassName("dropdown-btn");
var i;

for (i = 0; i < showup.length; i++) {
    showup[i].addEventListener("click", function() {


        this.classList.toggle("active");
        var show_content = this.nextElementSibling;
        if (show_content.style.display === "block") {

            show_content.style.display = "none";
        } else {
            show_content.style.display = "block";
        }
    });
}
if (getIdDetails().message == "withdrawmoneywaiting") {
    swal({
        title: "SUCCESS",
        text: "Số tiền lớn hơn 5.000.000. Vui lòng chờ xác nhận ",
        icon: "success",
        buttons: false,
        dangerMode: true,
    })
}

function calculateFee() {
    // var temp = document.getElementById("money2").text;
    var price = Number(document.getElementById("money").value);

    // var final_value = money * 0;
    var fee = price * 0.05;
    document.getElementById("fee").value = fee;
}

function convertNum2Money() {
    var money_temp = document.getElementById("money_temp").value;
    document.getElementById("money").value = Number(money_temp)
    var fee = parseFloat(money_temp).toLocaleString('en-US', {
        style: 'decimal',
        maximumFractionDigits: 2,
        minimumFractionDigits: 1
      });
    console.log("money_temp ",fee);
    document.getElementById("money_temp").setAttribute("type","text");
    document.getElementById("money_temp").value = fee;
}


function convertText2Num() {
    var money = document.getElementById("money_temp").value;
    var number = Number(money.replace(/[^0-9.-]+/g,""))
    console.log("number ",number);

    document.getElementById("money_temp").setAttribute("type","number");
    document.getElementById("money_temp").value = number;
}
function convertTxt2NumSubmit() {
    var money = document.getElementById("money_temp").value;
    var number = Number(money.replace(/[^0-9.-]+/g,""))
    console.log("number ",number);
    // console.log("type of ",typeof number);
    document.getElementById("money_temp").setAttribute("type","number");
    document.getElementById("money_temp").value = number;
    return true;
}

function calculateTotal() {
    var price = parseInt(document.getElementById("price").value);
    var quantity = parseInt(document.getElementById("quantity").value);
    var fee = parseInt(document.getElementById("fee").value);
    var total = ((price * quantity) / 100) * ( fee+ 100);
    document.getElementById("total").value = total.toLocaleString("en-US");
}

function convertInWithdraw() {
    calculateFee();
    convertNum2Money();
    
}
