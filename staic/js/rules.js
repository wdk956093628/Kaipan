var projectId = $.cookie("projectId");
var customerId;
var token = "";
var lineIndex;

$(function () {

    CheckToken();

    //倒计时
    var rockTime = 5;
    var timer = setInterval(function () {
        rockTime--;
        if (rockTime === 0) {
            clearInterval(timer);
            $(".rockNum").addClass("but");
            $(".rockNum").addClass("rockNum-active");
            $(".rockNum").html("开始摇号");
            $(".rockNum").removeAttr("disabled");
        } else {
            $(".rockTime").html(rockTime);
        }
    }, 1000);

    //点击开始摇号
    $(".rockNum").on('click',function () {
        autoSort();
    })
});

function CheckToken() {
    token = $.cookie("token");
    $.ajax({
        url: url+"CheckToken",
        type: "post",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            token: token
        },
        success: function (data) {
            if (data > 0) {
                customerId = data;
            } else {
                window.location.href = "login.html";
            }
        }
    })
}

function autoSort() {
    $.ajax({
        url: url+"AutoSort",
        type: "get",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            projectId: projectId,
            customerId: customerId
        },
        success: function (data) {
            if (data > 0) {
                $.cookie("sortCode",data,{ expires: 1,path: '/'});
            }
        }
    });
}