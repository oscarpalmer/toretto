import {expect, test} from 'vitest';
import supportsTouch from '../src/touch';

test('supportsTouch', () => {
	expect(supportsTouch.value).toBe(true);

	delete window.ontouchstart; // JSDOM sets it to null, regardless of actual support

	expect(supportsTouch.update()).toBe(false);

	// @ts-expect-error Testing
	navigator.msMaxTouchPoints = 1;

	expect(supportsTouch.update()).toBe(true);

	// @ts-expect-error Testing
	navigator.maxTouchPoints = 1;

	expect(supportsTouch.update()).toBe(true);

	window.ontouchstart = null;

	supportsTouch.update();

	expect(supportsTouch.get()).toBe(true);

	window.matchMedia = () =>
		({
			matches: true,
		}) as never;

	expect(supportsTouch.update()).toBe(true);

	// @ts-expect-error Testing
	globalThis.window = undefined;
	// @ts-expect-error Testing
	globalThis.navigator = undefined;

	expect(supportsTouch.update()).toBe(false);
});
