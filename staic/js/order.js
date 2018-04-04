var projectId = 1;
var productId = -1;
var startIndex = -1;
var pageCount = -1;

$(function () {
    CheckToken();
    Customer_queryOrdered();

    $(".order-item").click(function () {
        window.location.href = "orderDetails.html"
    });

});

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
                console.log(data);
                Deal_query();
        }
    })
};

function Customer_queryOrdered() {
    $.ajax({
        url: "http://123.206.206.90:2511/AjaxService.svc/Customer_queryOrdered",
        type: "post",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            projectId:projectId,
            startIndex:startIndex,
            pageCount:pageCount
        },
        success:function (data) {
            console.log(data)
        }
    })
}

function Deal_query() {
    $.ajax({
        url: "http://123.206.206.90:2511/AjaxService.svc/Deal_query",
        type: "post",
        dataType: 'jsonp',
        jsonp: "callback",
        data: {
            projectId:projectId,
            customerId:customerId,
            productId:productId,
            startIndex:startIndex,
            pageCount:pageCount
        },
        success:function (data) {
            console.log(data)
        }
    })
}
