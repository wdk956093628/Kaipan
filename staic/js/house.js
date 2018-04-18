var projectId = $.cookie("projectId");
var buildingNo = 1;
var unit = 1;
var floorIndex = -1;
var modelId = -1;
var pickUserId = -1;
var userId = -1;
var productId;
var customerId;
var token;

$(function () {

    // 获取customerId
    CheckToken();
    // 获取楼栋
    Product_getBuildings();
    //获取单元
    Product_getUnits();
    // 获取房源列表
    Product_queryArray();

    // 底部抢房成功通知(30s刷新)
    setInterval(function () {
        dealSuccess();
    }, 30 * 1000);


    // 选择楼栋
    $(".loudong").on('click', 'li', function () {
        $(this).addClass("active").siblings().removeClass("active");
        buildingNo = $(this).val();
        unit = 1;
        Product_getUnits();
        Product_queryArray();
    });

    //选择单元
    $(".unit").on('click', 'li', function () {
        $(this).addClass("active").siblings().removeClass("active");
        unit = $(this).val();
        Product_queryArray();
    });


    // 添加购物车
    $(".addCart").on('touchstart', function () {
        Cart_add();
    });

    //立即购买弹框
    $(".buyHouse-active").click(function () {
        $(".mask").show();
        $(".dealAgreement").removeClass('hide');
        $(".house-dialog").addClass('hide');
        deal_agreement();
    });

    //确认购买
    $(".confirm-agreement").on('touchstart', function () {
        var isagree = $("#agreement").prop("checked");
        if(isagree == true){
            YDUI.dialog.loading.open('提交订单中');
            setTimeout(function () {
                YDUI.dialog.loading.close();
                Deal();
            }, 1000);
            $(".mask").hide();
            $(".dealAgreement").addClass('hide');
            $(".agreement").prop('checked',false);
        }else{
            YDUI.dialog.toast('请同意选房须知', 'none', 1000);
        }
    });

    //好的按钮
    $(".cancel").on('touchstart', function () {
        $(".mask").hide();
        $(".houseToCart").addClass('hide');
        $(".houseToOrder").addClass('hide');
        $(".dealAgreement").addClass('hide');
        $(".agreement").prop('checked',false);
    });

    //关闭图标
    $(".close").on('touchstart', function () {
        $(".mask").hide();
        $(".house-dialog").addClass('hide');
        $(".houseDetail-dialog").addClass('hide');
        $(".dealAgreement").addClass('hide');
        $(".agreement").prop('checked',false);
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
            Product_queryArray();
            $(".refresh").removeClass("refresh-active");
        }, 1000);
    });

});

// 获取customerId
function CheckToken() {
    token = $.cookie('token');
    $.ajax({
        url: url + "CheckToken",
        type: "post",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            token: token
        },
        success: function (data) {
            console.log(data)
            if (data > 0) {
                customerId = data;
                dealSuccess();
            } else {
                window.location.href = 'login.html'
            }
        }
    })
}

