import * as internal from "../../../node_modules/elix/src/base/internal.js";
import html from "../../../node_modules/elix/src/core/html.js";
import * as template from "../../../node_modules/elix/src/core/template.js";
import OverlayFrame from "../../../node_modules/elix/src/base/OverlayFrame.js";

/**
 * SLDS variation of an Elix [OverlayFrame](https://component.kitchen/elix/OverlayFrame).
 *
 * In SLDS, this isn't offered as a standalone component, but doing so here means that
 * we can easily add the SLDS overlay style to anything with a popup.
 */
export default class SldsOverlayFrame extends OverlayFrame {
  get [internal.template]() {
    const result = super[internal.template];
    const slot = result.content.querySelector("slot:not([name])");
    const wrapper = html`
      <div class="lwc-dropdown-container">
        <slot></slot>
      </div>
    `;
    template.replace(slot, wrapper);

    result.content.append(
      html`
        <style>
          @import url("/src/sds/common/index.css");
          @import url("/src/sds/overlayFrame/index.css");
        </style>
      `
    );
    return result;
  }
}

customElements.define("slds-overlay-frame", SldsOverlayFrame);
