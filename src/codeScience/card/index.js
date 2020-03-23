import * as internal from "../../../node_modules/elix/src/base/internal.js";
import * as template from "../../../node_modules/elix/src/core/template.js";
import html from "../../../node_modules/elix/src/core/html.js";
import SdsCard from "../../sds/card/index.js";

export default class CodeScienceCard extends SdsCard {
  get [internal.template]() {
    const result = super[internal.template];

    // Want to keep header from SdsCard but need to move it below the image
    const headerPart = result.content.getElementById("header");
    const contentPart = result.content.querySelector("slot:not([name])");
    contentPart.insertAdjacentElement("beforebegin", headerPart);

    result.content.append(
      html`
        <style>
          [part="inner"] {
            padding: 1.5rem;
          }
          slot[name="above-content"]::slotted(img) {
            border-top-left-radius: var(--lwc-c-card-radius);
            border-top-right-radius: var(--lwc-c-card-radius);
            width: 100%;
          }
          slot[name="footer"]::slotted(div) {
            display: inline-flex;
            --lwc-c-button-spacing-horizontal-end: 1rem;
          }
        </style>
      `
    );
    return result;
  }
}

customElements.define("cs-card", CodeScienceCard);
