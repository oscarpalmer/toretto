// #region Types

type InternalSupportsTouch = {
	[SUPPORTS_TOUCH_SYMBOL]: SupportsTouchState;
};

type NavigatorWithMsMaxTouchPoints = Navigator & {
	msMaxTouchPoints: number;
};

type SupporsTouch = {
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

type SupportsTouchState = {
	supported: boolean;
};

// #endregion

// #region Instances

function SupportsTouch(this: any) {
	this[SUPPORTS_TOUCH_SYMBOL] = {
		supported: checkSupport(),
	};
}

SupportsTouch.prototype.get = getSupport;
SupportsTouch.prototype.update = updateSupport;

Object.defineProperty(SupportsTouch.prototype, 'value', {
	get: getSupport,
});

// #endregion

// #region Functions

function checkSupport(): boolean {
	if (window == null || navigator == null) {
		return false;
	}

	if ('matchMedia' in window) {
		const media = matchMedia?.('(pointer: coarse)');

		if (typeof media?.matches === 'boolean' && media.matches) {
			return true;
		}
	}

	if ('ontouchstart' in window) {
		return true;
	}

	if (typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 0) {
		return true;
	}

	if (
		typeof (navigator as NavigatorWithMsMaxTouchPoints).msMaxTouchPoints === 'number' &&
		(navigator as NavigatorWithMsMaxTouchPoints).msMaxTouchPoints > 0
	) {
		return true;
	}

	return false;
}

function getSupport(this: InternalSupportsTouch) {
	return this[SUPPORTS_TOUCH_SYMBOL].supported;
}

function updateSupport(this: InternalSupportsTouch) {
	const supported = checkSupport();

	this[SUPPORTS_TOUCH_SYMBOL].supported = supported;

	return supported;
}

// #endregion

// #region Variables

const SUPPORTS_TOUCH_SYMBOL = Symbol('supportsTouch');

/**
 * Does the device support touch events?
 */
// @ts-expect-error All good, no worries :-)
const supportsTouch: SupporsTouch = new SupportsTouch();

// #endregion

// #region Exports

export default supportsTouch;

// #endregion
