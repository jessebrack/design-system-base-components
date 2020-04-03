import * as internal from "../../../node_modules/elix/src/base/internal.js";
import * as template from "../../../node_modules/elix/src/core/template.js";
import Button from "../../../node_modules/elix/src/base/Button.js";
import html from "../../../node_modules/elix/src/core/html.js";

/**
 * SLDS variation of an Elix [Button](https://component.kitchen/elix/Button).
 */
export default class SdsButtonIcon extends Button {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      variant: "bare",
      symbol: "chevrondown",
      size: "medium"
    });
  }

  get variant() {
    return this.variant;
  }
  set variant(variant) {
    this[internal.setState]({ variant });
  }

  get size() {
    return this.size;
  }
  set size(size) {
    this[internal.setState]({ size });
  }

  get symbol() {
    return this.symbol;
  }
  set symbol(symbol) {
    this[internal.setState]({ symbol });
  }

  [internal.render](changed) {
    super[internal.render](changed);
    // Add base class at firstRender
    if (this[internal.firstRender]) {
      this[internal.ids].inner.classList.add("lwc-button-icon");
    }
    if (changed.variant) {
      const variant = this[internal.state].variant;
      const computedSizeClassName = `lwc-button-icon_${variant}`;
      this[internal.ids].inner.classList.add(computedSizeClassName);
    }

    if (changed.symbol) {
      const icon = this[internal.ids].icon;
      icon.symbol = this[internal.state].symbol;
    }

    if (changed.size) {
      const icon = this[internal.ids].icon;
      const size = this[internal.state].size;
      icon.boundarysize = size;
    }
  }

  get [internal.template]() {
    const result = super[internal.template];

    const slot = result.content.querySelector("slot:not([name])");
    template.replace(
      slot,
      html`
        <sds-icon id="icon"></sds-icon>
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
