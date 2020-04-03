import * as internal from "../../../node_modules/elix/src/base/internal.js";
import html from "../../../node_modules/elix/src/core/html.js";
import * as template from "../../../node_modules/elix/src/core/template.js";
import SdsCard from "../../sds/card/index.js";
import SdsIcon from "../../sds/icon/index.js";

/**
 * Lazy attempt to accept new HTML for footer
 */
const footer = template.html`
  <footer class="lwc-card__footer">
    <a class="lwc-card__footer-action" href="javascript:void(0);">
      <slot name="footer">View All</slot>
    </a>
  </footer>
`;

export default class SldsCard extends SdsCard {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      titlePartType: "h3",
      iconPartType: SdsIcon,
      footerPartType: footer
    });
  }

  [internal.render](changed) {
    super[internal.render](changed);

    if (changed.iconPartType) {
      // Pass attributes to SdsIcon component
      this[internal.ids].headerIcon.set = "standard";
      this[internal.ids].headerIcon.symbol = "account";
    }
  }

  get [internal.template]() {
    const result = super[internal.template];
    /**
     * [part="inner"] css was to see if exposing a new styling api
     * for a subsystem is an optimal approach. I'm indifferent.
     */
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
