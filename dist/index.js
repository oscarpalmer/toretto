// node_modules/@oscarpalmer/atoms/dist/js/string/index.mjs
function getString(value) {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value !== "object" || value == null) {
    return String(value);
  }
  const valueOff = value.valueOf?.() ?? value;
  const asString = valueOff?.toString?.() ?? String(valueOff);
  return asString.startsWith("[object ") ? JSON.stringify(value) : asString;
}
function parse(value, reviver) {
  try {
    return JSON.parse(value, reviver);
  } catch {
  }
}

// node_modules/@oscarpalmer/atoms/dist/js/is.mjs
function isNullableOrWhitespace(value) {
  return value == null || /^\s*$/.test(getString(value));
}
function isPlainObject(value) {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
}

// src/attribute.ts
var booleanAttributes = Object.freeze([
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "hidden",
  "inert",
  "ismap",
  "itemscope",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected"
]);
var onPrefix = /^on/i;
var sourcePrefix = /^(href|src|xlink:href)$/i;
var valuePrefix = /(data:text\/html|javascript:)/i;
function isBadAttribute(attribute) {
  return onPrefix.test(attribute.name) || sourcePrefix.test(attribute.name) && valuePrefix.test(attribute.value);
}
function isBooleanAttribute(name) {
  return booleanAttributes.includes(name.toLowerCase());
}
function isEmptyNonBooleanAttribute(attribute) {
  return !booleanAttributes.includes(attribute.name) && attribute.value.trim().length === 0;
}
function isInvalidBooleanAttribute(attribute) {
  if (!booleanAttributes.includes(attribute.name)) {
    return true;
  }
  const normalised = attribute.value.toLowerCase().trim();
  return !(normalised.length === 0 || normalised === attribute.name || attribute.name === "hidden" && normalised === "until-found");
}
function setAttribute(element, first, second) {
  updateValue(element, first, second, updateAttribute);
}
function setAttributes(element, attributes) {
  updateValues(element, attributes);
}
function setProperty(element, first, second) {
  updateValue(element, first, second, updateProperty);
}
function setProperties(element, properties) {
  updateValues(element, properties, updateProperty);
}
function updateAttribute(element, name, value) {
  const normalised = name.toLowerCase();
  if (booleanAttributes.includes(normalised)) {
    updateProperty(element, name, value, false);
  } else if (value == null) {
    element.removeAttribute(name);
  } else {
    element.setAttribute(name, typeof value === "string" ? value : getString(value));
  }
}
function updateProperty(element, name, value, validate) {
  const actual = validate ?? true ? name.toLowerCase() : name;
  if (actual === "hidden") {
    element.hidden = typeof value === "string" && value.toLowerCase() === "until-found" ? "until-found" : value === "" || value === true;
  } else {
    element[actual] = value === "" || typeof value === "string" && value.toLowerCase() === actual || value === true;
  }
}
function updateValue(element, first, second, callback) {
  if (isPlainObject(first) && typeof first?.name === "string") {
    callback(element, first.name, first.value);
  } else if (typeof first === "string") {
    callback(element, first, second);
  }
}
function updateValues(element, values, callback) {
  const isArray = Array.isArray(values);
  const entries = Object.entries(values);
  const { length } = entries;
  for (let index = 0;index < length; index += 1) {
    const entry = entries[index];
    if (isArray) {
      (callback ?? updateAttribute)(element, entry[1].name, entry[1].value);
    } else {
      (callback ?? updateAttribute)(element, entry[0], entry[1]);
    }
  }
}
// src/internal/element-value.ts
function setElementValues(element, first, second, callback) {
  if (isPlainObject(first)) {
    const entries = Object.entries(first);
    const { length } = entries;
    for (let index = 0;index < length; index += 1) {
      const [key, value] = entries[index];
      callback(element, key, value);
    }
  } else if (first != null) {
    callback(element, first, second);
  }
}
function updateElementValue(element, key, value, set2, remove, json) {
  if (isNullableOrWhitespace(value)) {
    remove.call(element, key);
  } else {
    set2.call(element, key, json ? JSON.stringify(value) : String(value));
  }
}

