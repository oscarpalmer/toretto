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
  htmlString = /^\s*<(\w+|!)[^>]*>/;

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
   * Get raw value from data attribute.
   */
  function dataValue(value) {
    return value === "null" ? null :
           value === "undefined" ? undefined :
           value === "false" ? false :
           value === "true" ? true :
           /^\d+$/.test(value) ? value++ :
           value;
  }

  /**
   * Uncamelcase string for CSS.
   */
  function unCamelCase(string) {
    return string.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  }

  /**
   * Loop arrays or objects.
   */
  function each(obj, fn, scope) {
    var
    index,
    langd;

    if (likeArray(obj)) {
      for (index = 0, langd = obj.length; index < langd; index++) {
        fn.call(scope || obj[index], obj[index], index, obj);
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
    element = doc.createElement("div"),
    results = [];

    element.innerHTML = typeof html === "string" ? html : "";

    each(element.childNodes, function(node) {
      if (isNodeLike(node)) {
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
    langd = obj.length;

    for (; index < langd; index++) {
      if (obj[index] === item) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if object is like a node.
   */
  function isNodeLike(obj) {
    return obj && (obj.nodeType === 1 || obj.nodeType === 9 || obj === obj.window);
  }

  /**
   * Check if object is like an array, i.e. an array or an array-like object.
   */
  function likeArray(obj) {
    return obj && (
           obj instanceof Array || (
             typeof obj !== "string" &&
             typeof obj.length === "number" &&
             obj.length - 1 in obj)
           );
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
           isNodeLike(obj) ? [obj] :
           htmlString.exec(obj) ? htmlify(obj) :
           [];
  }

  /**
   * Trim string; remove leading and trailing whitespace and fix spaces.
   */
  function trim(string) {
    return string.replace(/(^\s*|\s*$)/g, "").replace(/\s+/g, " ");
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

    this.length = elements.length;

    each(elements, function(node, index) {
      this[index] = node;
    }, this);
  }

  /**
   * Toretto's prototypal functions.
   */
  Toretto.prototype = {
    /**
     * Add class(es) to nodes.
     */
    addClass: function(name) {
      name = name.split(/\s+/);

      return this.each(function(node) {
        each(name, function(klass) {
          if (!hasClass(node, klass)) {
            node.className += " " + klass;
          }
        });

        node.className = trim(node.className);
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
          node.parentNode.insertBefore(item.cloneNode(true), next);
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
          node.insertBefore(item.cloneNode(true), null);
        });
      });
    },

    /**
     * Get or set attributes.
     */
    attr: function(attr, value) {
      if (typeOf(attr) === "object") {
        each(attr, function(key, value) {
          this.attr(key, value);
        }, this);

        return this;
      }

      return typeof value === "string" ?
        this.each(function(node) {
          node.setAttribute(attr, value);
        }) :
        this.length > 0 ?
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
          node.parentNode.insertBefore(item.cloneNode(true), node);
        });
      });
    },

    /**
     * Add CSS to nodes or get style value for the first node.
     */
    css: function(style, value) {
      if (typeOf(style) === "object") {
        each(style, function(key, value) {
          this.css(key, value);
        }, this);

        return this;
      }

      return typeof value === "string" ?
        this.each(function(node) {
          node.style[camelCase(style)] = value;
        }) :
        this.length > 0 ?
          win.getComputedStyle(this[0], null).getPropertyValue(unCamelCase(style)) :
          null;
    },

    /**
     * Get or set data attributes.
     */
    data: function(attr, value) {
      if (typeOf(attr) === "object") {
        each(attr, function(key, value) {
          this.attr("data-" + key, "" + value);
        }, this);

        return this;
      }

      return typeof value === "string" ?
        this.attr("data-" + attr, "" + value) :
        this.length > 0 ?
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
        while (node.firstChild) {
          node.removeChild(node.firstChild);
        }
      });
    },

    /**
     * Get a new Toretto object containing node matching index.
     */
    eq: function(index) {
      return toretto(index >= 0 && index < this.length ? this[index] : null);
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
      return index >= 0 && index < this.length ? this[index] : null;
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
    html: function(html) {
      return typeof html === "string" ?
        this.each(function(node) {
          node.innerHTML = html;
        }) :
        this.length > 0 ?
          this[0].innerHTML :
          null;
    },

    /**
     * Get a new Toretto object containing the last node.
     */
    last: function() {
      return this.eq(this.length - 1);
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
        return node.parentNode;
      })));
    },

    /**
     * Prepend HTML to nodes.
     */
    prepend: function(html) {
      var
      first;

      html = normalize(html);

      return this.each(function(node) {
        first = node.firstChild;

        each(html, function(item) {
          node.insertBefore(item.cloneNode(true), first);
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
        node.parentNode.removeChild(node);
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
            node.className = node.className.replace(classRegex(klass), " ");
          }
        });

        node.className = trim(node.className);
      });
    },

    /**
     * Get text for the first node or set text for all nodes.
     */
    text: function(text) {
      var
      method = docEl.textContent ? "textContent" : "innerText";

      return typeof text === "string" ?
        this.each(function(node) {
          node[method] = text;
        }) :
        this.length > 0 ?
          this[0][method] :
          null;
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

        node.className = trim(node.className);
      });
    },

    /**
     * Get value for the first node or set value for all nodes.
     */
    val: function(value) {
      return typeof value !== "undefined" ?
        this.attr("value", value) :
        this.length > 0 ?
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

  toretto.each   = each;
  toretto.fn     = Toretto.prototype;
  toretto.map    = map;
  toretto.unique = unique;

  return toretto;
});