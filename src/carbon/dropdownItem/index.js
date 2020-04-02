import * as internal from "../../../node_modules/elix/src/base/internal.js";
import * as template from "../../../node_modules/elix/src/core/template.js";
import ReactiveElement from "../../../node_modules/elix/src/core/ReactiveElement.js";

export default class CarbonDropdownItem extends ReactiveElement {
  get [internal.template]() {
    return template.html`
      <style>
        @import url("https://unpkg.com/carbon-components/css/carbon-components.min.css");

        :host {
          display: inline-block;
        }
      </style>

      <div class="bx--dropdown-item">
        <span class="bx--dropdown-link">
          <slot></slot>
        </span>
      </div>
    `;
  }
}

customElements.define("carbon-dropdown-item", CarbonDropdownItem);
