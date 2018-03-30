$(function () {
    //开始摇号
    $(".rockNum").click(function () {
        $(".mask").show();
        $(".rockNumTip").show();
    });
    $(".close").click(function () {
        $(".mask").hide();
        $(".rockNumTip").hide();
    });
    $(".know").click(function () {
        $(".mask").hide();
        $(".rockNumTip").hide();
    });
})