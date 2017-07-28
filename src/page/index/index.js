/**
 * Created by Administrator on 2017/7/10.
 */

'use strict';
require('page/common/header/index.js');
require('./index.css');
require('page/common/nav/index.js');
require('util/slider/index.js');
var navSide          = require('page/common/nav-side/index.js');
var templateBanner   = require('./banner.string');
var _mm              = require('util/mm.js');

/*初始化slider 轮播图*/
$(function(){
    //渲染banner
    var bannerHtml = _mm.renderHtml(templateBanner);
    $('.banner-con').html(bannerHtml);
    //初始化banner
    var $slider = $('.banner').unslider({
        dots : true
    });
    //前一张或后一张的事件绑定
    $('.banner-con .banner-arrow').click(function(){
        var forward = $(this).hasClass('prev') ? 'prev' : 'next';
        //unslider 插件文档给出的方法
        $slider.data('unslider')[forward]();
    });
});



