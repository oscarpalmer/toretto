import {afterEach, beforeEach, vi} from 'vite-plus/test';

// #region Functions

function getRect(size: number): DOMRect {
	return {
		bottom: size,
		height: size,
		left: 0,
		right: size,
		toJSON: () => ({}),
		top: 0,
		width: size,
		x: 0,
		y: 0,
	};
}

/**
 * jsdom does no layout, so every element has a 0×0 rect; this gives elements a size,
 * unless they have a `data-zero-size` attribute
 */
export function stubLayout(): void {
	beforeEach(() => {
		vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
			this: Element,
		) {
			return getRect(this.hasAttribute('data-zero-size') ? 0 : SIZE);
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});
}

// #endregion

// #region Variables

const SIZE = 10;

// #endregion
