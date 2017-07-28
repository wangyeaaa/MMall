/**
 * Created by Administrator on 2017/7/18.
 */

'use strict';

var _mm                      = require('util/mm.js');
var _cities                  = require('util/cities/index.js');
var templateAddressModal     = require('./address-modal.string');
var  _address                = require('service/address-service.js');

var addressModal = {
    show  : function (option) {
       //option的绑定
       this.option       = option;
       this.option.data  = option.data || {};
       this.$modalWrap   = $('.modal-wrap');
       //渲染页面
       this.loadModal();
       //绑定事件
       this.bindEvent();
    },
    //关闭弹窗
    hide  : function () {
        this.$modalWrap.empty();
    },
    bindEvent : function () {
        var _this = this;
        //省份和城市的二级联动
        this.$modalWrap.find('#receiver-province').change(function(){
            var selectedProvince = $(this).val();
            _this.loadCities(selectedProvince);
        });
        //提交收货地址
        this.$modalWrap.find('.address-btn').click(function(){
            var receiverInfo = _this.getReceiverInfo(),
                isUpdate     = _this.option.isUpdate;
            //使用新地址 且验证通过
            if(!isUpdate && receiverInfo.status){
                _address.save(receiverInfo.data,function(res){
                    _mm.successTips('地址添加成功！');
                    //添加完关闭弹窗
                    _this.hide();
                    typeof _this.option.onSuccess === 'function' && _this.option.onSuccess(res);
                },function(errMsg){
                    _mm.errorTips(errMsg)
                })
            }
            // 更新地址 且验证通过
            else if(isUpdate && receiverInfo.status){
                _address.update(receiverInfo.data,function(res){
                    _mm.successTips('地址修改成功！');
                    //修改完关闭弹窗
                    _this.hide();
                    typeof _this.option.onSuccess === 'function' && _this.option.onSuccess(res);
                },function(errMsg){
                    _mm.errorTips(errMsg)
                })
            }
            //验证不通过
            else{
                _mm.errorTips(receiverInfo.errMsg || '刷新重试');
            }
        });
        //阻止关闭弹窗冒泡事件
        this.$modalWrap.find('.modal-container').click(function(e){
            e.stopPropagation();
        });
        //关闭弹窗 单击X 或者点击蒙版区域
        this.$modalWrap.find('.close').click(function(){
            _this.hide();
        });
    },
    //渲染弹窗
    loadModal : function () {
        var addressModalhtml =_mm.renderHtml(templateAddressModal,{
            isUpdate : this.option.isUpdate,
            data     : this.option.data
        });
        this.$modalWrap.html(addressModalhtml);
        //加载省份
        this.loadProvince();
    },
    //加载省份
    loadProvince : function(){
        var provinces =_cities.getProvinces()  || [],
            $provinceSelect = this.$modalWrap.find('#receiver-province');
        $provinceSelect.html(this.getSelectOption(provinces));

        //如果是编辑地址信息 并且存在省份 则回填至表单
        if(this.option.isUpdate && this.option.data.receiverProvince){
            $provinceSelect.val(this.option.data.receiverProvince);
            //加载城市
            this.loadCities(this.option.data.receiverProvince);
        }
    },
    //加载城市
    loadCities : function(provinceName){
        var cities      = _cities.getCities(provinceName) || [],
            $citySelect = this.$modalWrap.find('#receiver-city');
        $citySelect.html(this.getSelectOption(cities));

        //如果是编辑地址信息 并且存在城市 则回填至表单
        if(this.option.isUpdate && this.option.data.receiverCity){
            $citySelect.val(this.option.data.receiverCity);
        }

    },
    //获取表单收件人信息 并做验证
    getReceiverInfo  :function () {
        var receiverInfo = {},
            result       = {
                status : false
            };
        receiverInfo.receiverName       = $.trim(this.$modalWrap.find('#receiver-name').val());
        receiverInfo.receiverProvince   = this.$modalWrap.find('#receiver-province').val();
        receiverInfo.receiverCity       = this.$modalWrap.find('#receiver-city').val();
        receiverInfo.receiverAddress    = $.trim(this.$modalWrap.find('#receiver-address').val());
        receiverInfo.receiverPhone      = $.trim(this.$modalWrap.find('#receiver-phone').val());
        receiverInfo.receiverZip        = $.trim(this.$modalWrap.find('#receiver-zip').val());
        if(this.option.isUpdate){
            receiverInfo.id             = this.$modalWrap.find('#receiver-id').val();
        }
        if(!receiverInfo.receiverName){
            result.errMsg = "请输入收件人姓名";
        }
        else if(!receiverInfo.receiverProvince){
            result.errMsg = "请选择收件人所在的省份";
        }
        else if(!receiverInfo.receiverCity){
            result.errMsg = "请选择收件人所在的城市";
        }
        else if(!receiverInfo.receiverAddress){
            result.errMsg = "请输入收件人详细地址";
        }
        else if(!receiverInfo.receiverPhone){
            result.errMsg = "请输入收件人手机号";
        }
        //所有验证全部通过
        else{
            result.status = true;
            result.data = receiverInfo;
        }
        return result;
    },
    //获取select 下的option 输入一个数组  输出 html
    getSelectOption : function(optionArray){
        var html = '<option value=""> 请选择</option>';
        for(var i = 0 ,length = optionArray.length; i<length; i++){
            html += '<option value="'+optionArray[i]+'">'+optionArray[i]+'</option>';
        }
        return html;
    }
};
module.exports = addressModal;