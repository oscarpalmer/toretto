# Toretto

[![NPM version](https://badge.fury.io/js/toretto.png)](http://badge.fury.io/js/toretto)

Toretto is a badass DOM utility for [badass browsers](#browser-support).

## Installation

Toretto is available (as `toretto`) via [Bower](http://bower.io), [Jam](http://jamjs.org), and [npm](http://npmjs.org). Toretto also works with [Ender](http://ender.var.require.io).

## Basic usage

```js
t = toretto(document.getElementById("toretto"));

t.html("My name is <b>Dom Toretto</b>.").after("<p>I like Chargers.</p>");
```

And that's it!

Right now, the best way to check what Toretto can do is to read the [actual code](src/toretto.js), but I assure you, proper documentation is on the way.

## Extending Toretto

Toretto is pretty cool and versatile on its own, but maybe you'd like to add your own function? That's easy!

```js
toretto.fn.myFunction = function(){};
```

Wow, that's just like jQuery!

## Todo

- API documentation.

## License

MIT Licensed; see the [LICENSE file](LICENSE) for more info.