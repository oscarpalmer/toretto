// #region Types

export type SupportsTouch = {
	/**
	 * Are touch events supported?
	 */
	readonly value: boolean;
	/**
	 * Are touch events supported?
	 *
	 * @returns `true` if touch events are supported, otherwise `false`
	 */
	get(): boolean;
	/**
	 * Re-evaluate if touch events are supported
	 *
	 * @returns `true` if touch events are supported, otherwise `false`
	 */
	update(): boolean;
};

export type SupportsTouchState = {
	supported: boolean;
};

// #endregion
