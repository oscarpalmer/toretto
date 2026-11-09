// Small HTML snippets for the focusable tests.
//
// - Mount a snippet inside a container and compare `id`s, not elements.
// - Snippets are prefixed by the concern they belong to (`disabled`, `hidden`, etc.);
//   `html` is for plain elements with no extra state.
// - `data-zero-size` marks an element that the layout helper should give a 0×0 rect.

// #region Variables

export const disabledControls = `
	<button id="button" disabled></button>
	<input id="input" disabled>
	<select id="select" disabled></select>
	<textarea id="textarea" disabled></textarea>
	<button id="enabled"></button>
`;

export const disabledFieldset = `
	<fieldset disabled>
		<button id="button"></button>
		<input id="input">
		<a id="link" href="#"></a>
		<div id="tabindex" tabindex="0"></div>
	</fieldset>
`;

export const disabledFieldsetLegend = `
	<fieldset disabled>
		<legend>
			<input id="first-legend">
		</legend>
		<legend>
			<input id="second-legend">
		</legend>
		<input id="outside-legend">
	</fieldset>
`;

export const disabledFieldsetLegendNested = `
	<fieldset disabled>
		<fieldset>
			<legend>
				<input id="nested-legend">
			</legend>
		</fieldset>
	</fieldset>
`;

export const disabledFieldsetNested = `
	<fieldset disabled>
		<fieldset>
			<button id="nested"></button>
		</fieldset>
	</fieldset>
	<fieldset>
		<button id="enabled"></button>
	</fieldset>
`;

export const editableExplicitTabindex = `
<div id="two" contenteditable tabindex="2"></div>
<div id="negative" contenteditable tabindex="-1"></div>
<div id="one" contenteditable tabindex="1"></div>
`;

export const editableValues = `
	<div id="empty" contenteditable=""></div>
	<div id="true" contenteditable="true"></div>
	<div id="upper-case" contenteditable="TRUE"></div>
	<div id="plaintext-only" contenteditable="plaintext-only"></div>
	<div id="false" contenteditable="false"></div>
	<div id="invalid" contenteditable="maybe"></div>
	<div id="absent"></div>
`;

export const hiddenAttribute = `
	<button id="hidden" hidden></button>
	<button id="visible"></button>
`;

export const hiddenDetails = `
	<details>
		<summary id="closed-summary">Closed</summary>
		<button id="closed-child"></button>
	</details>
	<details open>
		<summary id="open-summary">Open</summary>
		<button id="open-child"></button>
	</details>
`;

export const hiddenDetailsNested = `
	<details>
		<summary id="outer-summary">Outer</summary>
		<details open>
			<summary id="inner-summary">Inner</summary>
			<button id="inner-child"></button>
		</details>
	</details>
`;

export const hiddenDisplay = `
	<button id="hidden" style="display: none"></button>
	<button id="visible" style="display: block"></button>
`;

export const hiddenInputType = `
	<input id="hidden" type="hidden">
	<input id="visible" type="text">
`;

export const hiddenVisibility = `
	<button id="hidden" style="visibility: hidden"></button>
	<button id="visible" style="visibility: visible"></button>
`;

export const hiddenVisibilityInherited = `
	<div style="visibility: hidden">
		<button id="hidden"></button>
		<button id="visible" style="visibility: visible"></button>
	</div>
`;

export const hiddenZeroSize = `
	<button id="zero-size" data-zero-size></button>
	<button id="sized"></button>
`;

export const htmlAnchor = `
	<a id="with-href" href="#"></a>
	<a id="without-href"></a>
`;

export const htmlAudio = `
	<audio id="audio-with-controls" controls></audio>
	<audio id="audio-without-controls"></audio>
`;

export const htmlDetails = `
	<details id="details">
		<summary id="first-summary">First</summary>
		<summary id="second-summary">Second</summary>
	</details>
	<details id="empty-details"></details>
`;

export const htmlDocumentOrder = `
	<button id="first"></button>
	<a id="second" href="#"></a>
	<input id="third">
`;

export const htmlFormControls = `
	<button id="button"></button>
	<input id="input">
	<select id="select"></select>
	<textarea id="textarea"></textarea>
`;

export const htmlNonFocusable = `
	<div id="div"></div>
	<span id="span"></span>
	<p id="paragraph"></p>
`;

export const htmlSlot = `
	<slot id="slot" tabindex="0"></slot>
`;

export const htmlTabindex = `
	<div id="positive" tabindex="1"></div>
	<div id="zero" tabindex="0"></div>
	<div id="negative" tabindex="-1"></div>
	<div id="none"></div>
`;

export const htmlVideo = `
	<video id="video-with-controls" controls></video>
	<video id="video-without-controls"></video>
`;

export const inertAncestor = `
	<div inert>
		<button id="child"></button>
		<div>
			<button id="deep"></button>
		</div>
	</div>
	<button id="outside"></button>
`;

export const inertAncestorValues = `
	<div inert="">
		<button id="empty"></button>
	</div>
	<div inert="true">
		<button id="true"></button>
	</div>
	<div inert="inert">
		<button id="inert"></button>
	</div>
	<div inert="false">
		<button id="false"></button>
	</div>
	<button id="outside"></button>
`;

export const inertAttribute = `
	<button id="inert" inert></button>
	<button id="active"></button>
`;

export const inertProperty = `
	<div id="parent">
		<button id="child"></button>
	</div>
`;

export const isFocusableTabbable = `
	<a href="" id="link"></a>
	<button id="enabled"></button>
	<button id="disabled" disabled></button>
	<input id="checked" type="radio" name="group" checked>
	<input id="unchecked" type="radio" name="group">
`;

export const radioEscapedName = `
	<input id="dot-checked" type="radio" name="a.b" checked>
	<input id="dot-unchecked" type="radio" name="a.b">
	<input id="quote-checked" type="radio" name="a&quot;b" checked>
	<input id="quote-unchecked" type="radio" name="a&quot;b">
	<input id="bracket-checked" type="radio" name="a[b]" checked>
	<input id="bracket-unchecked" type="radio" name="a[b]">
`;

export const radioForms = `
	<form>
		<input id="first-checked" type="radio" name="group" checked>
		<input id="first-unchecked" type="radio" name="group">
	</form>
	<form>
		<input id="second-a" type="radio" name="group">
		<input id="second-b" type="radio" name="group">
	</form>
`;

export const radioNameless = `
	<input id="nameless" type="radio">
	<input id="named" type="radio" name="group" checked>
`;

export const radioNoneChecked = `
	<input id="first" type="radio" name="group">
	<input id="second" type="radio" name="group">
`;

export const radioOneChecked = `
	<input id="first" type="radio" name="group">
	<input id="second" type="radio" name="group" checked>
	<input id="third" type="radio" name="group">
`;

export const tabindexInvalid = `
	<div id="invalid" tabindex="abc"></div>
	<button id="button"></button>
`;

export const tabindexNegative = `
	<button id="negative" tabindex="-1"></button>
	<button id="default"></button>
`;

export const tabindexOrder = `
	<button id="zero-first"></button>
	<button id="two" tabindex="2"></button>
	<button id="one-first" tabindex="1"></button>
	<button id="zero-second" tabindex="0"></button>
	<button id="one-second" tabindex="1"></button>
`;

export const tabindexSpecial = `
	<details id="details"></details>
	<details id="details-explicit" tabindex="-1"></details>
	<audio id="audio" controls></audio>
	<video id="video" controls></video>
`;

// #endregion
