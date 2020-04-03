import * as internal from "../../../node_modules/elix/src/base/internal.js";
import Button from "../../../node_modules/elix/src/base/Button.js";
import html from "../../../node_modules/elix/src/core/html.js";

/**
 * SDS variation of an Elix [Button](https://component.kitchen/elix/Button).
 */
export default class SdsButton extends Button {
  /**
   * SDS Buttons come with a set of variants to change the visual
   * display depending on the action a user is taking
   */
  get variant() {
    return this.variant;
  }
  set variant(variant) {
    this[internal.setState]({ variant });
  }

  [internal.render](changed) {
    super[internal.render](changed);
    // Add base class at firstRender
    if (this[internal.firstRender]) {
      this[internal.ids].inner.classList.add("lwc-button");
    }
    // Append variant class, if attribute exist
    if (changed.variant) {
      const computedClassName = `lwc-button_${this[internal.state].variant}`;
      this[internal.ids].inner.classList.add(computedClassName);
    }
  }

  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      html`
        <style>
          @import url("/src/sds/common/index.css");
          @import url("/src/sds/button/index.css");
        </style>
      `
    );
    return result;
  }
}

customElements.define("sds-button", SdsButton);
