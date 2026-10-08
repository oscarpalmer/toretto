import type {Primitive} from '@oscarpalmer/atoms/models';
import type {AnyAriaAttribute, AnyAriaBooleanAttribute, CSSValues} from './index';

// #region Types

export type CreateElementValues<Target extends Element> = {
	aria?: CreateElementValuesAria;
	attribute?: Record<string, unknown>;
	data?: Record<string, unknown>;
	property?: CreateElementValuesProperties<Target>;
	style?: Partial<CSSValues>;
};

export type CreateElementValuesAria = {
	[Key in AnyAriaAttribute]?: Key extends AnyAriaBooleanAttribute ? boolean | string : string;
};

export type CreateElementValuesProperties<Target extends Element> = {
	[Property in keyof Target]?: Target[Property] extends Primitive ? Target[Property] : never;
};

// #endregion

// #region Variables

export const CREATE_MESSAGE = 'Tag name must be a string';

// #endregion
