import type {Primitive} from '@oscarpalmer/atoms/models';
import type {DispatchedAttributeName} from './attribute.model';

// #region Types

export type PropertyDispatchedPropertyValue<
	Target extends Element,
	Property extends DispatchedAttributeName,
> = Property extends keyof PropertySetProperties<Target>
	? PropertySetProperties<Target>[Property]
	: never;

export type PropertyGetProperties<Target extends Element> = {
	[
		Property in keyof Target as Target[Property] extends Primitive ? Property : never
	]?: Target[Property];
};

export type PropertySetProperties<Target extends Element> = {
	[
		Property in keyof Target as Target[Property] extends Primitive ? Property : never
	]?: Target[Property];
};

// #endregion
