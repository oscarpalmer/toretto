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
// src/attribute.ts
function setAttribute(element, name, value2) {
  setAttributeValue(element, name, value2);
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
export {
  setAttributes,
  setAttribute
};
