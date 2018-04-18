var projectId = $.cookie("projectId");
var customerId;
var startIndex = -1;
var pageCount = -1;
$(function () {
    //客户信息查询
    CheckToken();

    // 退出登陆
    $(".logout").on('touchstart', function () {
        $.removeCookie('token', {path: '/'});

        window.location.href = "./login.html";
    })


});

function CheckToken() {
    var token = $.cookie('token');
    $.ajax({
        url: url+"CheckToken",
        type: "get",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            token: token
        },
        success: function (data) {
            if (data > 0) {
                customerId = data;
                Customer_query();
            } else {
                window.location.href = "login.html";
            }
        }
    })
}

function Customer_query() {
    console.log(customerId);
    $.ajax({
        url: url+"Customer_query",
        type: "get",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            projectId: projectId,
            customerId: customerId,
            startIndex: startIndex,
            pageCount: pageCount
        },
        success: function (data) {
            var me = JSON.parse(data.replace(/\[|]/g, ''));
            $(".user-name").html(me.customerName);
            $(".telephone").html(me.phone);
            //身份证信息打码
            // var str1 = me.idCard.substr(0,6)+"********"+me.idCard.substr(14,4);
            var str1 = me.idCard.replace(/(\d{6})(\d+)(\d{4})/, function (x, y, z, p) {
                var i = "";
                while (i.length < z.length) {
                    i += "*"
                }
                return y + i + p
            });
            $(".id-card").html(str1);
            $(".ownerAgent").html(me.ownerAgent);
            $(".rightCount").html(me.rightCount);
        }
    });
}
