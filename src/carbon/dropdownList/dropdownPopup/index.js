import * as internal from "../../../../node_modules/elix/src/base/internal.js";
import html from "../../../../node_modules/elix/src/core/html.js";
import Popup from "../../../../node_modules/elix/src/base/Popup.js";
import CarbonOverlayFrame from "../../overlayFrame/index.js";

/**
 * Carbon variation of an Elix [Popup](https://component.kitchen/elix/Popup).
 */
export default class CarbonPopup extends Popup {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      framePartType: CarbonOverlayFrame
    });
  }
  get [internal.template]() {
    const result = super[internal.template];
    /**
     * Needs CSS import since template in contained in a shadowRoot
     */
    result.content.append(
      html`
        <style>
          @import url("https://unpkg.com/carbon-components/css/carbon-components.min.css");
        </style>
      `
    );
    return result;
  }
}
