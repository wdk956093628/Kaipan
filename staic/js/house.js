var projectId = 1;
var buildingNo = 1;
var unit = 1;
var floorIndex = -1;
var modelId = -1;
var pickUserId = -1;
var userId = -1;
var productId;
var customerId;

$(function () {

    // 获取customerId
    CheckToken();
    // 获取楼栋
    Product_getBuildings();
    //获取单元
    Product_getUnits();
    // 获取房源列表
    Product_queryArray();

    // 选择楼栋
    $(".loudong").on('click', 'li', function () {
        $(this).addClass("active").siblings().removeClass("active");
        buildingNo = $(this).val();
        Product_queryArray();
    });

    //选择单元
    $(".unit").on('click', 'li', function () {
        $(this).addClass("active").siblings().removeClass("active");
        unit = $(this).val();
        Product_queryArray();
    });

    //点击房源
    $(".view-container").on('touchstart', 'li', function () {
        $(".mask").show();
        $(".house-dialog").removeClass("hide");
        productId = $(this).attr("value");
        ProductDetails();
    });

    // 添加购物车
    $(".addCart").on('touchstart', function () {
        Cart_add();
    });

    //立即购买
    $(".buyHouse").on('touchstart', function () {
        DealBatch();
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
        window.location.href = "houseDetails.html?productId=" + productId + "";
    });
    //刷新
    $(".refresh").on('touchstart', function () {
        $(this).addClass("refresh-active");
        //延迟刷新
        setTimeout(function () {
            console.log("1");
            Product_queryArray();
            $(".refresh").removeClass("refresh-active");
        }, 1000);
    });

});

// 获取customerId
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
            if (data > 0) {
                customerId = data;
            } else {
                window.location.href = '../html/login.html'
            }
        }
    })
}

//楼栋查询
function Product_getBuildings() {
    $.ajax({
        url: "http://123.206.206.90:2511/AjaxService.svc/Product_getBuildings",
        type: "get",
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
        type: "get",
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

//房源列表
function Product_queryArray() {
    // console.log("buildingNo:" + buildingNo);
    // console.log("unit:" + unit);
    $.ajax({
        url: "http://123.206.206.90:2511/AjaxService.svc/Product_queryArray",
        type: "get",
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
            var content = "";
            var count = "";
            var item = "";
            data = JSON.parse(data);
            console.log(data);
            $(".loudongTip").html(buildingNo + '栋' + ' - ' + unit + '单元');
            $.each(data, function (i, o) {
                count = Math.max(o.floorCount);
            });
            //侧边栏
            for (var k = 0; k < count; k++) {
                side += "<li><span>" + (k + 1) + "</span>F</li>";
                content +="<li style='width:100%;height: 1rem'></li>"
            }
            $(".sidebar").html(side);
            $(".view-container").html(content);

            $.each(data,function (i,o) {
                if (o.productStatus == 0) {
                    item += '<li class="house-item yixuan" value="' + o.productId + '"><span class="houseNum">' + o.productName + '</span></li>';
                } else if (o.productStatus == 1) {
                    item += '<li class="house-item yishou" value="' + o.productId + '"><span class="houseNum">' + o.productName + '</span></li>';
                } else if (o.productStatus == 2) {
                    item += '<li class="house-item keshou" value="' + o.productId + '"><span class="houseNum">' + o.productName + '</span></li>';
                }
                if(o.floorIndex == 1){

                }
                $(".view-container").html(item);
            })
        }
    })
}

//弹框显示房源详情
function ProductDetails() {

    $.ajax({
        url: "http://123.206.206.90:2511/AjaxService.svc/Product_queryArray",
        type: "get",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            productId: productId,
            projectId: projectId,
            buildingNo: buildingNo,
            unit: unit,
            floorIndex: floorIndex,
            modelId: modelId
        },
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            $.each(data, function (i, o) {
                $(".houseName").html(o.projectName + o.buildingNo + '栋' + o.unit + '单元' + o.productName + '室');
                $(".typeNum").html(o.modelName + o.modelId);
                $(".houseType").html(o.modelType);
                $(".houseArea").html(o.area + '㎡');
                $(".unitPrice").html('￥' + (o.unitPrice / 10000).toFixed(2) + '/m²');
                $(".house-price").html((o.totalMoney / 10000).toFixed(2));
                $(".check-details").attr("value", o.productId);
            });
        }
    })
}

//添加购物车
function Cart_add() {
    console.log(customerId)
    $.ajax({
        url: "http://123.206.206.90:2511/AjaxService.svc/Cart_add",
        type: "get",
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
            $(".mask").show();
            $(".house-dialog").addClass("hide");
            $(".houseToCart").removeClass("hide");
            if (data == 1) {
                $(".house-tip").html("加入购物车成功");
            } else if (data == 0) {
                $(".house-tip").html("添加失败，该房源已售或者待售");
            } else if (data == -101) {
                $(".house-tip").html("添加失败，购物车已满");
            } else {
                YDUI.dialog.toast('加入购物车失败', 'error', '1000');
            }
        }
    })
}

//购买房源
function DealBatch() {

    $.ajax({
        url: "http://123.206.206.90:2511/AjaxService.svc/DealBatch",
        type: "get",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            projectId: projectId,
            customerId: customerId,
            productIds: productId,
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

//获取房源详情
function Product_queryCartCount() {

    productId = window.location.search.split("=")[1];

    $.ajax({
        url: "http://123.206.206.90:2511/AjaxService.svc/Product_queryCartCount",
        type: "get",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            productId:productId
        },
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            $.each(data, function (i, o) {
                $(".houseName").html(o.projectName + o.buildingNo + '栋' + o.unit + '单元' + o.productName + '室');
                $(".house-modelName").html(o.modelName + o.modelId + '户型');
                $(".house-modelType").html(o.modelType);
                $(".addCartCount").html(o.cartProductCount);
                $(".houseTotal").html((o.totalMoney / 10000).toFixed(2));
                $(".builtArea").html((o.area / 1).toFixed(2) + '㎡');
                $(".builtUnitPrice").html((o.unitPrice / 10000).toFixed(2) + '/m²');
                $(".orientation").html(o.orientation);
                $(".floorIndex").html(o.floorIndex+'层');
                if(o.decorateMode == 0){
                    $(".decorateMode").html("毛胚");
                }else if(o.decorateMode == 1){
                    $(".decorateMode").html("简装");
                }else if(o.decorateMode == 2){
                    $(".decorateMode").html("精装");
                }
                //户型介绍
                $(".houseIntroduce").html(o.reference);
            })
        }
    })
}