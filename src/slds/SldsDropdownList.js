import * as internal from "../../node_modules/elix/src/base/internal.js";
import * as template from "../../node_modules/elix/src/core/template.js";
import DropdownList from "../../node_modules/elix/src/base/DropdownList.js";
import html from "../../node_modules/elix/src/core/html.js";
import SldsButton from "./SldsButton.js";
import SldsMenu from "./SldsMenu.js";
import SldsPopup from "./SldsPopup.js";
import SldsIcon from "../sds/SdsIcon.js";
import SldsUpDownToggle from "./SldsUpDownToggle.js";

/**
 * SLDS variation of an Elix [DropdownList](https://component.kitchen/elix/DropdownList).
 */
export default class SldsDropdownList extends DropdownList {
	get [internal.defaultState]() {
		return Object.assign(super[internal.defaultState], {
			horizontalAlign: "stretch",
			menuPartType: SldsMenu,
			popupPartType: SldsPopup,
			popupTogglePartType: SldsIcon,
			sourcePartType: SldsButton
		});
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
			this[internal.ids].source.setAttribute('variant', this[internal.state].variant);
		}
		if(changed.popupTogglePartType) {
      this[internal.ids].popupToggle.setAttribute('symbol', 'chevrondown')
		}
	}

	get [internal.template]() {
		const result = super[internal.template];

		// const icon = result.content.getElementById('source');
		// console.log(icon)
		// if (icon) {
			// const parent = template.createElement('div');
			// console.log(parent)
			// parent.innerHTML = icon;
		// }
		// const iconSlot = result.content.querySelector('slot[name="toggle-icon"]');
		// if (iconSlot) {
		// 	const iconTemplate = template.html`
		// 		<svg class="lwc-svg" aria-hidden="true" viewBox="0 0 24 24">
		// 			<path
		// 				d="M22 8.2l-9.5 9.6c-.3.2-.7.2-1 0L2 8.2c-.2-.3-.2-.7 0-1l1-1c.3-.3.8-.3 1.1 0l7.4 7.5c.3.3.7.3 1 0l7.4-7.5c.3-.2.8-.2 1.1 0l1 1c.2.3.2.7 0 1z"
		// 			></path>
		// 		</svg>
		// 	`;
		// 	template.transmute(iconSlot, iconTemplate);
		// }
		return result;
	}
}

customElements.define("slds-dropdown-list", SldsDropdownList);
