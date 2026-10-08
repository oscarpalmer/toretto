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

// #endregion
