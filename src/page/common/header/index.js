/**
 * Created by Administrator on 2017/7/12.
 */
'use strict';

require('./index.css');
var _mm     = require('util/mm.js');
//  通用页面头部
var header  = {
    init : function(){
        this.bindEvent();
        this.onLoad();
    },
    onLoad : function(){
        var keyword = _mm.getUrlParam('keyword');
        //如果keyword 存在 则回填输入框
        if(keyword){
            $('#search-input').val(keyword);
        };
    },
    bindEvent : function(){
        var _this=this;
        //点击搜索提交
        $("#search-btn").click(function(){
            _this.searchSubmit();
        });
        //按回车 触发提交
        $("#search-input").keyup(function(e){
            if(e.keyCode === 13){
                _this.searchSubmit();
            }
        });
    },
    //搜索的提交
    searchSubmit : function(){
        var keyword = $.trim($('#search-input').val());
        //如果提交的时候有keyword 正常跳转到list 页
        if(keyword){
            window.location.href = './list.html?keyword='+keyword;
        }
        //如果key 为空 ，直接返回首页
        else {
            _mm.goHome();
        }
    }
};
header.init();