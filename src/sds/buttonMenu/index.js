import * as internal from "../../../node_modules/elix/src/base/internal.js";
import MenuButton from "../../../node_modules/elix/src/base/MenuButton.js";
import SdsButtonIcon from "../buttonIcon/index.js";
import SldsMenu from "../menu/index.js";
import SdsPopup from "../popup/index.js";

/**
 * SLDS variation of an Elix [MenuButton](https://component.kitchen/elix/MenuButton).
 *
 * Note: SLDS calls this a "button menu"; Elix calls this a "menu button".
 * They're the same thing.
 */
export default class SdsButtonMenu extends MenuButton {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      menuPartType: SldsMenu,
      popupPartType: SdsPopup,
      popupTogglePartType: null,
      sourcePartType: SdsButtonIcon,
      variant: "neutral",
      symbol: "chevrondown",
    });
  }

  get variant() {
    return this[internal.state].variant;
  }
  set variant(variant) {
    this[internal.setState]({ variant });
  }

  get size() {
    return this[internal.state].size;
  }
  set size(size) {
    this[internal.setState]({ size });
  }

  get symbol() {
    return this[internal.state].symbol;
  }
  set symbol(symbol) {
    this[internal.setState]({ symbol });
  }

  [internal.render](changed) {
    super[internal.render](changed);

    if (changed.variant) {
      const shadow = this.shadowRoot.getElementById("source");
      shadow.variant = this[internal.state].variant;
    }

    if (changed.symbol) {
      const shadow = this.shadowRoot.getElementById("source");
      const iconPart = shadow.shadowRoot.getElementById("icon");
      iconPart.symbol = this[internal.state].symbol;
    }
  }
}

customElements.define("sds-button-menu", SdsButtonMenu);
