/**
 * Created by Administrator on 2017/7/18.
 */
'use strict';


require('./index.css');
require('page/common/header/index.js');
require('page/common/nav/index.js');
var _payment        = require('service/payment-service.js');
var _mm             = require('util/mm.js');
var templateIndex   = require('./index.string');


//page 逻辑部分
var page = {
    data : {
        orderNumber : _mm.getUrlParam('orderNumber')
    },
    init  : function(){
        this.onLoad();

    },
    onLoad : function(){
        this.loadPaymentInfo();
    },
    //加载订单详情
    loadPaymentInfo : function(){
        var paymenthtml     = '',
            _this           = this ,
            $pageWrap        = $(".page-wrap");
        $pageWrap.html('<div class="loading"></div>');
        _payment.getPaymentInfo(this.data.orderNumber,function (res) {

            paymenthtml = _mm.renderHtml(templateIndex,res);
            $pageWrap.html(paymenthtml);
            //监听订单是否支付
            _this.listenOrderStatus();
        },function(errMsg){
            $pageWrap.html("<p class='err-tip'>"+errMsg+"</p>")
        });
    },
    //监听订单状态
    listenOrderStatus : function(){
        var _this = this ;
        this.paymentTimer = window.setInterval(function(){
            _payment.getPaymentStatus(_this.data.orderNumber,function (res) {
                    if(res == true){
                        window.location.href =
                            './result.html?type=payment&orderNumber='+_this.data.orderNumber;
                    }
            },function () {

            });
        },5e3);// 5 秒 监听一次
     }
};
$(function(){
    page.init();
});

