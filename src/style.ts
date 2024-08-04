import {setElementValues, updateElementValue} from './internal/element-value';

/**
 * Get a style from an element
 */
export function getStyle(
	element: HTMLElement,
	property: keyof CSSStyleDeclaration,
): string {
	return element.style[property as never];
}

/**
 * Get styles from an element
 */
export function getStyles<Property extends keyof CSSStyleDeclaration>(
	element: HTMLElement,
	properties: Property[],
): Pick<CSSStyleDeclaration, Property> {
	const styles = {} as Pick<CSSStyleDeclaration, Property>;
	const {length} = properties;

	for (let index = 0; index < length; index += 1) {
		const property = properties[index];

		styles[property] = element.style[property as never] as never;
	}

	return styles;
}

/**
 * Set a style on an element
 */
export function setStyle(
	element: HTMLElement,
	property: keyof CSSStyleDeclaration,
	value?: string,
): void {
	setElementValues(element, property as string, value, updateStyleProperty);
}

/**
 * Set styles on an element
 */
export function setStyles(
	element: HTMLElement,
	styles: Partial<CSSStyleDeclaration>,
): void {
	setElementValues(element, styles as string, null, updateStyleProperty);
}

function updateStyleProperty(
	element: HTMLElement,
	key: string,
	value: unknown,
): void {
	updateElementValue(
		element,
		key,
		value,
		function (this: HTMLElement, property: string, value: string) {
			this.style[property as never] = value;
		},
		function (this: HTMLElement, property: string) {
			this.style[property as never] = '';
		},
		false,
	);
}
