var projectId = 1;
var customerId;
var startIndex = -1;
var pageCount = -1;
var sortIndex;

$(function () {
    CheckToken();


    //删除购物车
    $(".del-sure").on('touchstart',function () {
        var sv = [];
        $("input[name='cartItem']:checked").each(function(){
            var tv =$(this).val();
            sv.push(tv);
        });
        productId = sv.join(",");
        Cart_remove();
    });

    // 提交订单
    $(".submit").on('touchstart',function () {
        var sv = [];
        $("input[name='cartItem']:checked").each(function(){
            var tv =$(this).val();
            sv.push(tv);
        });
        productId = sv.join(",");

    })


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
    //删除按钮
    $(".del").click(function () {
        $(".del-dialog").removeClass("hide");
        $(".mask").show();
    });
    //确认删除
    $(".del-sure").click(function () {
        $(".mask").hide();
        $(".del-dialog").addClass("hide");
    });
    //取消删除
    $(".del-cancel").click(function () {
        $(".mask").hide();
        $(".del-dialog").addClass("hide");
    });
    // 关闭弹框
    $(".del-close").click(function () {
        $(".mask").hide();
        $(".del-dialog").addClass("hide");
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
};

// 购物车查询
function Cart_query() {
    $.ajax({
        url: "http://123.206.206.90:2511/AjaxService.svc/Cart_query",
        type: "post",
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

            console.log(data);
            var list = '';
            $.each(data, function (i, s) {
                list += '<div class="banner pl48">';
                list += '<i class="icon-sort my-handle"></i>';
                list += '<span class="saleStatus sellOut">已售</span>';
                list += '<input type="checkbox" name="cartItem" id="shopChoose'+i+'" value="'+s.productId+'">';
                list += '<label for="shopChoose'+i+'"></label>';
                list += '<p class="shopName">' + s.projectName + s.buildingNo + '栋' + s.unit + '单元' + s.productName + '室' + '</p>';
                list += '<p class="shopInfo"><span class="shopNum">' + s.modelName + '</span>';
                list += '<span class="shopType">' + s.modelType + '</span>';
                list += '<span class="shopArea">' + s.area + '</span>m²</p>';
                list += '<p class="price"><span class="price-icon">￥</span><span class="house-price">' + (s.totalMoney / 10000).toFixed(2) + '</span>万</p>';
                list += '<input type="hidden" name="productId" value="'+s.productId+'">';
                list += '<input type="hidden" name="sortIndex" value="'+s.sortIndex+'"></div>'
            });
            $(".g-scrollview").append(list);
        }
    })
};

// 拖动排序
function sortable() {
    var el = document.getElementById("sortable");
    var sortable = Sortable.create(el, {
        filter:".cartTip",
        animation: 300,
        draggable: ".banner",
        chosenClass: "sortable-drag",
        scroll:true,
        onEnd: function (evt) {
            sortIndex = $(evt.item).find('input[name="sortIndex"]').val();
            productId = $(evt.item).find('input[name="productId"]').val();
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
};

//删除购物车
function Cart_remove () {
    $.ajax({
        url: "http://123.206.206.90:2511/AjaxService.svc/Cart_remove",
        type: "post",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            projectId: projectId,
            customerId: customerId,
            productId: productId,
        },
        success: function (data) {
            if(data>0){
                YDUI.dialog.toast('删除成功', 'success', 1000);
                Cart_query();
            }
        }
    })
}