// src/data.ts
function getData(element, keys) {
  if (typeof keys === "string") {
    return getDataValue(element, keys);
  }
  const { length } = keys;
  const data = {};
  for (let index = 0;index < length; index += 1) {
    const key = keys[index];
    data[key] = getDataValue(element, key);
  }
  return data;
}
function getDataValue(element, key) {
  const value = element.dataset[key];
  if (value != null) {
    return parse(value);
  }
}
function setData(element, first, second) {
  setElementValues(element, first, second, updateDataAttribute);
}
function updateDataAttribute(element, key, value) {
  updateElementValue(element, `data-${key}`, value, element.setAttribute, element.removeAttribute, true);
}
// src/internal/get-value.ts
function getBoolean(value, defaultValue) {
  return typeof value === "boolean" ? value : defaultValue ?? false;
}

// src/event.ts
function createDispatchOptions(options) {
  return {
    bubbles: getBoolean(options?.bubbles),
    cancelable: getBoolean(options?.cancelable),
    composed: getBoolean(options?.composed)
  };
}
function createEvent(type, options) {
  const hasOptions = isPlainObject(options);
  if (hasOptions && "detail" in options) {
    return new CustomEvent(type, {
      ...createDispatchOptions(options),
      detail: options?.detail
    });
  }
  return new Event(type, createDispatchOptions(hasOptions ? options : {}));
}
function createEventOptions(options) {
  return {
    capture: getBoolean(options?.capture),
    once: getBoolean(options?.once),
    passive: getBoolean(options?.passive, true),
    signal: options?.signal
  };
}
function dispatch(target, type, options) {
  target.dispatchEvent(createEvent(type, options));
}
function getPosition(event) {
  let x;
  let y;
  if (event instanceof MouseEvent) {
    x = event.clientX;
    y = event.clientY;
  } else if (event instanceof TouchEvent) {
    x = event.touches[0]?.clientX;
    y = event.touches[0]?.clientY;
  }
  return typeof x === "number" && typeof y === "number" ? { x, y } : undefined;
}
function off(target, type, listener, options) {
  target.removeEventListener(type, listener, createEventOptions(options));
}
function on(target, type, listener, options) {
  const extended = createEventOptions(options);
  target.addEventListener(type, listener, extended);
  return () => {
    target.removeEventListener(type, listener, extended);
  };
}
// src/find.ts
function getDistanceBetweenElements(origin, target) {
  if (origin === target || origin.parentElement === target) {
    return 0;
  }
  const comparison = origin.compareDocumentPosition(target);
  const children = [...origin.parentElement?.children ?? []];
  switch (true) {
    case children.includes(target):
      return Math.abs(children.indexOf(origin) - children.indexOf(target));
    case !!(comparison & 2 || comparison & 8):
      return traverse(origin, target);
    case !!(comparison & 4 || comparison & 16):
      return traverse(target, origin);
    default:
      return -1;
  }
}
function findAncestor(origin, selector) {
  if (origin == null || selector == null) {
    return null;
  }
  if (typeof selector === "string") {
    if (origin.matches?.(selector)) {
      return origin;
    }
    return origin.closest(selector);
  }
  if (selector(origin)) {
    return origin;
  }
  let parent = origin.parentElement;
  while (parent != null && !selector(parent)) {
    if (parent === document.body) {
      return null;
    }
    parent = parent.parentElement;
  }
  return parent;
}
function findElement(selector, context) {
  return findElementOrElements(selector, context, true);
}
function findElementOrElements(selector, context, single) {
  const callback = single ? document.querySelector : document.querySelectorAll;
  const contexts = context == null ? [document] : findElementOrElements(context, undefined, false);
  const result = [];
  if (typeof selector === "string") {
    const { length: length2 } = contexts;
    for (let index = 0;index < length2; index += 1) {
      const value = callback.call(contexts[index], selector);
      if (single) {
        if (value == null) {
          continue;
        }
        return value;
      }
      result.push(...Array.from(value));
    }
    return single ? undefined : result.filter((value, index, array) => array.indexOf(value) === index);
  }
  const nodes = Array.isArray(selector) ? selector : selector instanceof NodeList ? Array.from(selector) : [selector];
  const { length } = nodes;
  for (let index = 0;index < length; index += 1) {
    const node = nodes[index];
    const element = node instanceof Document ? node.body : node instanceof Element ? node : undefined;
    if (element != null && (context == null || contexts.length === 0 || contexts.some((context2) => context2 === element || context2.contains(element))) && !result.includes(element)) {
      result.push(element);
    }
  }
  return result;
}
function findElements(selector, context) {
  return findElementOrElements(selector, context, false);
}
function findRelatives(origin, selector, context) {
  if (origin.matches(selector)) {
    return [origin];
  }
  const elements = [...(context ?? document).querySelectorAll(selector)];
  const { length } = elements;
  if (length === 0) {
    return [];
  }
  const distances = [];
  let minimum = null;
  for (let index = 0;index < length; index += 1) {
    const element = elements[index];
    const distance = getDistanceBetweenElements(origin, element);
    if (distance < 0) {
      continue;
    }
    if (minimum == null || distance < minimum) {
      minimum = distance;
    }
    distances.push({
      distance,
      element
    });
  }
  return minimum == null ? [] : distances.filter((found) => found.distance === minimum).map((found) => found.element);
}
function getElementUnderPointer(skipIgnore) {
  const elements = [...document.querySelectorAll(":hover")];
  const { length } = elements;
  const returned = [];
  for (let index = 0;index < length; index += 1) {
    const element = elements[index];
    if (/^head$/i.test(element.tagName)) {
      continue;
    }
    const style = getComputedStyle(element);
    if (skipIgnore === true || style.pointerEvents !== "none" && style.visibility !== "hidden") {
      returned.push(element);
    }
  }
  return returned.at(-1);
}
function traverse(from, to) {
  const children = [...to.children];
  if (children.includes(from)) {
    return children.indexOf(from) + 1;
  }
  let current = from;
  let distance = 0;
  let parent = from.parentElement;
  while (parent != null) {
    if (parent === to) {
      return distance + 1;
    }
    const children2 = [...parent.children ?? []];
    if (children2.includes(to)) {
      return distance + Math.abs(children2.indexOf(current) - children2.indexOf(to));
    }
    const index = children2.findIndex((child) => child.contains(to));
    if (index > -1) {
      return distance + Math.abs(index - children2.indexOf(current)) + traverse(to, children2[index]);
    }
    current = parent;
    distance += 1;
    parent = parent.parentElement;
  }
  return -1e6;
}
// src/focusable.ts
var focusableFilters = [isDisabled, isInert, isHidden, isSummarised];
var selector = [
  '[contenteditable]:not([contenteditable="false"])',
  "[tabindex]:not(slot)",
  "a[href]",
  "audio[controls]",
  "button",
  "details",
  "details > summary:first-of-type",
  "input",
  "select",
  "textarea",
  "video[controls]"
].map((selector2) => `${selector2}:not([inert])`).join(",");
var tabbableFilters = [
  isNotTabbable,
  isNotTabbableRadio,
  ...focusableFilters
];
function getFocusable(parent) {
  return getValidElements(parent, focusableFilters, false);
}
function getItem(element, tabbable) {
  return {
    element,
    tabIndex: tabbable ? getTabIndex(element) : -1
  };
}
function getTabbable(parent) {
  return getValidElements(parent, tabbableFilters, true);
}
function getTabIndex(element) {
  const tabIndex = element?.tabIndex ?? -1;
  if (tabIndex < 0 && (/^(audio|details|video)$/i.test(element.tagName) || isEditable(element)) && !hasTabIndex(element)) {
    return 0;
  }
  return tabIndex;
}
function getValidElements(parent, filters, tabbable) {
  const elements = [...parent.querySelectorAll(selector)];
  const items = [];
  let { length } = elements;
  for (let index = 0;index < length; index += 1) {
    const item = getItem(elements[index], tabbable);
    if (!filters.some((filter2) => filter2(item))) {
      items.push(item);
    }
  }
  if (!tabbable) {
    return items.map((item) => item.element);
  }
  const indiced = [];
  const zeroed = [];
  length = items.length;
  for (let index = 0;index < length; index += 1) {
    const item = items[index];
    if (item.tabIndex === 0) {
      zeroed.push(item.element);
    } else {
      indiced[item.tabIndex] = [
        ...indiced[item.tabIndex] ?? [],
        item.element
      ];
    }
  }
  return [...indiced.flat(), ...zeroed];
}
function hasTabIndex(element) {
  return !Number.isNaN(Number.parseInt(element.getAttribute("tabindex"), 10));
}
function isDisabled(item) {
  if (/^(button|input|select|textarea)$/i.test(item.element.tagName) && isDisabledFromFieldset(item.element)) {
    return true;
  }
  return item.element.disabled ?? false;
}
function isDisabledFromFieldset(element) {
  let parent = element.parentElement;
  while (parent != null) {
    if (parent instanceof HTMLFieldSetElement && parent.disabled) {
      const children = Array.from(parent.children);
      const { length } = children;
      for (let index = 0;index < length; index += 1) {
        const child = children[index];
        if (child instanceof HTMLLegendElement) {
          return parent.matches("fieldset[disabled] *") ? true : !child.contains(element);
        }
      }
      return true;
    }
    parent = parent.parentElement;
  }
  return false;
}
function isEditable(element) {
  return /^(|true)$/i.test(element.getAttribute("contenteditable"));
}
function isFocusable(element) {
  return isValidElement(element, focusableFilters, false);
}
function isHidden(item) {
  if ((item.element.hidden ?? false) || item.element instanceof HTMLInputElement && item.element.type === "hidden") {
    return true;
  }
  const isDirectSummary = item.element.matches("details > summary:first-of-type");
  const nodeUnderDetails = isDirectSummary ? item.element.parentElement : item.element;
  if (nodeUnderDetails?.matches("details:not([open]) *") ?? false) {
    return true;
  }
  const style = getComputedStyle(item.element);
  if (style.display === "none" || style.visibility === "hidden") {
    return true;
  }
  const { height, width } = item.element.getBoundingClientRect();
  return height === 0 && width === 0;
}
function isInert(item) {
  return (item.element.inert ?? false) || /^(|true)$/i.test(item.element.getAttribute("inert")) || item.element.parentElement != null && isInert({
    element: item.element.parentElement,
    tabIndex: -1
  });
}
function isNotTabbable(item) {
  return (item.tabIndex ?? -1) < 0;
}
function isNotTabbableRadio(item) {
  if (!(item.element instanceof HTMLInputElement) || item.element.type !== "radio" || !item.element.name || item.element.checked) {
    return false;
  }
  const parent = item.element.form ?? item.element.getRootNode?.() ?? item.element.ownerDocument;
  const realName = CSS?.escape?.(item.element.name) ?? item.element.name;
  const radios = Array.from(parent.querySelectorAll(`input[type="radio"][name="${realName}"]`));
  const checked = radios.find((radio) => radio.checked);
  return checked != null && checked !== item.element;
}
function isSummarised(item) {
  return item.element instanceof HTMLDetailsElement && Array.from(item.element.children).some((child) => /^summary$/i.test(child.tagName));
}
function isTabbable(element) {
  return isValidElement(element, tabbableFilters, true);
}
function isValidElement(element, filters, tabbable) {
  const item = getItem(element, tabbable);
  return !filters.some((filter2) => filter2(item));
}
// src/sanitise.ts
function sanitise(value, options) {
  return sanitiseNodes(Array.isArray(value) ? value : [value], {
    sanitiseBooleanAttributes: options?.sanitiseBooleanAttributes ?? true
  });
}
function sanitiseAttributes(element, attributes, options) {
  const { length } = attributes;
  for (let index = 0;index < length; index += 1) {
    const attribute = attributes[index];
    if (isBadAttribute(attribute) || isEmptyNonBooleanAttribute(attribute)) {
      element.removeAttribute(attribute.name);
    } else if (options.sanitiseBooleanAttributes && isInvalidBooleanAttribute(attribute)) {
      element.setAttribute(attribute.name, "");
    }
  }
}
function sanitiseNodes(nodes, options) {
  const { length } = nodes;
  for (let index = 0;index < length; index += 1) {
    const node = nodes[index];
    if (node instanceof Element) {
      sanitiseAttributes(node, [...node.attributes], options);
    }
    sanitiseNodes([...node.childNodes], options);
  }
  return nodes;
}

