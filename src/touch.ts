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
	 */
	get(): boolean;
	/**
	 * Re-evaluate if touch events are supported
	 */
	update(): boolean;
};

//

function getSupport(): boolean {
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

	if (
		typeof navigator.maxTouchPoints === 'number' &&
		navigator.maxTouchPoints > 0
	) {
		return true;
	}

	if (
		typeof (navigator as NavigatorWithMsMaxTouchPoints).msMaxTouchPoints ===
			'number' &&
		(navigator as NavigatorWithMsMaxTouchPoints).msMaxTouchPoints > 0
	) {
		return true;
	}

	return false;
}

//

/**
 * Does the device support touch events?
 */
const supportsTouch: SupporsTouch = (() => {
	let support = getSupport();

	const instance = Object.create({
		get(): boolean {
			return support;
		},
		update(): boolean {
			support = getSupport();

			return support;
		},
	});

	Object.defineProperty(instance, 'value', {
		get(): boolean {
			return support;
		},
	});

	return instance;
})();

export default supportsTouch;
