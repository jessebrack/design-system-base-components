import * as internal from "../../node_modules/elix/src/base/internal.js";
import html from "../../node_modules/elix/src/core/html.js";
import * as template from "../../node_modules/elix/src/core/template.js";
import SdsCard from "../sds/SdsCard.js";
import SdsIcon from "../sds/SdsIcon.js";

const footer = () => {
	return template.html`
		<footer class="lwc-card__footer">
      <a class="lwc-card__footer-action" href="javascript:void(0);">View All</a>
		</footer>
	`;
};

export default class SldsCard extends SdsCard {
	get [internal.defaultState]() {
		return Object.assign(super[internal.defaultState], {
			titlePartType: "h3",
			iconPartType: SdsIcon,
			footerPartType: footer()
		});
	}

  [internal.render](changed) {
    super[internal.render](changed);

    if(changed.iconPartType) {
      // Pass attributes to SldsIcon component
      this[internal.ids].headerIcon.set = 'standard';
      this[internal.ids].headerIcon.symbol = 'account';
		}
  }

	get [internal.template]() {
    const result = super[internal.template];

		result.content.append(
			html`
				<style>
					[part="inner"] {
						padding: var(--slds-c-card-body-padding);
					}
					::slotted(img) {
						width: 100%;
					}
				</style>
			`
		);
		return result;
	}
}

customElements.define("slds-card", SldsCard);
