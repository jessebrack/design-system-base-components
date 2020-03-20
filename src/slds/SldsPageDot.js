import * as internal from "../../node_modules/elix/src/base/internal";
import Button from "../../node_modules/elix/src/base/Button";
import html from "../../node_modules/elix/src/core/html";

/**
 * SLDS variation of an Elix [PageDot](https://component.kitchen/elix/PageDot).
 *
 * This is used by the Carousel component and its variations.
 */
export default class SldsPageDot extends Button {
	get [internal.template]() {
		const result = super[internal.template];
		result.content.append(
			html`
				<style>
					/* slds-button */
					:host {
						width: 1rem;
						height: 1rem;
						background: #fff;
						border: 1px solid #dddbda;
						border-radius: 50%;
						margin: 0 0.25rem;
					}

					:host([selected]) {
						background: #0070d2;
						border-color: #0070d2;
					}
				</style>
			`
		);
		return result;
	}
}

customElements.define("slds-page-dot", SldsPageDot);
