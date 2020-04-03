import * as internal from "../../../node_modules/elix/src/base/internal.js";
import html from "../../../node_modules/elix/src/core/html.js";
import * as template from "../../../node_modules/elix/src/core/template.js";
import OverlayFrame from "../../../node_modules/elix/src/base/OverlayFrame.js";

/**
 * Carbon variation of an Elix [OverlayFrame](https://component.kitchen/elix/OverlayFrame).
 */
export default class CarbonOverlayFrame extends OverlayFrame {
  get [internal.template]() {
    const result = super[internal.template];
    /**
     * Take existing slot and wrap it in HTMLElement with class
     */
    const slot = result.content.querySelector("slot:not([name])");
    const wrapper = html`
      <div class="bx--dropdown-list">
        <slot></slot>
      </div>
    `;
    template.replace(slot, wrapper);
    /**
     * Need to setup custom props to keep the style of Carbon
     * dropdown while still be able to invoke the animation. (transition prop doesn't work ATM)
     *
     * I could not apply the class to the custom element because it
     * had specificity issues when it came to the display property
     */
    result.content.append(
      html`
        <style>
          @import url("https://unpkg.com/carbon-components/css/carbon-components.min.css");

          .bx--dropdown-list {
            position: var(--bx-dropdown-position);
            max-height: var(--bx-dropdown-height);
            transition: var(--bx-dropdown-transition);
          }
        </style>
      `
    );
    return result;
  }
}
