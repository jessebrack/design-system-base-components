import * as internal from "../../../../node_modules/elix/src/base/internal.js";
import * as template from "../../../../node_modules/elix/src/core/template.js";
import Button from "../../../../node_modules/elix/src/base/Button.js";
import html from "../../../../node_modules/elix/src/core/html.js";

/**
 * Dropdown arrow is static and is rotated by a top level class
 * Simply exporting to use as the popupTogglePartType
 */
export const dropdownArrow = template.html`
  <span class="bx--dropdown__arrow-container">
    <svg
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      style="will-change: transform;"
      xmlns="http://www.w3.org/2000/svg"
      class="bx--dropdown__arrow"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      <path d="M8 11L3 6 3.7 5.3 8 9.6 12.3 5.3 13 6z"></path>
    </svg>
  </span>
`;

/**
 * Carbon dropdown source that extends Elix [Button](https://component.kitchen/elix/Button).
 */
export default class DropdownSource extends Button {
  [internal.render](changed) {
    super[internal.render](changed);
    // Add base class at firstRender
    if (this[internal.firstRender]) {
      this.classList.add("bx--dropdown");
      this[internal.ids].inner.classList.add("bx--dropdown-text");
    }
  }

  get [internal.template]() {
    const result = super[internal.template];
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
