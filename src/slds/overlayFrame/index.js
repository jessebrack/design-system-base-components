import * as internal from "/node_modules/elix/src/base/internal.js";
import html from "/node_modules/elix/src/core/html.js";
import OverlayFrame from "/node_modules/elix/src/base/OverlayFrame.js";

/**
 * SLDS variation of an Elix [OverlayFrame](https://component.kitchen/elix/OverlayFrame).
 *
 * In SLDS, this isn't offered as a standalone component, but doing so here means that
 * we can easily add the SLDS overlay style to anything with a popup.
 */
export default class SldsOverlayFrame extends OverlayFrame {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      html`
        <style>
          /* slds-dropdown */
          :host {
            background: white;
            min-width: 6rem;
            max-width: 20rem;
            border: 1px solid #dddbda;
            border-radius: 0.25rem;
            padding: 0.25rem 0;
            font-size: 0.75rem;
            background: #fff;
            box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.16);
          }
        </style>
      `
    );
    return result;
  }
}

customElements.define("slds-overlay-frame", SldsOverlayFrame);
