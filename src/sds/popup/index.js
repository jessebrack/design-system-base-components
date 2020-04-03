import * as internal from "../../../node_modules/elix/src/base/internal.js";
import Popup from "../../../node_modules/elix/src/base/Popup.js";
import SdsOverlayFrame from "../overlayFrame/index.js";

/**
 * SDS variation of an Elix [Popup](https://component.kitchen/elix/Popup).
 */
export default class SdsPopup extends Popup {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      framePartType: SdsOverlayFrame
    });
  }
}
