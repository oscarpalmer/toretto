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
export {
  setData,
  setAttributes,
  setAttribute,
  isInvalidBooleanAttribute,
  isEmptyNonBooleanAttribute,
  isBooleanAttribute,
  isBadAttribute,
  getData,
  booleanAttributes
};
