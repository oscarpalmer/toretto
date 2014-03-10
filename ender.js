(function($){
  var
  toretto = require("toretto");

  $.ender(toretto.fn, true);

  $.ender({
    appendTo: function(selector, context) {
      return $(selector, context).append(this);
    },
    insertAfter: function(selector, context) {
      return $(selector, context).after(this);
    },
    insertBefore: function(selector, context) {
      return $(selector, context).before(this);
    },
    prependTo: function(selector, context) {
      return $(selector, context).prepend(this);
    }
  }, true);

  $.ender({
    each:   toretto.each,
    extend: toretto.extend,
    map:    toretto.map,
    unique: toretto.unique
  });
}(ender));