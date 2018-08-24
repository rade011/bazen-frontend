window.dome = (function () {
  // First, we have a Dome function; it will eventually be a constructor function
  // for the instances of our library; those objects will wrap our selected or created elements.
  function Dome(els) {
    for (let i = 0; i < els.length; i++) {
      this[i] = els[i]
    }
    this.length = els.length;
  }

  // Utils Fn
  Dome.prototype.map = function (callback) {
    var results = [], i = 0;
    for ( ; i < this.length; i++) {
      results.push(callback.call(this, this[i], i));
    }
    return results;
  };

  Dome.prototype.forEach = function (callback) {
    this.map(callback);
    return this;
  };

  Dome.prototype.mapOne = function (callback) {
    var m = this.map(callback)
    return m.length > 1 ? m : m[0]
  };

  Dome.prototype.text = function (text) {
    if (typeof text !== "undefined") {
      return this.forEach(function (el) {
        el.innerText = text;
      })
    }  else {
      return this.mapOne(function (el) {
        return el.innerText
      })
    }
  };

  Dome.prototype.addClass = function (classes) {
    var className = "";
    if (typeof  classes !== "string") {
      for (let i = 0; i < classes.length; i++) {
        className += " " + classes[i]
      }
    } else {
      className = " " + classes;
    }
    return this.forEach(function (el) {
      el.className += className;
    })
  };

  Dome.prototype.removeClass = function (clazz) {
    return this.forEach(function (el) {
      var cs = el.className.split(" "), i;

      while ( (i = cs.indexOf(clazz)) > -1) {
        cs = cs.slice(0, i).concat(cs.slice(++i));
      }
      el.className = cs.join(" ");
    });
  };

  // IE8 typeOf fix
  if (typeof  Array.prototype.indexOf !== "function") {
    Array.prototype.indexOf = function (item) {
      for(let i = 0; i < this.length; i++) {
        if (this[i] === item) {
          return i;
        }
      }
    }
  }

  Dome.prototype.attr = function (attr, val) {
    if (typeof val !== "undefined") {
      return this.forEach(function (el) {
        el.setAttribute(attr, value)
      });
    } else {
      return this.mapOne(function (el) {
        return el.getAttribute(attr)
      });
    }
  };



  var dome = {
    get: function(selector) {
      var els;
      if (typeof  selector === "string") {
        els = document.querySelectorAll(selector)
      } else if (selector.length) {
        els = selector;
      } else {
        els = [selector]
      }
      return new Dome(els)
    },

    create: function (tagName, attrs) {
      var el = new Dome([document.createElement(tagName)]);
      if (attrs) {
        el.addClass(attrs.className);
        delete attrs.className
      }
      if (attrs.text) {
        el.text(attrs.text);
        delete attrs.text
      }
      for (let key in attrs) {
        if (attrs.hasOwnProperty(key)) {
          el.attr(key,attrs[key])
        }
      }
      return el;
    }
  };

  return dome;
}());
