var
index = 0,
append, attr, css, empty, html, klass, near, prepend, text, value;


function equal(a, b, c) {
  console.log((a === b ? "ok " : "not ok ") + (++index) + " - " + (c || "'" + a + "' === '" + b + "'"));
}

function $(id) {
  return toretto(document.getElementById(id));
}


append  = $("append");
attr    = $("attr");
css     = $("css");
empty   = $("empty");
html    = $("html");
klass   = $("class");
items   = toretto(document.getElementsByTagName("li"));
near    = $("near");
prepend = $("prepend");
text    = $("text");
value   = $("value");


console.log("TAP version 13");
console.log("1..27");


// set and remove classes and check if class exists
klass.addClass("alpha beta");
equal(klass.hasClass("alpha") && klass.hasClass("beta") && klass.hasClass("existing"), true);
//
klass.removeClass("alpha");
equal(klass.hasClass("alpha"), false);
equal(klass.hasClass("beta") && klass.hasClass("existing"), true);


// slap some HTML before and after an element
near.after("<b> after</b>");
near.before("<b>before </b>");
equal($("near-wrapper").html(), "<b>before </b><i id=\"near\">middle?</i><b> after</b>");


// append and prepend html
append.append("<b>appended</b>");
equal(append.html(), "append - <b>appended</b>");
//
prepend.prepend("<b>prepended</b>");
equal(prepend.html(), "<b>prepended</b> - prepend");


// get and set attributes and values
equal(attr.attr("id"), "attr");
//
attr.data("attribute", 1234);
equal(attr.data("attribute"), 1234);
//
value.val("random value");
equal(value.val(), "random value");


// set and get css
css.css("color", "rgb(255, 0, 255)");
css.css({fontSize:"20px"});
//
equal(css.css("color"), "rgb(255, 0, 255)");
equal(css.css("font-size"), "20px");


// each function
var each = "";
items.each(function(node, index) {
  each += index;
});
equal(each, "01234");


// empty node(s)
equal(empty.html(), "<i>1</i><i>2</i><i>3</i><i>4</i><i>5</i><i>6</i><i>7</i><i>8</i><i>9</i>");
equal(empty.empty().html(), "");


// get specific nodes
equal(items.eq(2).html(), "C");
equal(items.get(2).innerHTML, "C");
//
equal(items.first().html(), "A");
equal(items.last().html(), "E");
//
equal(items.parent().html(), "<li>A</li><li>B</li><li>C</li><li>D</li><li>E</li>");
equal(items.parent().length, 1);


// get and set html and text
html.html("Toretto is cool. ~ html");
equal(html.html(), "Toretto is cool. ~ html");
//
text.text("Toretto is cool. ~ text");
equal(text.text(), "Toretto is cool. ~ text");


// map function
equal(items.map(function(node, index) {
  if ((index + 1) % 2 === 0) {
    return node;
  }
}).length, 2);


// remove function
empty.append("<span id=\"remove\">Remove me!</span>");
equal(empty.html(), "<span id=\"remove\">Remove me!</span>");
$("remove").remove();
equal(empty.html(), "");


// toArray function
equal({}.toString.call(items), "[object Object]"); // Toretto object is a real object
equal({}.toString.call(items.toArray()), "[object Array]"); // Array is an array object