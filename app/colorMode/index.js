import * as internal from "../../../node_modules/elix/src/base/internal.js";
import * as template from "../../../node_modules/elix/src/core/template.js";
import ReactiveElement from "../../../node_modules/elix/src/core/ReactiveElement.js";

export default class ColorModeToggle extends ReactiveElement {
  get [internal.defaultState]() {
    return {
      darkMode: false
    };
  }

  get darkMode() {
    return this[internal.state].darkMode;
  }
  set darkMode(darkMode) {
    this[internal.setState]({ darkMode });
  }

  [internal.render](changed) {
    super[internal.render](changed);
    if (this[internal.firstRender]) {
      this[internal.ids].modeToggle.addEventListener("click", () => {
        this[internal.setState]({ darkMode: !this.darkMode });

        const providers = document.querySelectorAll("[system]");
        providers.forEach(provider => {
          if (provider.hasAttribute("theme")) {
            provider.removeAttribute("theme", "dark");
          } else if (this.darkMode) {
            provider.setAttribute("theme", "dark");
          }
        });
      });
    }

    if (changed.darkMode) {
      this[internal.ids].modeToggle.textContent = `Dark Mode: ${this.darkMode}`;
    }
  }

  get [internal.template]() {
    return template.html`
      <sds-button id="modeToggle" variant="neutral">Mode</sds-button>
    `;
  }
}

customElements.define("color-mode-toggle", ColorModeToggle);