//楼栋查询
function Product_getBuildings() {
    $.ajax({
        url: url + "Product_getBuildings",
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
        url: url + "Product_getUnits",
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
    $.ajax({
        url: url + "Product_queryArray",
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
            var row = "";
            var sidebarH;
            var sideCount = [];
            var productW;
            var productArr = [];
            var productNameArr = [];
            var list = "";
            data = JSON.parse(data);
            $(".loudongTip").html(buildingNo + '栋' + ' - ' + unit + '单元');
            $.each(data, function (i, o) {
                sideCount.push(o.floorCount);
                productArr.push(o.productName.slice(-2));
                productNameArr.push(o.productName);
            });

            //根据总楼层的最大值判断侧边栏高度和行数
            sidebarH = Math.max.apply(null, sideCount);
            for (var k = sidebarH; k > 0; k--) {
                row += "<li class='product-row'></li>";
                side += "<li><span>" + k + "</span>F</li>";
            }
            $(".sidebar").html(side);
            $(".view-container").html(row);

            //根据房号的后面两位数判断最大的列数
            productW = Math.max.apply(null, productArr);
            productMin = Math.min.apply(null, productArr);
            $('.product-row').each(function (index) {
                var col = "";
                for (var j = productMin-1; j < productW; j++) {
                    if(j<10){
                        col += "<div class='house-item'><span class='houseNum'>" +
                            (sidebarH - index)+'0'+(j+1) + "</span></div>";
                    }else{
                        col += "<div class='house-item'><span class='houseNum'>" +
                            (sidebarH - index)+(j+1) + "</span></div>";
                    }

                }
                $(this).html(col);
                //点击房源
                $(".house-item").click(function () {
                    $(".mask").show();
                    $(".house-dialog").removeClass("hide");
                    productId = $(this).attr("value");
                    ProductDetails();
                    ProjectInfo_query();
                })
            });

            // 对比生成的div和房源
            var houseNumArr = "";
            $(".houseNum").each(function () {
                houseNumArr = $(this).html();
                if(productNameArr.indexOf($(this).html()) < 0){
                   $(this).html('');
                   $(this).parents(".house-item").off('click');
                }
            });

            $.each(data, function (v, o) {
                if (o.productStatus == 0) {
                    $(".houseNum").filter(":contains(" + o.productName + ")").first().parent(".house-item").attr("value", o.productId).addClass("yixuan");
                } else if (o.productStatus == 1) {
                    $(".houseNum").filter(":contains(" + o.productName + ")").first().parent(".house-item").attr("value", o.productId).addClass("yishou");
                } else if (o.productStatus == 2) {
                    $(".houseNum").filter(":contains(" + o.productName + ")").first().parent(".house-item").attr("value", o.productId).addClass("keshou");
                }
            });

            // $.each(data, function (i, o) {
            //     if (o.productStatus == 0) {
            //         list += '<li class="house-item yixuan" value="' + o.productId + '"><span class="houseNum">' + o.productName + '</span></li>';
            //     } else if (o.productStatus == 1) {
            //         list += '<li class="house-item yishou" value="' + o.productId + '"><span class="houseNum">' + o.productName + '</span></li>';
            //     } else if (o.productStatus == 2) {
            //         list += '<li class="house-item keshou" value="' + o.productId + '"><span class="houseNum">' + o.productName + '</span></li>';
            //     }
            //
            //     $(".view-container").html(list);
            // });
        }
    })
}

// 抢房成功通知
function dealSuccess() {
    $.ajax({
        url: url + "Deal_query",
        type: "get",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            projectId: projectId,
            customerId: -1
        },
        success: function (data) {
            data = JSON.parse(data);
            if (data.length > 0) {
                var o = data.reverse()[0];
                var tel = o.customerPhone.substr(0, 3) + "****" + o.customerPhone.substr(7, 4);
                $(".notice").html("恭喜" + tel + "抢房成功" +
                    o.projectName + o.buildingNo + "栋" + o.unit + "单元" + o.productName + "室")
            }
        }
    })
}

//底部弹框显示房源详情
function ProductDetails() {
    $.ajax({
        url: url + "Product_queryArray",
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
            ProjectInfo_query();
            Properties_query();
            data = JSON.parse(data)[0];
            $(".houseName").html(data.projectName + data.buildingNo + '栋' + data.unit + '单元' + data.productName + '室');
            $(".typeNum").html(data.modelName);
            $(".houseType").html(data.modelType);
            $(".houseArea").html((data.area / 1).toFixed(2) + '㎡');
            $(".unitPrice").html('￥' + (data.totalMoney / data.area).toFixed(2) + '万/m²');
            $(".house-price").html((data.totalMoney / 1).toFixed(2));
            $(".check-details").attr("value", data.productId);
            $(".orderNum").html($.cookie('lineIndex'));
            if (data.productStatus == 0 ){
                $(".buyHouse").show();
                $(".buyHouse-active").addClass('hide');
                $(".buyHouse").attr("disabled","disabled");
                $(".buyHouse").html("该房源待售");
            }else if(data.productStatus == 1){
                $(".buyHouse").show();
                $(".buyHouse-active").addClass('hide');
                $(".buyHouse").attr("disabled","disabled");
                $(".buyHouse").html("该房源已售");
            }
        }
    })
}

// 判端是否开盘
function ProjectInfo_query() {
    $.ajax({
        url: url + "ProjectInfo_query",
        type: "get",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            projectId: projectId
        },
        success: function (data) {
            console.log(data)
            var isBegin = JSON.parse(data)[0].isBegin;
            if (isBegin === 'True') {
                $(".buyHouse").hide();
                $(".buyHouse-active").removeClass('hide');
            } else {
                $(".buyHouse").show();
                $(".buyHouse-active").addClass('hide');
            }
        }
    })
}

//判断秒开
function Properties_query() {
    $.ajax({
        url: url + "Properties_query",
        type: "get",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            projectId: projectId
        },
        success: function (data) {
            var skipMode = JSON.parse(data)[0].skipMode;  //开盘方式; 0代表秒开; 不等于0代表分批;
            if (skipMode == 0) {
                $(".buy-order").html("");
            }else{

            }
        }
    })
}

