webpackJsonp([16],{0:function(r,t,e){r.exports=e(70)},11:function(r,t){},12:function(r,t,e){"use strict";e(11)},31:function(r,t){},70:function(r,t,e){"use strict";e(31);var n=e(1);e(12),$(function(){var r=n.getUrlParam("type")||"default",t=$("."+r+"-success");if("payment"===r){var e=n.getUrlParam("orderNumber"),a=t.find(".order-number");a.attr("href",a.attr("href")+e)}t.show()})}});