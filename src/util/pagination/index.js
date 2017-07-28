/**
 * Created by Administrator on 2017/7/15.
 */
'use strict';
require('./index.css');
var templatePagination = require('./index.string');
var _mm                = require('util/mm.js');

var Pagination = function(){
    var _this = this;
    this.defaultOption = {
        container       : null,
        pageNum         : 1,
        pageRange       : 3,
        onSelectPage    : null
    };
    //点击上下一张事件代理
    $(document).on('click','.pg-item', function(){
        var $this = $(this);
        //对于disabled  active 按钮点击不做处理
        if($this.hasClass('active') || $this.hasClass('disabled')){
            return;
        }
        typeof  _this.option.onSelectPage === 'function' ?
            _this.option.onSelectPage($this.data('value')) : null;
    });

};
//渲染分页组件
Pagination.prototype.render = function(userOption){
    //合并选项
    this.option = $.extend({},this.defaultOption,userOption);
    //判断容器是否为合法的jquery 对象
    if(!(this.option.container instanceof jQuery)){
        return ;
    }
    //判断是否只有一页
    if(this.option.pages <= 1){
        return ;
    }
    //渲染分页
    this.option.container.html(this.getPaginationHtml());
};
//获取分页的html
Pagination.prototype.getPaginationHtml = function(){
    var html        = '',
        option      = this.option,
        pageArray   = [],
        //pageNum 当前页数  pageRange 前后预留的页数 1 2 '3' 4 5 当前页为3 则 pageRange 为2
        start       = option.pageNum - option.pageRange > 0 ?
            option.pageNum - option.pageRange : 1,
        end         =option.pageNum + option.pageRange < option.pages ?
            option.pageNum + option.pageRange : option.pages;
    //上一页按钮的数据
    pageArray.push({
        name        : '上一页',
        value       : this.option.prePage,
        disabled    : !this.option.hasPreviousPage
    });
    //数字按钮的处理
    for(var i = start;i <= end ;i++){
        pageArray.push({
            name        : i,
            value       : i,
            active      : (i === option.pageNum)
        });
    };
    //下一页的数据
    pageArray.push({
        name        : '下一页',
        value       : this.option.nextPage,
        disabled    : !this.option.hasNextPage
    });
    html = _mm.renderHtml(templatePagination,{
        pageArray : pageArray,
        pageNum   : option.pageNum,
        pages     : option.pages
    });
    return html;
};
module.exports = Pagination;