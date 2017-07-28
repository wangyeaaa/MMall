/**
 * Created by Administrator on 2017/7/10.
 */
'use strict';
require('./index.css');
require('page/common/nav-simple/index.js');
var _mm     =require('util/mm.js');
var _user   =require('service/user-service.js');

//表单错误提示
var formError ={
    show : function(errMsg){
        $(".error-item").show().find('.err-msg').text(errMsg);
    },
    hide : function(){
        $(".error-item").hide().find('.err-msg').text('');
    }
};
//page 逻辑部分
var page = {
    data : {
        username    : '',
        question    : '',
        answer      : '',
        token       : '',
    },
    init  : function(){
        this.bindEvent();
        this.onLoad();
    },
    onLoad    : function(){
        this.loadStepUsername();
    },
    bindEvent : function(){
        var _this=this;
        //输入用户名 下一步按钮点击
        $("#submit-username").click(function(){
            var username = $.trim($("#username").val());
            //判断用户名是否存在
            if(username){
                _user.getQuestion(username,function(res){
                        _this.data.username = username;
                        _this.data.question = res;
                        _this.loadStepQuestion();
                },function(errMsg){
                    formError.show(errMsg);
                });
            }
            else{
                formError.show('请输入用户名');
            }
        });
        //按下回车键 进行输入用户名后的下一步操作
        $("#username").keyup(function(e){
            if(e.keyCode === 13) {
                var username = $.trim($("#username").val());
                //判断用户名是否存在
                if(username){
                    _user.getQuestion(username,function(res){
                        _this.data.username = username;
                        _this.data.question = res;
                        _this.loadStepQuestion();
                    },function(errMsg){
                        formError.show(errMsg);
                    });
                }
                else{
                    formError.show('请输入用户名');
                }
            }
        });
        //输入提示问题答案 下一步按钮点击
        $("#submit-question").click(function(){
            var answer = $.trim($("#answer").val());
            //判断答案是否正确
            if(answer){
                _user.checkAnswer({
                    username  : _this.data.username,
                    question  : _this.data.question,
                    answer    : answer
                },function(res){
                    _this.data.answer   = answer;
                    _this.data.token    = res;
                    _this.loadStepPassword();
                },function(errMsg){
                    formError.show(errMsg);
                });
            }
            else{
                formError.show('请输入答案');
            }
        });
        //按下回车键 进行输入完答案后的下一步操作
        $("#answer").keyup(function(e){
            if(e.keyCode === 13) {
                var answer = $.trim($("#answer").val());
                //判断答案是否正确
                if(answer){
                    _user.checkAnswer({
                        username  : _this.data.username,
                        question  : _this.data.question,
                        answer    : answer
                    },function(res){
                        _this.data.answer   = answer;
                        _this.data.token    = res;
                        _this.loadStepPassword();
                    },function(errMsg){
                        formError.show(errMsg);
                    });
                }
                else{
                    formError.show('请输入答案');
                }
            }
        });
        //输入新密码 下一步按钮点击
        $("#submit-password").click(function(){
            var password = $.trim($("#password").val());
            //判断密码是否为空
            if(password && password.length >= 6){
                _user.resetPassword({
                    username        : _this.data.username,
                    passwordNew     : password,
                    forgetToken     : _this.data.token
                },function(res){
                   window.location.href = './result.html?type=pass-reset';
                },function(errMsg){
                    formError.show(errMsg);
                });
            }
            else{
                formError.show('请输入不少于6位的新密码');
            }
        });
        //按下回车键 进行重设新密码的下一步操作
        $("#password").keyup(function(e){
            if(e.keyCode === 13) {
                var password = $.trim($("#password").val());
                //判断密码是否为空
                if(password && password.length >= 6){
                    _user.resetPassword({
                        username        : _this.data.username,
                        passwordNew     : password,
                        forgetToken     : _this.data.token
                    },function(res){
                        window.location.href = './result.html?type=pass-reset';
                    },function(errMsg){
                        formError.show(errMsg);
                    });
                }
                else{
                    formError.show('请输入不少于6位的新密码');
                }
            }
        });
    },
    //加载输入用户名
    loadStepUsername : function(){
        $(".step-username").show();
    },
    //加载提示问题
    loadStepQuestion : function(){
        //清除错误提示
        formError.hide();
        //切换容器
        $(".step-username").hide().siblings('.step-question').show()
            .find('.question').text(this.data.question);
    },
    //加载输入新密码
    loadStepPassword : function(){
        formError.hide();
        $(".step-question").hide().siblings('.step-password').show();
    }
};
$(function(){
    page.init();
});