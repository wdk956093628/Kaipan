var projectId = 1;
var customerId;
var sortIndex;
var userId = -1;
var productId;
var productIds = '';
var startIndex = -1;
var pageCount = -1;

$(function () {
    CheckToken();

    //删除购物车
    $(".del").on('touchstart', function () {
        var sv = [];
        var tip = "";
        $("input[name='cartItem']:checked").each(function () {
            var tv = $(this).val();
            tip = $(this).parents(".banner").children(".shopName").html();
            sv.push(tv);
        });
        if (sv.length === 0) {
            YDUI.dialog.toast('请选择房源', 'error', '1000')
        } else if (sv.length === 1) {
            $(".mask").show();
            $(".del-shopName").html(tip);
            $(".del-confirm").html("您真的确定删除吗？");
            productIds = sv.join(",");
        } else if (sv.length > 1) {
            $(".mask").show();
            $(".del-shopName").html("s");
            $(".del-confirm").html("您确定删除选中的"+sv.length+"套房源？");
            productIds = sv.join(",");
        }
        $(".del-sure").on('touchstart',function () {
            Cart_removeBatch();
        })
    });

    // 提交订单
    $(".submit").on('touchstart', function () {
        var sv = [];
        $("input[name='cartItem']:checked").each(function () {
            var tv = $(this).val();
            sv.push(tv);
        });
        productIds = sv.join(",");
        DealBatch();
    });

    //编辑按钮
    $(".edit").click(function () {
        $(".bottom").hide();
        $(".editbar").show();
        $(".shopTip").hide();
        $(".editTip").show();

        // 排序
        $(".saleStatus").hide();
        $(".icon-sort").show();
        $(".g-scrollview").attr("id", "sortable");
        sortable()
    });
    //完成按钮
    $(".complete").click(function () {
        $(".bottom").show();
        $(".editbar").hide();
        $(".shopTip").show();
        $(".editTip").hide();

        // 关闭排序
        $(".saleStatus").show();
        $(".icon-sort").hide();
        $(".g-scrollview").removeAttr("id");
    });
    //确认删除
    $(".del-sure").click(function () {
        $(".mask").hide();
    });

    //取消删除
    $(".del-cancel").click(function () {
        $(".mask").hide();
    });
    // 关闭弹框
    $(".del-close").click(function () {
        $(".mask").hide();
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
                console.log(data);
                Cart_query();
            } else {
                window.location.href = '../html/login.html'
            }
        }
    })
}

// 购物车查询
function Cart_query() {
    $.ajax({
        url: "http://123.206.206.90:2511/AjaxService.svc/Cart_query",
        type: "post",
        async: false,
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            projectId: projectId,
            customerId: customerId,
            startIndex: startIndex,
            pageCount: pageCount
        },
        success: function (data) {
            data = JSON.parse(data);
            if(data.length>0){
                var list = '<div class="cartTip">' +
                    '<p class="shopTip">您当前最多支持提交一套房源订单</p>' +
                    '<p class="editTip hide">您可以长按房源拖动进行排序</p></div>';
                $.each(data, function (i, s) {
                    list += '<div class="banner pl48">';
                    list += '<i class="icon-sort my-handle"></i>';
                    list += '<span class="saleStatus sellOut">已售</span>';
                    list += '<input type="checkbox" name="cartItem" id="shopChoose' + i + '" value="' + s.productId + '">';
                    list += '<label for="shopChoose' + i + '"></label>';
                    list += '<p class="shopName">' + s.projectName + s.buildingNo + '栋' + s.unit + '单元' + s.productName + '室' + '</p>';
                    list += '<p class="shopInfo"><span class="shopNum">' + s.modelName + '</span>';
                    list += '<span class="shopType">' + s.modelType + '</span>';
                    list += '<span class="shopArea">' + s.area + '</span>m²</p>';
                    list += '<p class="price"><span class="price-icon">￥</span><span class="house-price">' + (s.totalMoney / 10000).toFixed(2) + '</span>万</p>';
                    list += '<input type="hidden" name="productId" value="' + s.productId + '">';
                    list += '<input type="hidden" name="sortIndex" value="' + s.sortIndex + '"></div>'
                });
                $(".g-scrollview").html(list);
            }else{
                $(".g-scrollview").html("<p class='noCartTip'>当前购物车没有房源</p>");
            }

        }
    })
}

// 拖动排序
function sortable() {
    var el = document.getElementById("sortable");
    var sortable = Sortable.create(el, {
        filter: ".cartTip",
        animation: 300,
        draggable: ".banner",
        chosenClass: "sortable-drag",
        scroll: true,
        onEnd: function (evt) {
            productId = $(evt.item).find('input[name="productId"]').val();
            sortIndex = $(evt.item).find('input[name="sortIndex"]').val();
            Cart_insert();
        }
    });
}

// 购物车拖动
function Cart_insert() {

    $.ajax({
        url: "http://123.206.206.90:2511/AjaxService.svc/Cart_insert",
        type: "post",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            projectId: projectId,
            customerId: customerId,
            productId: productId,
            sortIndex: sortIndex
        },
        success: function (data) {
            console.log(data)
        }
    })
}

//删除购物车
function Cart_removeBatch() {

    $.ajax({
        url: "http://123.206.206.90:2511/AjaxService.svc/Cart_removeBatch",
        type: "post",
        async: false,
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            projectId: projectId,
            customerId: customerId,
            productIds: productIds,
        },
        success: function (data) {
            if (data > 0) {
                YDUI.dialog.toast('删除成功', 'success', 800);
                setTimeout(function () {
                    window.location.reload();
                },1000)
            }else{
                YDUI.dialog.toast('删除失败', 'error', 1000);
            }
        }
    })
}

//提交订单
function DealBatch() {

    $.ajax({
        url: "http://123.206.206.90:2511/AjaxService.svc/Deal",
        type: "post",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            projectId: projectId,
            customerId: customerId,
            productIds: productIds,
            userId: userId
        },
        success: function (data) {
            if (data > 0) {
                YDUI.dialog.toast('提交成功', 'success', 1000);
                setTimeout(function () {
                    window.location.reload();
                },1000)
            }else{
                YDUI.dialog.toast('提交失败', 'error', 1000);
            }
        }
    })
}