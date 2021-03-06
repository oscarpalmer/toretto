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
  htmlRegex  = /^\s*<(\w+|!)[^>]*>/,
  spaceRegex = /\s+/g;


  /**
   * Camelcase string for CSS.
   */
  function camelCase(string) {
    return string.replace(/\-(\w{1})/g, function(full, match) {
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
   * Loop arrays or objects.
   *
   * @param {Array|Object} obj
   * @param {Function} fn
   * @param {*=} scope - Optional scope for 'this' in function
   * @return {Array|Object}
   */
  function each(obj, fn, scope) {
    var
    index,
    langd;

    if (likeArray(obj)) {
      index = 0;
      langd = obj.length;

      for (; index < langd; index++) {
        fn.call(scope || obj[index], index, obj[index], obj);
      }
    } else {
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
    return classRegex(name).test(node.className);
  }

  /**
   * Convert string to actual HTML.
   */
  function htmlify(html) {
    var
    div;

    if (typeof html !== "string") {
      return normalize(html);
    }

    div = doc.createElement("div");
    div.innerHTML = html;

    return [].slice.call(div.childNodes);
  }

  /**
   * Check if object is like a node.
   */
  function isNodeLike(obj) {
    return obj && (obj.nodeType === 1 || obj.nodeType === 9);
  }

  /**
   * Check if object is like an array, i.e. an array or an array-like object.
   */
  function likeArray(obj) {
    return obj && typeof obj === "object" && typeof obj.length === "number";
  }

  /**
   * Create a new array from array with a filter function.
   */
  function map(obj, fn, scope) {
    var
    result = [],
    value;

    each(obj, function(index, item) {
      value = fn.call(this || item, index, item, obj);

      if (typeof value !== "undefined") {
        result.push(value);
      }
    }, scope);

    return result;
  }

  /**
   * Normalize an object for Toretto.
   */
  function normalize(obj) {
    return likeArray(obj) ? obj :
           isNodeLike(obj) ? [obj] :
           htmlRegex.exec(obj) ? htmlify(obj) :
           [];
  }

  /**
   * Trim string; remove leading and trailing whitespace and fix spaces.
   */
  function trim(string) {
    return string.replace(/(^\s*|\s*$)/g, "").replace(spaceRegex, " ");
  }

  /**
   * Uncamelcase string for CSS.
   */
  function unCamelCase(string) {
    return string.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  }

  /**
   * Create a unique array from an existing one.
   */
  function unique(obj) {
    var
    result = [];

    each(obj, function(index, item) {
      if (result.indexOf(item) === -1) {
        result.push(item);
      }
    });

    return result;
  }

  /**
   * Create a new Toretto object.
   *
   * @param {Array|Element|String} elements
   * @return {Toretto}
   */
  function Toretto(elements) {
    elements = normalize(elements);

    this.length = elements.length;

    each(elements, function(index, node) {
      this[index] = node;
    }, this);
  }

  /**
   * Toretto's prototypal functions.
   */
  Toretto.prototype = {
    /**
     * Add class(es) to nodes.
     *
     * @param {String} name
     * @return {Toretto}
     */
    addClass: function(name) {
      name = name.split(spaceRegex);

      return this.each(function(index, node) {
        each(name, function(index, klass) {
          if (!hasClass(node, klass)) {
            node.className += " " + klass;
          }
        });

        node.className = trim(node.className);
      });
    },

    /**
     * Add HTML after nodes.
     *
     * @param {String} html
     * @return {Toretto}
     */
    after: function(html) {
      var
      next;

      html = htmlify(html);

      return this.each(function(index, node) {
        next = node.nextSibling;

        each(html, function(index, item) {
          node.parentNode.insertBefore(item.cloneNode(true), next);
        });
      });
    },

    /**
     * Append HTML to nodes.
     *
     * @param {String} html
     * @return {Toretto}
     */
    append: function(html) {
      html = htmlify(html);

      return this.each(function(index, node) {
        each(html, function(index, item) {
          node.appendChild(item.cloneNode(true));
        });
      });
    },

    /**
     * Get or set attributes.
     *
     * @param {Object|String} attr
     * @param {String=} value
     * @return {Toretto|String}
     */
    attr: function(attr, value) {
      if (typeof attr === "object") {
        return this.each(function(index, node) {
          each(attr, function(key, value) {
            node.setAttribute(attr, value);
          });
        });
      } else if (typeof value === "string") {
        return this.each(function(index, node) {
          node.setAttribute(attr, value);
        });
      }

      return this.length > 0 ? this[0].getAttribute(attr) : null;
    },

    /**
     * Add HTML before nodes.
     *
     * @param {String} html
     * @return {Toretto}
     */
    before: function(html) {
      html = htmlify(html);

      return this.each(function(index, node) {
        each(html, function(index, item) {
          node.parentNode.insertBefore(item.cloneNode(true), node);
        });
      });
    },

    /**
     * Add CSS to nodes or get style value for the first node.
     *
     * @param {Object|String} style
     * @param {String=} value
     * @return {Toretto|String}
     */
    css: function(style, value) {
      if (typeof style === "object") {
        return this.each(function(index, node) {
          each(style, function(key, value) {
            node.style[camelCase(key)] = value;
          });
        });
      } else if (typeof value === "string") {
        return this.each(function(index, node) {
          node.style[camelCase(style)] = value;
        });
      }

      return this.length > 0 ? win.getComputedStyle(this[0], null).getPropertyValue(unCamelCase(style)) : null;
    },

    /**
     * Get or set data attributes.
     *
     * @param {Object|String} attr
     * @param {*=} value
     * @return {*|Toretto}
     */
    data: function(attr, value) {
      if (typeof attr === "object") {
        return this.each(function(index, node) {
          each(attr, function(key, value) {
            node.setAttribute("data-" + key, JSON.stringify(value));
          });
        });
      } else if (typeof value !== "undefined") {
        return this.each(function(index, node) {
          node.setAttribute("data-" + attr, JSON.stringify(value));
        });
      }

      return this.length > 0 ? JSON.parse(this[0].getAttribute("data-" + attr)) : null;
    },

    /**
     * Loop all the nodes with a function.
     *
     * @param {Function} fn
     * @return {Toretto}
     */
    each: function(fn) {
      return each(this, fn);
    },

    /**
     * Remove children for nodes.
     *
     * @return {Toretto}
     */
    empty: function() {
      return this.each(function(index, node) {
        while (node.firstChild) {
          node.removeChild(node.firstChild);
        }
      });
    },

    /**
     * Get a new Toretto object containing node matching index.
     *
     * @param {Number} index
     * @return {Toretto}
     */
    eq: function(index) {
      return toretto(index >= 0 && index < this.length ? this[index] : null);
    },

    /**
     * Get a new Toretto object containing the first node.
     *
     * @return {Toretto}
     */
    first: function() {
      return this.eq(0);
    },

    /**
     * Get a raw node by index.
     *
     * @param {Number} index
     * @return {Element}
     */
    get: function(index) {
      index = index || 0;

      return index >= 0 && index < this.length ? this[index] : null;
    },

    /**
     * Check if the first node has class name.
     *
     * @param {String} name
     * @return {Boolean}
     */
    hasClass: function(name) {
      return hasClass(this[0], name);
    },

    /**
     * Get HTML for the first node or set HTML for all nodes.
     *
     * @param {String=} html
     * @return {Toretto|String}
     */
    html: function(html) {
      if (typeof html !== "undefined") {
        return this.each(function(index, node) {
          node.innerHTML = html;
        });
      }

      return this.length > 0 ? this[0].innerHTML : null;
    },

    /**
     * Get a new Toretto object containing the last node.
     *
     * @return {Toretto}
     */
    last: function() {
      return this.eq(this.length - 1);
    },

    /**
     * Create a new Toretto object with a filter function.
     *
     * @param {Function} fn
     * @return {Toretto}
     */
    map: function(fn) {
      return toretto(map(this, fn));
    },

    /**
     * Get parent(s) for node(s).
     *
     * @return {Toretto}
     */
    parent: function() {
      return toretto(unique(map(this, function(index, node) {
        return node.parentNode;
      })));
    },

    /**
     * Prepend HTML to nodes.
     *
     * @param {String} html
     * @return {Toretto}
     */
    prepend: function(html) {
      var
      first;

      html = htmlify(html);

      return this.each(function(index, node) {
        first = node.firstChild;

        each(html, function(index, item) {
          node.insertBefore(item.cloneNode(true), first);
        });
      });
    },

    /**
     * Remove nodes; returns parent(s).
     *
     * @return {Toretto}
     */
    remove: function() {
      var
      parents = this.parent();

      this.each(function(index, node) {
        node.parentNode.removeChild(node);
      });

      return parents;
    },

    /**
     * Remove class(es) for nodes.
     *
     * @param {String} name
     * @return {Toretto}
     */
    removeClass: function(name) {
      name = name.split(spaceRegex);

      return this.each(function(index, node) {
        each(name, function(index, klass) {
          if (hasClass(node, klass)) {
            node.className = node.className.replace(classRegex(klass), " ");
          }
        });

        node.className = trim(node.className);
      });
    },

    /**
     * Get text for the first node or set text for all nodes.
     *
     * @param {String=} text
     * @return {Toretto}
     */
    text: function(text) {
      if (typeof text !== "undefined") {
        return this.each(function(index, node) {
          node.textContent = text;
        });
      }

      return this.length > 0 ? this[0].textContent : null;
    },

    /**
     * Get a raw array of nodes.
     *
     * @return {Array}
     */
    toArray: function() {
      return [].slice.call(this);
    },

    /**
     * Toggle class(es) for nodes.
     *
     * @param {String} name
     * @return {Toretto}
     */
    toggleClass: function(name) {
      name = name.split(spaceRegex);

      return this.each(function(index, node) {
        each(name, function(index, klass) {
          toretto(node)[hasClass(node, klass) ? "removeClass" : "addClass"](klass);
        });

        node.className = trim(node.className);
      });
    },

    /**
     * Get value for the first node or set value for all nodes.
     *
     * @param {String=} value
     * @return {Toretto|String}
     */
    val: function(value) {
      return typeof value !== "undefined" ? this.attr("value", value) : this.length > 0 ? this[0].value : null;
    }
  };


  /**
   * Create a new Toretto object.
   */
  function toretto(elements) {
    return new Toretto(elements);
  }


  toretto.each   = each;
  toretto.fn     = Toretto.prototype;
  toretto.map    = map;
  toretto.unique = unique;


  return toretto;
});