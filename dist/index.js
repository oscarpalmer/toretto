// node_modules/@oscarpalmer/atoms/dist/js/string/index.mjs
function getString(value2) {
  if (typeof value2 === "string") {
    return value2;
  }
  if (typeof value2 !== "object" || value2 == null) {
    return String(value2);
  }
  const valueOff = value2.valueOf?.() ?? value2;
  const asString = valueOff?.toString?.() ?? String(valueOff);
  return asString.startsWith("[object ") ? JSON.stringify(value2) : asString;
}
function parse(value2, reviver) {
  try {
    return JSON.parse(value2, reviver);
  } catch {
  }
}
// node_modules/@oscarpalmer/atoms/dist/js/is.mjs
function isNullableOrWhitespace(value2) {
  return value2 == null || /^\s*$/.test(getString(value2));
}
function isPlainObject(value2) {
  if (typeof value2 !== "object" || value2 === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value2);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value2) && !(Symbol.iterator in value2);
}

// src/attribute.ts
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
  if (isPlainObject(first) && typeof first?.name === "string") {
    setAttributeValue(element, first.name, first.value);
  } else if (typeof first === "string") {
    setAttributeValue(element, first, second);
  }
}
function setAttributeValue(element, name, value2) {
  if (value2 == null) {
    element.removeAttribute(name);
  } else {
    element.setAttribute(name, typeof value2 === "string" ? value2 : getString(value2));
  }
}
function setAttributes(element, attributes) {
  const isArray = Array.isArray(attributes);
  const entries = Object.entries(attributes);
  const { length } = entries;
  for (let index = 0;index < length; index += 1) {
    const entry = entries[index];
    if (isArray) {
      setAttributeValue(element, entry[1].name, entry[1].value);
    } else {
      setAttributeValue(element, entry[0], entry[1]);
    }
  }
}
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
// src/internal/element-value.ts
function setElementValues(element, first, second, callback) {
  if (isPlainObject(first)) {
    const entries = Object.entries(first);
    const { length } = entries;
    for (let index = 0;index < length; index += 1) {
      const [key, value2] = entries[index];
      callback(element, key, value2);
    }
  } else if (first != null) {
    callback(element, first, second);
  }
}
function updateElementValue(element, key, value2, set3, remove, json) {
  if (isNullableOrWhitespace(value2)) {
    remove.call(element, key);
  } else {
    set3.call(element, key, json ? JSON.stringify(value2) : String(value2));
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
  const value2 = element.dataset[key];
  if (value2 != null) {
    return parse(value2);
  }
}
function setData(element, first, second) {
  setElementValues(element, first, second, updateDataAttribute);
}
function updateDataAttribute(element, key, value2) {
  updateElementValue(element, `data-${key}`, value2, element.setAttribute, element.removeAttribute, true);
}
// src/find.ts
function calculateDistance(origin, target) {
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
      const value2 = callback.call(contexts[index], selector);
      if (single) {
        if (value2 == null) {
          continue;
        }
        return value2;
      }
      result.push(...Array.from(value2));
    }
    return single ? undefined : result.filter((value2, index, array2) => array2.indexOf(value2) === index);
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
    const distance = calculateDistance(origin, element);
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
  return (item.element.disabled ?? false) || item.element.getAttribute("aria-disabled") === "true";
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
function setStyle(element, property, value2) {
  setElementValues(element, property, value2, updateStyleProperty);
}
function setStyles(element, styles) {
  setElementValues(element, styles, null, updateStyleProperty);
}
function updateStyleProperty(element, key, value2) {
  updateElementValue(element, key, value2, function(property, value3) {
    this.style[property] = value3;
  }, function(property) {
    this.style[property] = "";
  }, false);
}
export {
  setStyles,
  setStyle,
  setData,
  setAttributes,
  setAttribute,
  isTabbable,
  isInvalidBooleanAttribute,
  isFocusable,
  isEmptyNonBooleanAttribute,
  isBooleanAttribute,
  isBadAttribute,
  getTextDirection,
  getTabbable,
  getStyles,
  getStyle,
  getFocusable,
  getElementUnderPointer,
  getData,
  findRelatives,
  findElements,
  findElement,
  findAncestor,
  booleanAttributes,
  findElements as $$,
  findElement as $
};
