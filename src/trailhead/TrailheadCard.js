import * as internal from "../../node_modules/elix/src/base/internal.js";
import html from "../../node_modules/elix/src/core/html.js";
import * as template from "../../node_modules/elix/src/core/template.js";
import SdsCard from "../sds/SdsCard.js";
import SomeRandomComponent from "../vendor/SomeRandomComponent.js";

export default class TrailheadCard extends SdsCard {

	/**
	 * Using SomeRandomComponent in an exposed part type
	 * showcases a customization scenario where my component
	 * is using a 3rd party Class/Component
	 *
	 * If component has part exposed, can style nodes within
	 */
	get [internal.defaultState]() {
		return Object.assign(super[internal.defaultState], {
			titlePartType: "h3",
			contentPartType: SomeRandomComponent
		});
	}

	get [internal.template]() {
		const result = super[internal.template];

		// Want to keep header from SdsCard but need to move it below the image
		const headerPart = result.content.getElementById("header");
		const contentPart = result.content.querySelector("slot:not([name])");
		contentPart.insertAdjacentElement("beforebegin", headerPart);

		/**
		 * 1. Target exposed ::part in 3rd party component
		 * 2. Selector match part attribute in light DOM to expose DS specific styling API
		 * 3. Custom CSS that is unique to this version of the Card
		 */
		result.content.append(
			html`
				<style>
					::part(source) {
						padding: 0;
					}
					[part="inner"] {
						padding: var(--th-c-card-content-padding);
					}
					slot[name="above-content"]::slotted(img) {
						border-top-left-radius: var(--lwc-c-card-radius);
						border-top-right-radius: var(--lwc-c-card-radius);
						width: 100%;
					}
				</style>
			`
		);
		return result;
	}
}

customElements.define("th-card", TrailheadCard);
