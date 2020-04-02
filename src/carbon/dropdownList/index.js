import * as internal from "../../../node_modules/elix/src/base/internal.js";
import html from "../../../node_modules/elix/src/core/html.js";
import DropdownList from "../../../node_modules/elix/src/base/DropdownList.js";
import DropdownSource, { dropdownArrow } from "./dropdownSource/index.js";
import DropdownPopup from "./dropdownPopup/index.js";

/**
 * Carbon variation of an Elix [DropdownList](https://component.kitchen/elix/DropdownList).
 */
export default class CarbonDropdownList extends DropdownList {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      // horizontalAlign: "stretch",
      // menuPartType: SdsMenu,
      popupPartType: DropdownPopup,
      popupTogglePartType: dropdownArrow,
      sourcePartType: DropdownSource
    });
  }

  get variant() {
    return this[internal.state].variant;
  }
  set variant(variant) {
    this[internal.setState]({ variant });
  }

  [internal.render](changed) {
    super[internal.render](changed);
  }

  get [internal.template]() {
    const result = super[internal.template];

    result.content.append(
      html`
        <style>
          @import url("https://unpkg.com/carbon-components/css/carbon-components.min.css");
          [part="value"] {
            color: currentColor;
            flex: 1;
          }
          :host([aria-expanded="true"]) [part="popup-toggle"] svg {
            transform: rotate(-180deg);
          }
          :host([aria-expanded="true"]) {
            --bx-dropdown-position: relative;
            --bx-dropdown-height: 15rem;
            --bx-dropdown-transition: max-height 110ms
              cubic-bezier(0, 0, 0.38, 0.9);
          }
        </style>
      `
    );
    return result;
  }
}

customElements.define("carbon-dropdown", CarbonDropdownList);
