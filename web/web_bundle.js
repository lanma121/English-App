function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.dom = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.insertText = _exports.insertHtml = _exports.insertElement = _exports.insert = _exports.drag = _exports.createEelement = _exports.bindEvents = _exports.addEventListener = _exports.$e = void 0;
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
  function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  var insertHtml = _exports.insertHtml = function insertHtml(targetElement, htmlContent) {
    var insertPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'beforeend';
    if (!targetElement) {
      throw new Error('Target element is null or undefined');
    }
    if (typeof targetElement.insertAdjacentHTML === 'function') {
      targetElement.insertAdjacentHTML(insertPosition, htmlContent);
    } else {
      targetElement.innerHTML = htmlContent;
    }
    return targetElement;
  };
  var insertText = _exports.insertText = function insertText(element, content) {
    var position = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'beforeend';
    if (!element) {
      throw new Error('Element is null or undefined');
    }
    var newContent = (element.textContent || '') + (content || '');
    if (element.insertAdjacentText) {
      element.insertAdjacentText(position, content);
    } else {
      element.textContent = newContent;
    }
    return element;
  };
  var insertElement = _exports.insertElement = function insertElement(target, element) {
    var position = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'beforeend';
    if (!target || !element) {
      throw new Error('Target or element is null or undefined');
    }
    if (target.insertAdjacentElement) {
      target.insertAdjacentElement(position, element);
    } else {
      target.appendChild(element);
    }
    return target;
  };

  /**
   * Inserts HTML content into an element at the specified position.
   *
   * @param {Element} target - The element to insert the HTML into.
   * @param {string|Element|NodeList} content - The HTML content to insert. Can be a string, an Element, or a NodeList.
   * @param {string} [position='beforeend'] - The position to insert the content. Defaults to 'beforeend'.
   * @returns {Element} The target element with the content inserted.
   * @throws {Error} If the target is null or undefined.
   * @throws {Error} If the content is not a string, an Element, or a NodeList.
   */
  var insert = _exports.insert = function insert(target, content) {
    var position = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'beforeend';
    if (!target) {
      throw new Error('Target element is null or undefined');
    }
    if (content && typeof content === 'string') {
      var isHtmlString = content.trimStart().startsWith('<');
      if (isHtmlString) {
        insertHtml(target, content, position);
      } else {
        insertText(target, content, position);
      }
    } else if (content instanceof Element) {
      insertElement(target, content, position);
    } else if (content instanceof NodeList) {
      target.append.apply(target, _toConsumableArray(Array.from(content)));
    } else {
      throw new Error('Content is not a string, Element, or NodeList');
    }
    return target;
  };

  /**
   * Creates a new DOM element with the given name and attributes.
   *
   * @param {string} name - The name of the DOM element to create.
   * @param {Object} [attributes={}] - The attributes to set on the created element.
   * @param {Document} [doc=document] - The document to use to create the element.
   * @returns {Element} The new DOM element.
   * @throws {TypeError} If name is not a non-empty string.
   */
  var createEelement = _exports.createEelement = function createEelement(name) {
    var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var doc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document;
    if (typeof name !== "string" || !name) {
      throw new TypeError("Invalid arguments: name must be a non-empty Dom string");
    }
    var el = doc.createElement(name);

    // Set attributes on the element
    for (var key in attributes) {
      var value = attributes[key];
      if (key === "appendEle") {
        $e(value).insert(el);
        continue;
      }
      if (key === "content") {
        insert(el, value);
        continue;
      }
      if (key === "text") {
        el.insertAdjacentText("beforeend", value || "");
        continue;
      }
      if (key === "html") {
        el.insertAdjacentHTML("beforeend", value || "");
        continue;
      }
      if (key === "elements") {
        el.append.apply(el, _toConsumableArray([].concat(value)));
        continue;
      }
      if (key.startsWith("on") && typeof value === "function") {
        bindEvents(el, key.slice(2), value);
        continue;
      }
      el.setAttribute(key, value);
    }

    /**
    * Appends one or more nodes to the current element.
    *
    * @param {...Node|NodeList|HTMLCollection} params - The nodes to append.
    * @return {Element} The current element with the appended nodes.
    */
    el.appends = function () {
      var _ref;
      el.append.apply(el, _toConsumableArray((_ref = []).concat.apply(_ref, arguments)));
      return el;
    };

    /**
     * Append shadow DOM to the element.
     *
     * @param {...string|Node|NodeList|HTMLCollection} params - The nodes to append.
     * @return {Node} Returns the shadowRoot.
     */
    el.createShadowRoot = function () {
      var shadowRoot = el.shadowRoot || el.attachShadow({
        mode: 'open'
      });
      for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }
      return insert.apply(void 0, [shadowRoot].concat(params));
    };
    return el;
  };

  /**
   * Add an event listener to a DOM element.
   *
   * @param {Element} element - The element to add the event listener to.
   * @param {string} eventName - The name of the event to listen for.
   * @param {function} handler - The function to call when the event is fired.
   * @param {Object} [options] - Options to pass to addEventListener.
   * @param {AbortSignal} [options.signal] - An AbortSignal to abort the listener.
   * @returns {AbortController} An AbortController for aborting the listener.
   */
  var addEventListener = _exports.addEventListener = function addEventListener(element, eventName, handler) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    if (!(element !== null && element !== void 0 && element.addEventListener)) {
      throw new Error("event bind failed: Element \"".concat(String(element === null || element === void 0 ? void 0 : element.nodeName), "\" not found"));
    }
    if (!eventName) {
      throw new Error("event bind failed: eventName is missing");
    }
    if (!handler) {
      throw new Error("event bind failed: handler is missing");
    }
    var abortController = new AbortController();
    var listener = function listener(event) {
      try {
        handler(event);
      } catch (error) {
        console.error("error handling event \"".concat(event, "\""), new Error().stack, error);
      }
    };
    // Remove the old listener before adding the new one to prevent multiple handlers.
    element.removeEventListener(eventName, listener, _objectSpread({
      signal: abortController.signal
    }, options));
    element.addEventListener(eventName, listener, _objectSpread({
      signal: abortController.signal
    }, options));
    return abortController;
  };

  /**
  + * Add multiple event listeners to elements.
  + *
  + * @param {Element|string|NodeList} selectorOrElement - The element or selector to add the event listener to.
  + * @param {string} eventName - The name of the event to listen for.
  + * @param {function} handler - The function to call when the event is fired.
  + * @param {Object} [options] - Options to pass to addEventListener.
  + * @param {AbortSignal} [options.signal] - An AbortSignal to abort the listener.
  + * @returns {() => void} A function to abort all the listeners.
  + */
  var bindEvents = _exports.bindEvents = function bindEvents(selectorOrElement, eventName, handler) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    if (!selectorOrElement) {
      throw new Error("bindEvents failed: selectorOrElement is missing or not a truthy value.");
    }
    if (!eventName) {
      throw new Error("bindEvents failed: eventName is missing");
    }
    if (!handler) {
      throw new Error("bindEvents failed: handler is missing");
    }
    var elements = Array.from(typeof selectorOrElement === "string" ? document.querySelectorAll(selectorOrElement) : selectorOrElement instanceof NodeList ? selectorOrElement : [selectorOrElement]);
    var controllers = elements.map(function (element) {
      return addEventListener(element, eventName, handler, options);
    });
    return function (reason) {
      return controllers.forEach(function (controller) {
        return controller.abort(reason);
      });
    };
  };

  /**
   * Set an element as draggable.
   *
   * @param {string|Element|NodeList} selector - The selector of the element to make draggable.
   *
   * @example
   * drag('.myDraggableElement'); // Make all elements with class 'myDraggableElement' draggable.
   * drag(document.getElementById('myElement')); // Make the element with id 'myElement' draggable.
   */
  var drag = _exports.drag = function drag(selector) {
    var isLeftBound = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var isTopBound = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var element = $e(selector);
    element.setAttribute('draggable', true); // Make the element draggable.

    // Store the initial position of the element.
    var startX = 0;
    var startY = 0;
    var initialLeft = Number(getComputedStyle(element).left.replace('px', '')) || 0;
    var initialRight = Number(getComputedStyle(element).right.replace('px', '')) || 0;
    var initialTop = Number(getComputedStyle(element).top.replace('px', '')) || 0;
    var initialBottom = Number(getComputedStyle(element).bottom.replace('px', '')) || 0;

    // Set the event handler for the dragstart event.
    bindEvents(element, 'dragstart', function (event) {
      startX = event.clientX; // Store the x-coordinate of the mouse cursor at the start of the drag.
      startY = event.clientY; // Store the y-coordinate of the mouse cursor at the start of the drag.
    });

    // Set the event handler for the dragend event.
    bindEvents(element, 'dragend', function (event) {
      var xDiff = event.clientX - startX;
      var yDiff = event.clientY - startY;
      if (isLeftBound) {
        element.style.left = "".concat(initialLeft += xDiff, "px");
      } else {
        element.style.right = "".concat(initialRight -= xDiff, "px");
      }
      if (isTopBound) {
        element.style.top = "".concat(initialTop += yDiff, "px");
      } else {
        element.style.bottom = "".concat(initialBottom -= yDiff, "px");
      }
    });
  };
  var $e = _exports.$e = function $e(selector) {
    var doc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    var elements = typeof selector === 'string' ? doc.querySelectorAll(selector) : selector;
    if (!elements || elements instanceof NodeList && !elements.length) {
      throw new Error("Element \"".concat(selector, "\" not found"));
    }
    var element = elements.length > 1 ? elements : elements[0] || elements;
    element.insert = function (html, position) {
      return insert(element, html, position);
    };
    element.createShadowRoot = function () {
      var shadowRoot = element.shadowRoot || element.attachShadow({
        mode: 'open'
      });
      for (var _len2 = arguments.length, params = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        params[_key2] = arguments[_key2];
      }
      return insert.apply(void 0, [shadowRoot].concat(params));
    };
    element.bindEvents = function () {
      for (var _len3 = arguments.length, params = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        params[_key3] = arguments[_key3];
      }
      return bindEvents.apply(void 0, [element].concat(params));
    };
    return element;
  };
});
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.request = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.request = _exports["default"] = void 0;
  var _excluded = ["data"];
  function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
  function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
  function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
  function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
  function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
  function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], t.indexOf(o) >= 0 || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
  function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.indexOf(n) >= 0) continue; t[n] = r[n]; } return t; }
  var request = _exports.request = function request(url) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$data = _ref.data,
      data = _ref$data === void 0 ? undefined : _ref$data,
      option = _objectWithoutProperties(_ref, _excluded);
    console.log('API request: ', url, data);
    var controller = new AbortController();
    var result = new Promise( /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(resolve, reject) {
        var datas, response;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              datas = data ? {
                data: JSON.stringify(data)
              } : {};
              _context.next = 4;
              return fetch(url, _objectSpread(_objectSpread({
                signal: controller.signal,
                method: data ? "POST" : "GET",
                // *GET, POST, PUT, DELETE, etc.
                // mode: "cors", // no-cors, *cors, same-origin
                // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                // credentials: "same-origin", // include, *same-origin, omit
                headers: {
                  //   "Content-Type": "application/json",
                  //   'Content-Type': 'application/x-www-form-urlencoded',
                  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
                }
              }, option), datas));
            case 4:
              response = _context.sent;
              if (response.ok) {
                _context.next = 7;
                break;
              }
              throw new Error("Network response was not OK");
            case 7:
              resolve(response.json());
              _context.next = 14;
              break;
            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](0);
              console.error(_context.t0);
              reject();
            case 14:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[0, 10]]);
      }));
      return function (_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    }());
    result.controller = controller;
    return result;
  };
  var _default = _exports["default"] = request;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./dom.mjs", "./request.mjs"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./dom.mjs"), require("./request.mjs"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.dom, global.request);
    global.utils = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _dom, _request) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.keys(_dom).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (key in _exports && _exports[key] === _dom[key]) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _dom[key];
      }
    });
  });
  Object.keys(_request).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (key in _exports && _exports[key] === _request[key]) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _request[key];
      }
    });
  });
});

//# sourceMappingURL=web_bundle.js.map