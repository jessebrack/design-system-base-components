import * as internal from "../../node_modules/elix/src/base/internal.js";
import Button from "../../node_modules/elix/src/base/Button.js";
import html from "../../node_modules/elix/src/core/html.js";

/**
 * SLDS variation of an Elix [Button](https://component.kitchen/elix/Button).
 */
export default class SldsButton extends Button {
	[internal.componentDidMount]() {
		this[internal.ids].inner.classList.add("lwc-button");
	}

	get variant() {
		return this[internal.state].variant;
	}
	set variant(variant) {
		this[internal.setState]({ variant });
	}

	[internal.render](changed) {
		super[internal.render](changed);

		if (changed.variant) {
			const computedClassName = `lwc-button_${this[internal.state].variant}`;
			this[internal.ids].inner.classList.add(computedClassName);
		}
	}

	get [internal.template]() {
		const result = super[internal.template];
		result.content.append(
			html`
				<style>
					@import url("../css/slds/common/index.css");
					@import url("../css/slds/button/index.css");
				</style>
			`
		);
		return result;
	}
}

customElements.define("slds-button", SldsButton);
