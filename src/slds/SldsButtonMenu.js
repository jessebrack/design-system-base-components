import * as internal from "../../node_modules/elix/src/base/internal.js";
import * as template from "../../node_modules/elix/src/core/template.js";
import html from "../../node_modules/elix/src/core/html.js";
import MenuButton from "../../node_modules/elix/src/base/MenuButton.js";
import SldsButtonIcon from "./SldsButtonIcon.js";
import SldsMenu from "./SldsMenu.js";
import SdsIcon from "../sds/SdsIcon.js";
import SldsPopup from "./SldsPopup.js";

/**
 * SLDS variation of an Elix [MenuButton](https://component.kitchen/elix/MenuButton).
 *
 * Note: SLDS calls this a "button menu"; Elix calls this a "menu button".
 * They're the same thing.
 */
export default class SldsButtonMenu extends MenuButton {
	get [internal.defaultState]() {
		return Object.assign(super[internal.defaultState], {
			menuPartType: SldsMenu,
			popupPartType: SldsPopup,
			popupTogglePartType: null,
			sourcePartType: SldsButtonIcon,
			variant: 'neutral',
			symbol: 'chevrondown'
		});
	}

	get variant() {
		return this[internal.state].variant;
	}
	set variant(variant) {
		this[internal.setState]({ variant });
	}

	get size() {
		return this[internal.state].size;
	}
	set size(size) {
		this[internal.setState]({ size });
	}

	get symbol() {
		return this[internal.state].symbol;
	}
	set symbol(symbol) {
		this[internal.setState]({ symbol });
	}

	[internal.render](changed) {
		super[internal.render](changed);

		if(changed.variant) {
			const shadow = this.shadowRoot.getElementById('source')
			// shadow.variant = this[internal.state].variant;
		}

		if(changed.symbol) {
			const shadow = this.shadowRoot.getElementById('source');
			console.log(shadow.symbol)
			shadow.symbol = this[internal.state].symbol;
		}
	}

	get [internal.template]() {
		const result = super[internal.template];

		// const slot = result.content.querySelector('#inner');
		console.log(result)
		// template.replace(
		// 	slot,
		// 	html`<sds-icon boundarysize=${this[internal.state].size} symbol=${this[internal.state].symbol}></sds-icon>`
		// );

		return result;
	}
}

customElements.define("slds-button-menu", SldsButtonMenu);
