import {afterEach, beforeEach, describe, expect, test, vi} from 'vite-plus/test';
import {supportsTouch} from '../src/touch';

// #region Helpers

function setNavigator(property: 'maxTouchPoints' | 'msMaxTouchPoints', value: unknown): void {
	Object.defineProperty(navigator, property, {configurable: true, value});
}

// #endregion

// #region Setup

let hadOnTouchStart: boolean;

beforeEach(() => {
	hadOnTouchStart = 'ontouchstart' in window;

	// jsdom sets `ontouchstart` to `null`, regardless of actual support
	delete (window as {ontouchstart?: unknown}).ontouchstart;
});

afterEach(() => {
	vi.unstubAllGlobals();

	if (hadOnTouchStart) {
		window.ontouchstart = null;
	} else {
		delete (window as {ontouchstart?: unknown}).ontouchstart;
	}

	// Remove instance overrides, so the prototype values apply again
	delete (navigator as {maxTouchPoints?: unknown}).maxTouchPoints;
	delete (navigator as {msMaxTouchPoints?: unknown}).msMaxTouchPoints;

	supportsTouch.update();
});

// #endregion

// #region Tests

describe('supportsTouch', () => {
	test('false when nothing indicates touch', () => {
		expect(supportsTouch.update()).toBe(false);
	});

	describe('matchMedia', () => {
		test('coarse pointer', () => {
			vi.stubGlobal('matchMedia', () => ({matches: true}));

			expect(supportsTouch.update()).toBe(true);
		});

		test('fine pointer', () => {
			vi.stubGlobal('matchMedia', () => ({matches: false}));

			expect(supportsTouch.update()).toBe(false);
		});

		test('unexpected result', () => {
			vi.stubGlobal('matchMedia', () => undefined);

			expect(supportsTouch.update()).toBe(false);

			vi.stubGlobal('matchMedia', () => ({matches: 'true'}));

			expect(supportsTouch.update()).toBe(false);
		});

		test('falls through to the other checks', () => {
			vi.stubGlobal('matchMedia', () => ({matches: false}));

			window.ontouchstart = null;

			expect(supportsTouch.update()).toBe(true);
		});
	});

	test('ontouchstart', () => {
		window.ontouchstart = null;

		expect(supportsTouch.update()).toBe(true);
	});

	test('maxTouchPoints', () => {
		setNavigator('maxTouchPoints', 1);

		expect(supportsTouch.update()).toBe(true);

		setNavigator('maxTouchPoints', 0);

		expect(supportsTouch.update()).toBe(false);

		setNavigator('maxTouchPoints', '1');

		expect(supportsTouch.update()).toBe(false);
	});

	test('msMaxTouchPoints', () => {
		setNavigator('msMaxTouchPoints', 1);

		expect(supportsTouch.update()).toBe(true);

		setNavigator('msMaxTouchPoints', 0);

		expect(supportsTouch.update()).toBe(false);

		setNavigator('msMaxTouchPoints', '1');

		expect(supportsTouch.update()).toBe(false);
	});

	test('no window or navigator', () => {
		vi.stubGlobal('window', undefined);

		expect(supportsTouch.update()).toBe(false);

		vi.unstubAllGlobals();
		vi.stubGlobal('navigator', undefined);

		expect(supportsTouch.update()).toBe(false);
	});

	test('get, update, and value', () => {
		supportsTouch.update();

		expect(supportsTouch.value).toBe(false);
		expect(supportsTouch.get()).toBe(false);

		window.ontouchstart = null;

		// Cached until updated
		expect(supportsTouch.get()).toBe(false);
		expect(supportsTouch.value).toBe(false);

		expect(supportsTouch.update()).toBe(true);
		expect(supportsTouch.get()).toBe(true);
		expect(supportsTouch.value).toBe(true);
	});
});

// #endregion
