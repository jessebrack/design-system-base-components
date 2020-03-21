import * as internal from "../../node_modules/elix/src/base/internal.js";
import * as template from "../../node_modules/elix/src/core/template.js";
import ReactiveElement from "../../node_modules/elix/src/core/ReactiveElement.js";

export default class SomeRandomComponent extends ReactiveElement {
  get [internal.template]() {
    return template.html`
      <div part="source">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define("some-random-component", SomeRandomComponent);
