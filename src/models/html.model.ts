// #region Types

export type HtmlOptions = {
	/**
	 * Cache template element for the _HTML_ string? _(defaults to `true`)_
	 */
	cache?: boolean;
};

export type Tagged = {
	nodes: Node[];
	template: string;
};

// #endregion

// #region Variables

export const HTML_COMMENT_HARMFUL: RegExp = /<[/\w]/g;

export const HTML_REMOVE_SELECTOR = 'script, toretto-temporary';

// #endregion