// src/html.ts
var templates = {};
function createTemplate(html) {
  const template2 = document.createElement("template");
  template2.innerHTML = html;
  templates[html] = template2;
  return template2;
}
function getTemplate(value) {
  if (value.trim().length === 0) {
    return;
  }
  let template2;
  if (/^[\w-]+$/.test(value)) {
    template2 = document.querySelector(`#${value}`);
  }
  if (template2 instanceof HTMLTemplateElement) {
    return template2;
  }
  return templates[value] ?? createTemplate(value);
}
function html(value, sanitisation) {
  const options = sanitisation == null || sanitisation === true ? {} : isPlainObject(sanitisation) ? { ...sanitisation } : null;
  const template2 = value instanceof HTMLTemplateElement ? value : typeof value === "string" ? getTemplate(value) : null;
  if (template2 == null) {
    return [];
  }
  const cloned = template2.content.cloneNode(true);
  const scripts = cloned.querySelectorAll("script");
  const { length } = scripts;
  for (let index = 0;index < length; index += 1) {
    scripts[index].remove();
  }
  cloned.normalize();
  return options != null ? sanitise([...cloned.childNodes], options) : [...cloned.childNodes];
}
// src/is.ts
function isChildNode(value, ignoreDocumentType) {
  return value instanceof CharacterData || (value instanceof DocumentType ? ignoreDocumentType !== true : false) || value instanceof Element;
}
function isHTMLOrSVGElement(value) {
  return value instanceof HTMLElement || value instanceof SVGElement;
}
function isInDocument(node, document2) {
  return document2 == null ? node.ownerDocument?.contains(node) ?? false : node.ownerDocument === document2 && document2.contains(node);
}
// src/style.ts
function getStyle(element, property) {
  return element.style[property];
}
function getStyles(element, properties) {
  const styles = {};
  const { length } = properties;
  for (let index = 0;index < length; index += 1) {
    const property = properties[index];
    styles[property] = element.style[property];
  }
  return styles;
}
function getTextDirection(element) {
  const direction = element.getAttribute("dir");
  if (direction != null && /^(ltr|rtl)$/i.test(direction)) {
    return direction.toLowerCase();
  }
  return getComputedStyle?.(element)?.direction === "rtl" ? "rtl" : "ltr";
}
function setStyle(element, property, value) {
  setElementValues(element, property, value, updateStyleProperty);
}
function setStyles(element, styles) {
  setElementValues(element, styles, null, updateStyleProperty);
}
function updateStyleProperty(element, key, value) {
  updateElementValue(element, key, value, function(property, value2) {
    this.style[property] = value2;
  }, function(property) {
    this.style[property] = "";
  }, false);
}
export {
  setStyles,
  setStyle,
  setProperty,
  setProperties,
  setData,
  setAttributes,
  setAttribute,
  sanitise,
  on,
  off,
  isTabbable,
  isInvalidBooleanAttribute,
  isInDocument,
  isHTMLOrSVGElement,
  isFocusable,
  isEmptyNonBooleanAttribute,
  isChildNode,
  isBooleanAttribute,
  isBadAttribute,
  html,
  getTextDirection,
  getTabbable,
  getStyles,
  getStyle,
  getPosition,
  getFocusable,
  getElementUnderPointer,
  getDistanceBetweenElements,
  getData,
  findRelatives,
  findElements,
  findElement,
  findAncestor,
  dispatch,
  booleanAttributes,
  findElements as $$,
  findElement as $
};
