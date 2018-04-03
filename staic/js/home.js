var projectId = 1;
var customerId;
var startIndex = -1;
var pageCount = -1;


$(function () {
    CheckToken();
    autoSort();
    ProjectInfo_query();
    Model_query();

    //关闭弹出框
    $(".close").click(function () {
        $(".mask").hide();
        $(".rockNumTip").hide();
    });
    $(".know").click(function () {
        $(".mask").hide();
        $(".rockNumTip").hide();
    });
});

//获取customerId
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
            customerId = data;
            autoSort()
        }
    })
}

//进入首页，自动摇号
function autoSort() {
    $.ajax({
        url: "http://123.206.206.90:2511/AjaxService.svc/AutoSort",
        type: "post",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            projectId: projectId,
            customerId: customerId
        },
        success: function (data) {
            console.log(data);
            if (data >= 1) {
                $(".lineIndex").html(data);
                if ($(".lineIndex").html() == "") {
                    $(".mask").show();
                    $(".rockNumTip").show();
                    $(".rockNum-result").html(data)
                }
            }
        }
    });
}


//首页楼盘信息展示
function ProjectInfo_query() {
    $.ajax({
        url: "http://123.206.206.90:2511/AjaxService.svc/ProjectInfo_query",
        type: "post",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            projectId: projectId
        },
        success: function (data) {
            console.log(data);
            var data = JSON.parse(data.replace(/\[|]/g, ''));
            var timer = data.openTime.split(" ");
            var year = timer[0].split("/");
            var hour = timer[1].split(":");
            $(".rockNum-title").html(data.projectName);
            $(".loupanName").html(data.projectName);
            $(".loupan-adress").html(data.projectAddress);
            //开盘时间
            $(".year").html(year[0]);
            $(".month").html(year[1]);
            $(".day").html(year[2]);
            $(".hour").html(hour[0]);
            $(".minute").html(hour[1]);
            $(".second").html(hour[2]);
            //开盘规则
            $(".kaipan-rules").html(data.openRule);
            // 楼盘信息
            $(".build-address").html(data.projectAddress);
            $(".developer").html(data.developer);
            $(".manager").html(data.manager);
            $(".households").html(data.totalCount+'户');
            $(".land-area").html(data.totalArea+'㎡');
            // 联系方式
            $(".dynatown").html(data.phone);
            $(".telbut").attr("href", "tel:" + data.phone);
        }
    });
}

// 户型信息
function Model_query() {
    $.ajax({
        url: "http://123.206.206.90:2511/AjaxService.svc/Model_query",
        async: true,
        type: "post",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            projectId: projectId,
            modelId: -1,
            modelName: ""
        },
        success: function (data) {
            data = JSON.parse(data);
            // console.log(data);
            var list = "";
            $.each(data, function (i, o) {
                list += '<div class="ht-item swiper-slide">';
                list += '<div class="floor-plans">';
                list += '<span class="typeCode">' + o.modelName + '</span>';
                list += '<img class="ht-img" src=' + o.pictures + ' alt=户型图>';
                list += '</div>';
                list += '<p class="huxing-info"><span class="houseType">' + o.modelType + '</span>';
                list += '<p><span class="houseAmount">'+o.count+'套</span></p>';
                list += '</div>';
            });
            $(".ht-content").html(list);
        }
    });
}