import * as internal from "../../../node_modules/elix/src/base/internal.js";
import html from "../../../node_modules/elix/src/core/html.js";
import Menu from "../../../node_modules/elix/src/base/Menu.js";

/**
 * SLDS variation of an Elix [Menu](https://component.kitchen/elix/Menu).
 */
export default class SldsMenu extends Menu {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      generic: false,
    });
  }

  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      html`
        <style>
          /* Turn off some Elix styles */
          :host {
            background: inherit;
          }

          /* slds-dropdown */
          :host {
            min-width: 6rem;
            max-width: 20rem;
            padding: 0.25rem 0;
            font-size: 0.75rem;
          }

          /* .slds-dropdown__item */
          ::slotted(*) {
            line-height: 1.5;
            font-weight: 400;
          }

          ::slotted(*) {
            font-size: 0.75rem;
          }

          ::slotted(*) {
            background-color: transparent;
          }

          ::slotted(*) {
            color: #006dcc;
            text-decoration: none;
            transition: color 0.1s linear;
          }

          ::slotted(*) {
            position: relative;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0.75rem;
            color: #080707;
            white-space: nowrap;
            /* cursor: pointer; */
          }

          ::slotted(:hover),
          ::slotted([selected]) {
            background-color: #f3f2f2;
          }
        </style>
      `
    );
    return result;
  }
}

customElements.define("slds-menu", Menu);
