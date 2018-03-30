var projectId = 1;
var buildingNo = 1;
var unit = 1;
var floorIndex = -1;
var modelId = -1;

$(function () {

    // 获取楼栋
    Product_getBuildings();
    //获取单元
    Product_getUnits();
    // 获取房源信息
    Product_queryArray();

    // 选择楼栋和单元

    $(".loudong").on('click', 'li', function () {
        $(this).addClass("active").siblings().removeClass("active");
        buildingNo = $(this).val();
        Product_getUnits();
        Product_queryArray();
    });

    $(".unit").on('click', 'li', function () {
        $(this).addClass("active").siblings().removeClass("active");
        unit = $(this).val();
        Product_queryArray();
    });


    // 生成展示房源
    var con = $(".view-container");
    var item = $(".house-item");
    for (var i = 0; i < 71; i++) {
        var list = item.clone(true);
        con.append(list)
    }

    //点击房源出现弹框
    $(".house-item").click(function () {
        $(".mask").show();
        $(".house-dialog").removeClass("hide");
    });

    //查看详情
    $(".check-details").click(function () {
        window.location.href = 'houseDetails.html';
    });

    //添加到购物车
    $(".addCart").click(function () {
        $(".house-dialog").addClass("hide");
        $(".houseToCart").removeClass("hide");
        $(".mask").show();
    });

    //好的
    $(".house-cancel").click(function () {
        $(".houseToCart").addClass("hide");
        $(".houseToOrder").addClass("hide");
        $(".mask").hide();
    });

    //关闭图标
    $(".close").click(function () {
        $(".house-dialog").addClass("hide");
        $(".houseDetail-dialog").addClass("hide");
        $(".mask").hide();
    });

    //立即抢房
    $(".buyHouse").click(function () {
        $(".house-dialog").addClass("hide");
        $(".mask").show();
        $(".houseToOrder").removeClass("hide");
    });

    //刷新
    $(".refresh").on('touchstart', function () {
        $(this).addClass("refresh-active");
        setTimeout(function () {
            console.log("1");
            window.location.reload()
        }, 2000)//延迟刷新
    });

});

function Product_getBuildings() {
    $.ajax({
        url: "http://123.206.206.90:2511/AjaxService.svc/Product_getBuildings",
        // async: false,
        type: "post",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            projectId: projectId
        },
        success: function (data) {
            data = JSON.parse(data);
            // console.log(data);
            var bd = "";
            $.each(data, function (i, loudong) {
                bd += '<li value=' + loudong.buildingNo + '>' + loudong.buildingNo + '栋</li>'
            });
            $(".loudong").html(bd);
            $(".loudong").find("li").eq(0).addClass("active");
        }
    })
}

function Product_getUnits() {
    console.log("buildingNo" + buildingNo)
    $.ajax({
        url: "http://123.206.206.90:2511/AjaxService.svc/Product_getUnits",
        // async: false,
        type: "post",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            projectId: projectId,
            buildingNo: 1
        },
        success: function (data) {
            data = JSON.parse(data);
            // console.log(data);
            var un = "";
            $.each(data, function (i, units) {
                un += '<li value=' + units.unit + '>' + units.unit + '单元</li>'
            });
            $(".unit").html(un);
            $(".unit").find("li").eq(0).addClass("active");
        }
    })
}

function Product_queryArray() {
    console.log("buildingNo" + buildingNo);
    console.log("unit" + unit);
    $.ajax({
        url: "http://123.206.206.90:2511/AjaxService.svc/Product_query",
        type: "post",
        // async: false,
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            projectId: projectId,
            buildingNo: buildingNo,
            unit: unit,
            floorIndex: floorIndex,
            modelId: modelId
        },
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            var count = "",
                side = "";
            $.each(data,function (i, o) {
                count = Math.max(o.floorCount);
                side += "<li><span>" + (i+1) + "</span>F</li>"
            });
            $(".sidebar").html(side)
        }
    })
}