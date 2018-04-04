var projectId = 1;
var buildingNo = 1;
var unit = 1;
var floorIndex = -1;
var modelId = -1;
var productId = 1;
var pickUserId = -1;
var customerId = 504;
var userId = -1;

$(function () {

    // 获取楼栋
    Product_getBuildings();
    //获取单元
    Product_getUnits();
    // 获取房源信息
    Product_queryArray();

    //点击房源
    $(".view-container").on('touchstart', 'li', function () {
        $(".mask").show();
        $(".house-dialog").removeClass("hide");

    });

    // 添加购物车
    $(".addCart").on('touchstart', function () {
        Cart_add();
    });

    //立即购买
    $(".buyHouse").on('touchstart', function () {
        Deal();
    });

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
    //好的按钮
    $(".house-cancel").on('touchstart', function () {
        $(".mask").hide();
        $(".houseToCart").addClass("hide");
        $(".houseToOrder").addClass("hide");
    });
    //关闭图标
    $(".close").on('touchstart', function () {
        $(".mask").hide();
        $(".house-dialog").addClass("hide");
        $(".houseDetail-dialog").addClass("hide");
    });
    //查看详情
    $(".check-details").click(function () {
        window.location.href = 'houseDetails.html';
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

//楼栋查询
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
            data = JSON.parse(data).reverse();
            var bd = "";
            $.each(data, function (i, loudong) {
                bd += '<li value=' + loudong.buildingNo + '>' + loudong.buildingNo + '栋</li>'
            });
            $(".loudong").html(bd);
            $(".loudong").find("li").eq(0).addClass("active");
        }
    })
}

//单元查询
function Product_getUnits() {

    $.ajax({
        url: "http://123.206.206.90:2511/AjaxService.svc/Product_getUnits",
        // async: false,
        type: "post",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            projectId: projectId,
            buildingNo: buildingNo
        },
        success: function (data) {
            data = JSON.parse(data).reverse();
            var un = "";
            $.each(data, function (i, units) {
                un += '<li value=' + units.unit + '>' + units.unit + '单元</li>'
            });
            $(".unit").html(un);
            $(".unit").find("li").eq(0).addClass("active");
        }
    })
}

//房源查询
function Product_queryArray() {
    console.log("buildingNo:" + buildingNo);
    console.log("unit:" + unit);
    $.ajax({
        url: "http://123.206.206.90:2511/AjaxService.svc/Product_query",
        type: "post",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            productId: -1,
            projectId: projectId,
            buildingNo: buildingNo,
            unit: unit,
            floorIndex: floorIndex,
            modelId: modelId
        },
        success: function (data) {
            var side = "";
            var count = "";
            var h = "";
            data = JSON.parse(data);
            console.log(data);
            $(".loudongTip").html(buildingNo + '栋' + ' - ' + unit + '单元');

            $.each(data, function (i, o) {
                h += '<li class="house-item"><span class="houseNum">' + o.productName + '</span></li>';
                $(".view-container").html(h);
                if(o.productStatus == 0){
                    $(".house-item").addClass("keshou");
                }else if(o.productStatus == 1){
                    $(".house-item").addClass("yixuan");
                }else if(o.productStatus == 2){
                    $(".house-item").addClass("yishou");
                }
                count = Math.max(o.floorCount);
            });

            //侧边栏
            for (var k = 0; k < count; k++) {
                side += "<li><span>" + (k + 1) + "</span>F</li>";
            }
            $(".sidebar").html(side)
        }
    })
}

function searchArr(arr,key,value){
    var arr1 = [];
    arr1 += arr.filter(item=>item[key]==value);
    console.log(arr1)
}

//添加购物车
function Cart_add() {
    $.ajax({
        url: "http://123.206.206.90:2511/AjaxService.svc/Cart_add",
        type: "post",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            projectId: projectId,
            customerId: customerId,
            productId: productId,
            pickUserId: pickUserId
        },
        success: function (data) {
            console.log(data);
            if (data > 0) {
                $(".mask").show();
                $(".house-dialog").addClass("hide");
                $(".houseToCart").removeClass("hide");
            } else {
                YDUI.dialog.toast('加入购物车失败', 'error', '1000');
            }
        }
    })
}

//购买房源
function Deal() {

    $.ajax({
        url: "http://123.206.206.90:2511/AjaxService.svc/DealBatch",
        type: "post",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            projectId: projectId,
            customerId: customerId,
            productId: productId,
            userId: userId
        },
        success: function (data) {
            console.log(data);
            if (data > 0) {
                $(".house-dialog").addClass("hide");
                $(".mask").show();
                $(".houseToOrder").removeClass("hide");
            } else {
                YDUI.dialog.toast('抢房失败请重试', 'error', '1000');
            }
        }
    })
}