//添加购物车
function Cart_add() {
    $.ajax({
        url: url + "Cart_add",
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
           ;
            $(".mask").show();
            $(".house-dialog").addClass("hide");
            $(".houseToCart").removeClass("hide");
            if (data == 1) {
                $(".house-tip").html("加入购物车成功");
            } else if (data == -101) {
                $(".house-tip").html("添加失败，购物车已满");
            } else if (data == -102) {
                $(".house-tip").html("添加失败，该房源已售或者待售");
            } else if (data == -103) {
                $(".house-tip").html("添加失败，该房源已在购物车");
            } else {
                YDUI.dialog.toast('加入购物车失败', 'error', '1000');
            }
        }
    })
}

//购买房源协议弹框
function deal_agreement() {
    $.ajax({
        url: url + "Product_queryArray",
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
            data = JSON.parse(data)[0];
            $(".dealHouseName").html(data.projectName + data.buildingNo + '栋' + data.unit + '单元' + data.productName + '室');
            $(".dealHouse-price").html((data.totalMoney / 1).toFixed(2));
            $(".typeNum").html(data.modelName);
            $(".houseType").html(data.modelType);
            $(".houseArea").html((data.area / 1).toFixed(2) + 'm²');
            $(".unitPrice").html('￥' + (data.totalMoney / data.area).toFixed(2) + '/m²');
        }
    })
}

//购买房源
function Deal() {
    $.ajax({
        url: url + "Deal",
        type: "get",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            projectId: projectId,
            customerId: customerId,
            productId: productId,
            userId: userId
        },
        success: function (data) {
            console.log(data)
            if (data > 0) {
                YDUI.dialog.toast('提交成功', 'success', 1000);
                setTimeout(function () {
                    Product_queryArray();
                }, 1000)
            } else if (data == 0) {
                YDUI.dialog.toast('认购数量达到上限', 'error', 1000);
            } else if(data == -101){
                YDUI.dialog.toast('开盘时间未到不能购买', 'error', 1000);
            }else if(data == -102){
                YDUI.dialog.toast('该房源已售或者待售', 'error', 1000);
            }else{
                YDUI.dialog.toast('提交失败', 'error', 1000);
            }
        }
    })
}

//获取房源详情
function Product_queryCartCount() {
    productId = window.location.search.split("=")[1];
    $.ajax({
        url: url + "Product_queryCartCount",
        type: "get",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            productId: productId
        },
        success: function (data) {
            data = JSON.parse(data);
            $.each(data, function (i, o) {
                $(".houseName").html(o.projectName + o.buildingNo + '栋' + o.unit + '单元' + o.productName + '室');
                $(".house-modelName").html(o.modelName + '户型');
                $(".house-modelType").html(o.modelType);
                $(".addCartCount").html('(' + o.cartProductCount + ')');
                $(".houseTotal").html((o.totalMoney / 1).toFixed(2) + '万');
                $(".builtArea").html((o.area / 1).toFixed(2) + '㎡');
                $(".builtUnitPrice").html('￥' + (o.totalMoney / o.area).toFixed(2) + '万/m²');
                $(".orientation").html('朝' + o.orientation);
                $(".floorIndex").html(o.floorIndex + '层');
                if (o.decorateMode == 0) {
                    $(".decorateMode").html("毛胚");
                } else if (o.decorateMode == 1) {
                    $(".decorateMode").html("简装");
                } else if (o.decorateMode == 2) {
                    $(".decorateMode").html("精装");
                }
                //户型介绍
                $(".houseIntroduce").html(o.reference);
                // 房源图片
                Model_query(o.modelName)
            })
        }
    })
}

//获取modelName
function Model_query(modelName) {
    projectId = $.cookie("projectId");
    $.ajax({
        url: url + "Model_query",
        type: "get",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            projectId: projectId,
            modelId: modelId,
            modelName: modelName
        },
        success: function (data) {
            data = JSON.parse(data);
            $.each(data, function (i, o) {
                //户型图片
                getModelphoto(o.pictures);
            });
        }
    });
}

//查询户型图片
function getModelphoto(photoId) {
    $.ajax({
        url: photoUrl + 'getPhotos',
        type: 'post',
        crossDomain: true,
        data: {
            photoId: photoId,
            photoType: 2,
            userName: 1,
            userKey: 1
        },
        success: function (data) {
            if (data.data.data == "") {
                var noPic = '<img src="../staic/images/noPic.png" alt="">';
                $(".hd-content").append(noPic);
            } else {
                var p = "";
                $.each(data.data.data, function (i, o) {
                    p += '<div class="swiper-slide">';
                    p += '<img class="hd-img" src=' + o.photoUrl + ' alt="户型图">';
                    p += '</div>';
                });
                $(".hd-content").html(p);
            }
        }
    })
}