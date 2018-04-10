var phone = "";
var idCard = "";
var shortCode = "";
var $getCode = $('#J_GetCode');

$(document).ready(function () {
    //输入密码出现提示图标
    // var eye = $(".showTip");
    // var psd = $("#password");
    // psd.focus(function () {
    //     if (psd.val().length > 0) {
    //         eye.removeClass('hide')
    //     }else{
    //         eye.addClass('hide')
    //     }
    // }).keyup(function () {
    //     $(this).triggerHandler('focus');
    // });

    // 点击图标显示或隐藏密码
    // eye.off('click').on('click', function () {
    //     if (eye.hasClass('eyeShow')) {
    //         eye.removeClass('eyeShow').addClass('eyeHide');//密码可见
    //         psd.prop('type', 'password');
    //     } else {
    //         eye.removeClass('eyeHide').addClass('eyeShow');//密码不可见
    //         psd.prop('type', 'text');
    //     }
    // });

    // 验证手机号码
    $("#telephone").blur(function () {
        var tel = $(this).val();
        var reg = /^1[34578][0-9]{9}$/;
        if (tel.length != 0) {
            if (!reg.test(tel)) {
                $(".psdTip").html("<span style='color:#f00;'>*</span>请输入正确的手机号");
            }
        } else {
            $(".psdTip").html("<span style='color:#f00;'>*</span>请输入手机号");
        }
    }).focus(function () {
        $(".psdTip").html("");
    });

    // 验证身份证号码
    $("#id_card").blur(function () {
        var idval = $(this).val();
        var reg2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
        if (idval.length != 0) {
            if (!reg2.test(idval)) {
                $(".psdTip").html("*请输入正确的身份证号码");
            }
        } else {
            $(".psdTip").html("*请输入身份证号码");
        }
    }).focus(function () {
        $(".psdTip").html("");
    });


    /*获取短信验证码倒计时*/
    /* 定义参数 */
    $getCode.sendCode({
        disClass: 'btn-disabled',
        secs: 60,
        run: false,
        runStr: '{%s}秒后重新获取',
        resetStr: '重新获取验证码'
    });

    $getCode.on('touchstart', function () {
        phone = $("#telephone").val();
        idCard = $("#id_card").val();
        if (phone != "" && idCard != "") {
            storeShortCode();
        } else {
            $(".psdTip").html("请输入手机号码以及身份证号码");
        }
    });

    // 登录
    $(".login_but").on('touchstart', function () {
        CheckShortCode();
    });

});

//发送验证码
function storeShortCode() {

    $.ajax({
        url: "http://123.206.206.90:2511/AjaxService.svc/Customer_storeShortCode",
        type: "post",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            phone: phone,
            idCard: idCard
        },
        success: function (data) {
            if (data >= 0) {
                YDUI.dialog.loading.open('发送中');
                setTimeout(function () {
                    YDUI.dialog.loading.close();
                    $getCode.sendCode('start');
                    YDUI.dialog.toast('已发送', 'success', 1000);
                    $("#verify").focus()
                }, 1000);
            } else {
                YDUI.dialog.toast('本次开盘未找到您的客户信息', 'none', 1000);
            }
        }
    })
}

//检查验证码
function CheckShortCode() {
    phone = $("#telephone").val();
    idCard = $("#id_card").val();
    shortCode = $("#verify").val();
    // /*判断重复提交*/
    // if (loginSum == 1) {
    //     //重复提交
    //     $(".psdTip").html("正在登陆，请稍候");
    //     return;
    // }
    // if (loginSum == 0) {
    //     loginSum = 1;
    // }

    $.ajax({
        url: "http://123.206.206.90:2511/AjaxService.svc/CheckShortCode",
        type: "post",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            phone: phone,
            idCard: idCard,
            shortCode: shortCode
        },
        success: function (data) {
            console.log(data);
            $.cookie("token", data, {expires: 1, path: '/'});
            // CheckToken()
        }
    })
}

//检查token
function CheckToken() {
    var token = $.cookie('token');
    $.ajax({
        url: "http://123.206.206.90:2511/AjaxService.svc/CheckToken",
        type: "post",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            token: token
        },
        success: function (data) {
            if (data >= 0) {
                console.log(data);
               setTimeout(function () {
                   window.location.href = "../html/rules.html";
               },1000)
            }
        }
    })
}