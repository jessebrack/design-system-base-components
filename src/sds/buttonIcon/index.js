import * as internal from "/node_modules/elix/src/base/internal.js";
import * as template from "/node_modules/elix/src/core/template.js";
import Button from "/node_modules/elix/src/base/Button.js";
import html from "/node_modules/elix/src/core/html.js";
import SdsIcon from "../icon/index.js";

/**
 * SLDS variation of an Elix [Button](https://component.kitchen/elix/Button).
 */
export default class SdsButtonIcon extends Button {
  [internal.componentDidMount]() {
    this[internal.ids].inner.classList.add("lwc-button-icon");
  }
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      variant: "bare",
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
      const computedSizeClassName = `lwc-button-icon_${
        this[internal.state].variant
      }`;
      this[internal.ids].inner.classList.add(computedSizeClassName);
    }
  }

  get [internal.template]() {
    const result = super[internal.template];

    const slot = result.content.querySelector("slot:not([name])");
    template.replace(
      slot,
      html`
        <sds-icon
          boundarysize=${this[internal.state].size}
          symbol=${this[internal.state].symbol}
        ></sds-icon>
      `
    );

    result.content.append(
      html`
        <style>
          @import url("/src/sds/common/index.css");
          @import url("/src/sds/buttonIcon/index.css");
        </style>
      `
    );

    return result;
  }
}

customElements.define("sds-button-icon", SdsButtonIcon);
