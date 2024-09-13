import type { HTMLOrSVGElement, TextDirection } from './models';
/**
 * Get a style from an element
 */
export declare function getStyle(element: HTMLOrSVGElement, property: keyof CSSStyleDeclaration): string;
/**
 * Get styles from an element
 */
export declare function getStyles<Property extends keyof CSSStyleDeclaration>(element: HTMLOrSVGElement, properties: Property[]): Pick<CSSStyleDeclaration, Property>;
/**
 * Get the text direction of an element
 */
export declare function getTextDirection(element: Element): TextDirection;
/**
 * Set a style on an element
 */
export declare function setStyle(element: HTMLOrSVGElement, property: keyof CSSStyleDeclaration, value?: string): void;
/**
 * Set styles on an element
 */
export declare function setStyles(element: HTMLOrSVGElement, styles: Partial<CSSStyleDeclaration>): void;
