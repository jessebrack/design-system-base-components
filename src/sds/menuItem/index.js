import * as internal from "../../../node_modules/elix/src/base/internal.js";
import * as template from "../../../node_modules/elix/src/core/template.js";
import ReactiveElement from "../../../node_modules/elix/src/core/ReactiveElement.js";

export default class SdsMenuItem extends ReactiveElement {
  get [internal.template]() {
    return template.html`
      <style>
        @import url("/src/sds/common/index.css");
        @import url("/src/sds/menu/index.css");

        :host {
          display: inline-block;
        }
      </style>
      <div class="lwc-menuitem">
        <span class="lwc-menuitem__content">
          <slot></slot>
        </span>
      </div>
    `;
  }
}

customElements.define("sds-menu-item", SdsMenuItem);
