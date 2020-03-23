import * as internal from "../../../node_modules/elix/src/base/internal.js";
import html from "../../../node_modules/elix/src/core/html.js";
import SdsButtonIcon from "../../sds/buttonIcon/index.js";

export default class TrailheadButtonIcon extends SdsButtonIcon {
  /**
   * Default state for Trailhead button icons is always neutral theme
   */
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      variant: "neutral"
    });
  }

  get [internal.template]() {
    const result = super[internal.template];
    /**
     * Trailhead design system has a reduced number of buttonIcon
     * variations. The size seems to be consistent throughout the system at 38x38px.
     * I'm using this extension point to expose the Styling API class
     * to accept a new token that will be applied to all Trailhead Button Icons.
     */
    result.content.append(
      html`
        <style>
          ::part(icon-source) {
            width: var(--th-c-button-icon-size, 2.375rem);
            height: var(--th-c-button-icon-size, 2.375rem);
          }
        </style>
      `
    );
    return result;
  }
}

customElements.define("th-button-icon", TrailheadButtonIcon);
