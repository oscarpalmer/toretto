// #region Variables

export const CSS_VARIABLE_PREFIX = '--';

export const DATA_EXPRESSION_PREFIX: RegExp = /^data-/i;

export const IS_CHILDNODES: Set<number> = new Set([
	Node.ELEMENT_NODE,
	Node.TEXT_NODE,
	Node.PROCESSING_INSTRUCTION_NODE,
	Node.COMMENT_NODE,
	Node.DOCUMENT_TYPE_NODE,
]);

/**
 * Used internally by _Toretto_ to store metadata on _DOM_ elements
 *
 * _Exported for use when extending _Toretto_, hydration (moving listeners between elements), etc._
 */
export const TORETTO_SYMBOL: unique symbol = Symbol('toretto');

// #endregion
