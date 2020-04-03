import * as internal from "../../../node_modules/elix/src/base/internal.js";
import html from "../../../node_modules/elix/src/core/html.js";
import DropdownList from "../../../node_modules/elix/src/base/DropdownList.js";
import SdsButton from "../button/index.js";
import SdsMenu from "../menu/index.js";
import SdsPopup from "../popup/index.js";
import SdsIcon from "../icon/index.js";

/**
 * SDS variation of an Elix [DropdownList](https://component.kitchen/elix/DropdownList).
 */
export default class SdsDropdownList extends DropdownList {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      horizontalAlign: "stretch",
      menuPartType: SdsMenu,
      popupPartType: SdsPopup,
      popupTogglePartType: SdsIcon,
      sourcePartType: SdsButton
    });
  }

  get variant() {
    return this.variant;
  }
  set variant(variant) {
    this[internal.setState]({ variant });
  }

  [internal.render](changed) {
    super[internal.render](changed);
    /**
     * Passing the variant attribute down to the source element,
     * which is the sds button. This will change the look of the source button.
     */
    if (changed.variant) {
      this[internal.ids].source.setAttribute(
        "variant",
        this[internal.state].variant
      );
    }
    /**
     * 1. Passing symbol attribute down the the sds icon
     * 2. Move the popupToggle part into the button icon wrapper, see [internal.template]() for
     * where that wrapper is being added
     */
    if (changed.popupTogglePartType) {
      this[internal.ids].popupToggle.setAttribute("symbol", "chevrondown");
      this[internal.ids].buttonIcon.appendChild(this[internal.ids].popupToggle);
    }
  }

  get [internal.template]() {
    const result = super[internal.template];
    /**
     * When an icon is inside of a button element, SDS CSS expects there to
     * be a wrapping element. Doing that here.
     */
    const icon = result.content.getElementById("popupToggle");
    icon.parentNode.append(
      html`
        <div id="buttonIcon" class="lwc-button__icon-right"></div>
      `
    );
    result.content.append(
      html`
        <style>
          :host {
            max-width: 15rem;
            min-width: 12rem;
          }
          [part="value"] {
            color: currentColor;
            flex: 1;
          }
        </style>
      `
    );
    return result;
  }
}

customElements.define("sds-picklist", SdsDropdownList);
