!function(a,b,c){"undefined"!=typeof module&&module.exports?module.exports=c():"function"==typeof define&&define.amd?define(c):b[a]=c()}("toretto",this,function(){function a(a){return a.replace(/\-(\w{1})/g,function(a,b){return b.toUpperCase()})}function b(a){return new RegExp("(^|\\s+)"+a+"(\\s+|$)")}function c(a){return"null"===a?null:"undefined"===a?void 0:"false"===a?!1:"true"===a?!0:/^\d+$/.test(a)?a++:a}function d(a){return a.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}function e(a,b,c){var d,e;if(j(a))for(d=0,e=a.length;e>d;d++)b.call(c||a[d],a[d],d,a);else for(d in a)a.hasOwnProperty(d)&&b.call(c||d,d,a[d],a);return a}function f(a,c){return b(c).test(a.className)}function g(a){var b=r.createElement("div"),c=[];return b.innerHTML="string"==typeof a?a:"",e(b.childNodes,function(a){i(a)&&c.push(a)}),c}function h(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return!0;return!1}function i(a){return a&&(1===a.nodeType||9===a.nodeType||a===a.window)}function j(a){return a&&(a instanceof Array||"string"!=typeof a&&"number"==typeof a.length&&a.length-1 in a)}function k(a,b,c){var d=[];return e(a,function(c,e){d.push(b.call(this||c,c,e,a))},c),d}function l(a){return j(a)?a:i(a)?[a]:t.exec(a)?g(a):[]}function m(a){return a.replace(/(^\s*|\s*$)/g,"").replace(/\s+/g," ")}function n(a){var b=[];return e(a,function(a){h(b,a)!==!0&&b.push(a)}),b}function o(a){a=l(a),this.length=a.length,e(a,function(a,b){this[b]=a},this)}function p(a){return new o(a)}var q=this,r=q.document,s=r.documentElement,t=/^\s*<(\w+|!)[^>]*>/;return o.prototype={addClass:function(a){return a=a.split(/\s+/),this.each(function(b){e(a,function(a){f(b,a)||(b.className+=" "+a)}),b.className=m(b.className)})},after:function(a){var b;return a=l(a),this.each(function(c){b=c.nextSibling,e(a,function(a){c.parentNode.insertBefore(a.cloneNode(!0),b)})})},append:function(a){return a=l(a),this.each(function(b){e(a,function(a){b.insertBefore(a.cloneNode(!0),null)})})},attr:function(a,b){return"object"===typeOf(a)?(e(a,function(a,b){this.attr(a,b)},this),this):"string"==typeof b?this.each(function(c){c.setAttribute(a,b)}):this.length>0?this[0].getAttribute(a):null},before:function(a){return a=l(a),this.each(function(b){e(a,function(a){b.parentNode.insertBefore(a.cloneNode(!0),b)})})},css:function(b,c){return"object"===typeOf(b)?(e(b,function(a,b){this.css(a,b)},this),this):"string"==typeof c?this.each(function(d){d.style[a(b)]=c}):this.length>0?q.getComputedStyle(this[0],null).getPropertyValue(d(b)):null},data:function(a,b){return"object"===typeOf(a)?(e(a,function(a,b){this.attr("data-"+a,""+b)},this),this):"string"==typeof b?this.attr("data-"+a,""+b):this.length>0?c(this[0].getAttribute("data-"+a)):null},each:function(a){return e(this,a)},empty:function(){return this.each(function(a){for(;a.firstChild;)a.removeChild(a.firstChild)})},eq:function(a){return p(a>=0&&a<this.length?this[a]:null)},first:function(){return this.eq(0)},get:function(a){return a>=0&&a<this.length?this[a]:null},hasClass:function(a){return f(this[0],a)},html:function(a){return"string"==typeof a?this.each(function(b){b.innerHTML=a}):this.length>0?this[0].innerHTML:null},last:function(){return this.eq(this.length-1)},map:function(a){return p(k(this,a))},parent:function(){return p(n(k(this,function(a){return a.parentNode})))},prepend:function(a){var b;return a=l(a),this.each(function(c){b=c.firstChild,e(a,function(a){c.insertBefore(a.cloneNode(!0),b)})})},remove:function(){var a=this.parent();return this.each(function(a){a.parentNode.removeChild(a)}),a},removeClass:function(a){return a=a.split(/\s+/),this.each(function(c){e(a,function(a){f(c,a)&&(c.className=c.className.replace(b(a)," "))}),c.className=m(c.className)})},text:function(a){var b=s.textContent?"textContent":"innerText";return"string"==typeof a?this.each(function(c){c[b]=a}):this.length>0?this[0][b]:null},toArray:function(){return p.map(this,function(a){return a})},toggleClass:function(a){return a=a.split(/\s+/),this.each(function(b){e(a,function(a){p(b)[f(b,a)?"removeClass":"addClass"](a)}),b.className=m(b.className)})},val:function(a){return"undefined"!=typeof a?this.attr("value",a):this.length>0?this[0].value:null}},p.each=e,p.fn=o.prototype,p.map=k,p.unique=n,p});