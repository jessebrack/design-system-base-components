import * as internal from "/node_modules/elix/src/base/internal.js";
import * as template from "/node_modules/elix/src/core/template.js";
import html from "/node_modules/elix/src/core/html.js";
import MenuButton from "/node_modules/elix/src/base/MenuButton.js";
import SdsButtonIcon from "../buttonIcon/index.js";
import SldsMenu from "../menu/index.js";
import SdsIcon from "../icon/index.js";
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
      symbol: "chevrondown"
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
      // shadow.variant = this[internal.state].variant;
    }

    if (changed.symbol) {
      const shadow = this.shadowRoot.getElementById("source");
      // console.log(shadow.symbol);
      shadow.symbol = this[internal.state].symbol;
    }
  }

  get [internal.template]() {
    const result = super[internal.template];

    // const slot = result.content.querySelector('#inner');
    // console.log(result);
    // template.replace(
    // 	slot,
    // 	html`<sds-icon boundarysize=${this[internal.state].size} symbol=${this[internal.state].symbol}></sds-icon>`
    // );

    return result;
  }
}

customElements.define("sds-button-menu", SdsButtonMenu);
