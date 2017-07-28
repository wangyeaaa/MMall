/**
 * Created by Administrator on 2017/7/17.
 */
'use strict';
require('./index.css');
require('page/common/header/index.js');
var nav             = require('page/common/nav/index.js');
var _mm             = require('util/mm.js');
var templateIndex   = require('./index.string');
var  _cart          = require('service/cart-service.js');

var page = {
    data    : {

    },
    init        : function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad      : function(){

        this.loadCart();
    },
    bindEvent   : function(){
        var _this = this;
        //商品的选择与取消选择
        $(document).on('click', '.cart-select',function(){
            var $this =$(this),
                productId = $this.parents('.cart-table').data('product-id');
            //选中
            if($this.is(':checked')){
                _cart.selectProduct(productId,function(res){
                    _this.renderCart(res);
                },function(errMsg){
                    _this.showCartError();
                });
            }
            //取消选中
            else{
                _cart.unselectProduct(productId,function(res){
                    _this.renderCart(res);
                },function(errMsg){
                    _this.showCartError();
                });
            }
        });
        //商品的全选与取消全选
        $(document).on('click', '.cart-select-all',function(){
            var $this =$(this);
            //全选
            if($this.is(':checked')){
                _cart.selectAllProduct(function(res){
                    _this.renderCart(res);
                },function(errMsg){
                    _this.showCartError();
                });
            }
            //取消全选
            else{
                _cart.unselectAllProduct(function(res){
                    _this.renderCart(res);
                },function(errMsg){
                    _this.showCartError();
                });
            }
        });
        //商品数量的变化
        $(document).on('click','.count-btn',function(){
            var $this       = $(this),
                $pCount     = $this.siblings('.count-input'),
                type        = $this.hasClass('plus') ? 'plus' : 'minus',
                productId   = $this.parents('.cart-table').data('product-id'),
                currCount   = parseInt($pCount.val()),
                minCount    = 1,
                maxCount    = parseInt($pCount.data('max')),
                newCount    = 0;
            if(type === 'plus'){
                if(currCount >= maxCount){
                    _mm.errorTips('该商品数量达到上限');
                    return;
                }
                newCount = currCount + 1;
            }else if(type === 'minus'){
                if(currCount <= minCount){
                    return;
                }
                newCount = currCount - 1;
            }
            //更新购物车商品数量
            _cart.updateProduct({
               productId : productId,
                count    : newCount
            },function(res){
                _this.renderCart(res);
            },function(errMsg){
                _this.showCartError();
            });
        });
        //删除单个商品
        $(document).on('click' ,'.cart-delete', function(){
           if(window.confirm('确认要删除该商品？')) {
               var productId = $(this).parents('.cart-table').data('product-id');
                _this.deleteCartProduct(productId);
           }
        });
        //删除选中商品
        $(document).on('click' ,'.delete-selected', function(){
            if(window.confirm('确认要删除选中的商品？')) {
                var arrProductIds = [],
                    $selectItem = $('.cart-select:checked');
                //循环查找选中的product
                for(var i = 0,ilength =$selectItem.length; i<ilength;i++){
                    arrProductIds.push($($selectItem[i]).parents('.cart-table').data('product-id'));
                }
                if(arrProductIds.length){
                    //join(',')将数组元素用逗号分开拼接成字符串
                    _this.deleteCartProduct(arrProductIds.join(','));
                }
                else{
                    _mm.errorTips('没有选中要删除的商品！');
                }
            }
        });
        //提交购物车
        $(document).on('click' ,'.submit-btn', function(){
           //总价大于0 ，进行提交
            if(_this.data.carInfo && _this.data.carInfo.cartTotalPrice > 0){
                window.location.href = './order-confirm.html';
            }else{
                _mm.errorTips('未选择商品！');
            }
        });

    },
    //加载购物车信息
    loadCart    : function(){
        var _this   = this;
          //获取购物车列表
        _cart.getCartList(function(res){
            _this.renderCart(res);
        },function(errMsg){
            _this.showCartError();
        });
        //loading
       /* $pageWrap.html('<div class="loading"></div>');*/

    },
    //渲染购物车
    renderCart  : function(data){
        this.filter(data);
        //缓存购物车信息
        this.data.carInfo = data;
        //生成html
         var carthtml = _mm.renderHtml(templateIndex,data);
         $('.page-wrap').html(carthtml);
         //通知导航条的购物车更新数量
        nav.loadCartcount();
    },

    //删除指定商品 支持批量 productid 用逗号分开
    deleteCartProduct : function(productIds){
        var _this = this ;
        _cart.deleteProduct(productIds,function(res){
            _this.renderCart(res);
        },function(errMsg){
            _this.showCartError();
        });
    },
    //数据处理
    filter      : function(data){
            //加两个叹号强制转换为布尔型
            data.notEmpty = !!data.cartProductVoList.length;
    },
    //显示错误信息
    showCartError : function(){
        $('.page-wrap').html('<p class="err-tip">刷新重试！</p>')
    }
};
$(function(){
    page.init();
})