(function(name, context, definition){
  if (typeof module !== "undefined" && module.exports) {
    module.exports = definition();
  } else if (typeof define === "function" && define.amd) {
    define(definition);
  } else {
    context[name] = definition();
  }
})("toretto", this, function(){
  var
  win        = this,
  doc        = win.document,
  docEl      = doc.documentElement,
  className  = "className",
  cloneNode  = "cloneNode",
  firstChild = "firstChild",
  inBefore   = "insertBefore",
  length     = "length",
  nodeType   = "nodeType",
  parentNode = "parentNode",
  replace    = "replace",
  typeObject = "object",
  typeString = "string";

  /**
   * Camelcase string for CSS.
   */
  function camelCase(string) {
    return string[replace](/\-(\w{1})/g, function(full, match) {
      return match.toUpperCase();
    });
  }

  /**
   * Get regex for class name.
   */
  function classRegex(name) {
    return new RegExp("(^|\\s+)" + name + "(\\s+|$)");
  }

  /**
   * Get raw value from data attribute.
   */
  function dataValue(value) {
    return value === "null" ? null :
      value === "undefined" ? undefined :
      value === "false"     ? false :
      value === "true"      ? true :
      /^\d+$/.test(value)   ? value++ :
      value;
  }

  /**
   * Uncamelcase string for CSS.
   */
  function unCamelCase(string) {
    return string[replace](/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  }

  /**
   * Loop arrays or objects.
   */
  function each(obj, fn, scope) {
    var
    index,
    langd;

    if (likeArray(obj)) {
      index = 0;
      langd = obj[length];

      for (; index < langd; index++) {
        fn.call(scope || obj[index], obj[index], index, obj);
      }
    } else if (typeOf(obj) === typeObject) {
      for (index in obj) {
        if (obj.hasOwnProperty(index)) {
          fn.call(scope || index, index, obj[index], obj);
        }
      }
    }

    return obj;
  }

  /**
   * Check if node has class.
   */
  function hasClass(node, name) {
    return classRegex(name).test(node[className]);
  }

  /**
   * Convert string to actual HTML.
   */
  function htmlify(html) {
    var
    element = doc.createElement("div"),
    results = [];

    element.innerHTML = typeof html === typeString ? html : "";

    each(element.childNodes, function(node) {
      if (isNode(node)) {
        results.push(node);
      }
    });

    return results;
  }

  /**
   * Check if item exists in array.
   */
  function inArray(obj, item) {
    var
    index = 0,
    langd = obj[length];

    for (; index < langd; index++) {
      if (obj[index] === item) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if object is document.
   */
  function isDoc(obj) {
    return obj && obj[nodeType] === 9;
  }

  /**
   * Check if object is a node.
   */
  function isNode(obj) {
    return obj && obj.nodeName && obj[nodeType] === 1;
  }

  /**
   * Check if object is window.
   */
  function isWindow(obj) {
    return obj && obj === obj.window;
  }

  /**
   * Check if object is like an array, i.e. an array or an array-like object.
   */
  function likeArray(obj) {
    return obj && (
      typeOf(obj) === "array" || (
      typeof obj !== typeString &&
      typeof obj[length] === "number" &&
      obj[length] - 1 in obj));
  }

  /**
   * Create a new array from array with a filter function.
   */
  function map(obj, fn, scope) {
    var
    results = [];

    each(obj, function(item, index) {
      results.push(fn.call(this || item, item, index, obj));
    }, scope);

    return results;
  }

  /**
   * Normalize an object for Toretto.
   */
  function normalize(obj) {
    return likeArray(obj) ? obj :
      isDoc(obj) || isNode(obj) || isWindow(obj) ? [obj] :
      /^\s*<(\w+|!)[^>]*>/.exec(obj) ? htmlify(obj) :
      [];
  }

  /**
   * Trim string; remove leading and trailing whitespace and fix spaces.
   */
  function trim(string) {
    return string[replace](/(^\s*|\s*$)/g, "")[replace](/\s+/g, " ");
  }

  /**
   * Check type of object; better than typeof, but slower.
   */
  function typeOf(obj) {
    return ({}).toString.call(obj)[replace](/^\[\w+\s(\w+)\]$/, "$1").toLowerCase();
  }

  /**
   * Create a unique array from an existing one.
   */
  function unique(obj) {
    var
    results = [];

    each(obj, function(item) {
      if (inArray(results, item) !== true) {
        results.push(item);
      }
    });

    return results;
  }

  /**
   * Create a new Toretto object.
   */
  function Toretto(elements) {
    elements = normalize(elements);

    this[length] = elements[length];

    each(elements, function(node, index) {
      this[index] = node;
    }, this);
  }

  Toretto.prototype = {
    /**
     * Add class(es) to nodes.
     */
    addClass: function(name) {
      name = name.split(/\s+/);

      return this.each(function(node) {
        each(name, function(klass) {
          if (!hasClass(node, klass)) {
            node[className] += " " + klass;
          }
        });

        node[className] = trim(node[className]);
      });
    },

    /**
     * Add HTML after nodes.
     */
    after: function(html) {
      var
      next;

      html = normalize(html);

      return this.each(function(node) {
        next = node.nextSibling;

        each(html, function(item) {
          node[parentNode][inBefore](item[cloneNode](true), next);
        });
      });
    },

    /**
     * Append HTML to nodes.
     */
    append: function(html) {
      html = normalize(html);

      return this.each(function(node) {
        each(html, function(item) {
          node[inBefore](item[cloneNode](true), null);
        });
      });
    },

    /**
     * Get or set attributes.
     */
    attr: function(attr, value) {
      if (typeOf(attr) === typeObject) {
        each(attr, function(key, val) {
          this.attr(key, val);
        }, this);

        return this;
      }

      return typeof value === typeString ?
        this.each(function(node) {
          node.setAttribute(attr, value);
        }) :
        this[length] > 0 ?
          this[0].getAttribute(attr) :
          null;
    },

    /**
     * Add HTML before nodes.
     */
    before: function(html) {
      html = normalize(html);

      return this.each(function(node) {
        each(html, function(item) {
          node[parentNode][inBefore](item[cloneNode](true), node);
        });
      });
    },

    /**
     * Add CSS to nodes or get style value for the first node.
     */
    css: function(style, value) {
      if (typeOf(style) === typeObject) {
        each(style, function(key, val) {
          this.css(key, val);
        }, this);

        return this;
      }

      return typeof value === typeString ?
        this.each(function(node) {
          node.style[camelCase(style)] = value;
        }) :
        this[length] > 0 ?
          win.getComputedStyle(this[0], null).getPropertyValue(unCamelCase(style)) :
          null;
    },

    /**
     * Get or set data attributes.
     */
    data: function(attr, value) {
      if (typeOf(attr) === typeObject) {
        each(attr, function(key, val) {
          this.attr("data-" + key, "" + val);
        }, this);

        return this;
      }

      return typeof value === typeString ?
        this.attr("data-" + attr, "" + value) :
        this[length] > 0 ?
          dataValue(this[0].getAttribute("data-" + attr)) :
          null;
    },

    /**
     * Loop all the nodes with a function.
     */
    each: function(fn) {
      return each(this, fn);
    },

    /**
     * Remove children for nodes.
     */
    empty: function() {
      return this.each(function(node) {
        while (node[firstChild]) {
          node.removeChild(node[firstChild]);
        }
      });
    },

    /**
     * Get a new Toretto object containing node matching index.
     */
    eq: function(index) {
      return toretto(index >= 0 && index < this[length] ? this[index] : null);
    },

    /**
     * Get a new Toretto object containing the first node.
     */
    first: function() {
      return this.eq(0);
    },

    /**
     * Get a raw node by index.
     */
    get: function(index) {
      return index >= 0 && index < this[length] ? this[index] : null;
    },

    /**
     * Check if the first node has class name.
     */
    hasClass: function(name) {
      return hasClass(this[0], name);
    },

    /**
     * Get HTML for the first node or set HTML for all nodes.
     */
    html: function(html, text) {
      var
      method = text ? (docEl.textContent ? "textContent" : "innerText") : "innerHTML";

      return typeof html === typeString ?
        this.each(function(node) {
          node[method] = html;
        }) :
        this[length] > 0 ?
          this[0][method] :
          null;
    },

    /**
     * Get a new Toretto object containing the last node.
     */
    last: function() {
      return this.eq(this[length] - 1);
    },

    /**
     * Create a new Toretto object with a filter function.
     */
    map: function(fn) {
      return toretto(map(this, fn));
    },

    /**
     * Get parent(s) for node(s).
     */
    parent: function() {
      return toretto(unique(map(this, function(node) {
        return node[parentNode];
      })));
    },

    /**
     * Prepend HTML to nodes.
     */
    prepend: function(html) {
      var
      first;

      return this.each(function(node) {
        first = node[firstChild];

        each(normalize(html), function(item) {
          node[inBefore](item[cloneNode](true), first);
        });
      });
    },

    /**
     * Remove nodes; returns parent(s).
     */
    remove: function() {
      var
      parents = this.parent();

      this.each(function(node) {
        node[parentNode].removeChild(node);
      });

      return parents;
    },

    /**
     * Remove class(es) for nodes.
     */
    removeClass: function(name) {
      name = name.split(/\s+/);

      return this.each(function(node) {
        each(name, function(klass) {
          if (hasClass(node, klass)) {
            node[className] = node[className][replace](classRegex(klass), " ");
          }
        });

        node[className] = trim(node[className]);
      });
    },

    /**
     * Get text for the first node or set text for all nodes.
     */
    text: function(text) {
      return this.html(text, true);
    },

    /**
     * Get a raw array of nodes.
     */
    toArray: function() {
      return toretto.map(this, function(node) {
        return node;
      });
    },

    /**
     * Toggle class(es) for nodes.
     */
    toggleClass: function(name) {
      name = name.split(/\s+/);

      return this.each(function(node) {
        each(name, function(klass) {
          toretto(node)[hasClass(node, klass) ? "removeClass" : "addClass"](klass);
        });

        node[className] = trim(node[className]);
      });
    },

    /**
     * Get value for the first node or set value for all nodes.
     */
    val: function(value) {
      return typeof value !== "undefined" ?
        this.attr("value", value) :
        this[length] > 0 ?
          this[0].value :
          null;
    }
  };

  /**
   * Create a new Toretto object.
   */
  function toretto(elements) {
    return new Toretto(elements);
  }

  /**
   * Add function(s) to Toretto.
   */
  toretto.add = function(name, fn) {
    if (typeof name === typeString && typeof fn === "function") {
      Toretto.prototype[name] = fn;
    } else if (typeOf(name) === typeObject) {
      each(name, function(key, val) {
        Toretto.prototype[key] = val;
      });
    }
  };

  toretto.each   = each;
  toretto.fn     = Toretto.prototype;
  toretto.map    = map;
  toretto.unique = unique;

  return toretto;
});