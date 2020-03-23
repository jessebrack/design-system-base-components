import * as internal from "../node_modules/elix/src/base/internal.js";
import * as template from "../node_modules/elix/src/core/template.js";
import ReactiveElement from "../node_modules/elix/src/core/ReactiveElement.js";

export default class ThemeProvider extends ReactiveElement {
  get system() {
    return this[internal.state].system;
  }
  set system(system) {
    this[internal.setState]({ system });
  }

  get theme() {
    return this[internal.state].theme;
  }
  set theme(theme) {
    this[internal.setState]({ theme });
  }

  [internal.render](changed) {
    super[internal.render](changed);

    if (changed.system && !changed.theme) {
      console.log(this[internal.state].system);
      const style = template.createElement("style");
      style.textContent = `
				@import url("../themes/${this[internal.state].system}/themeProvider.css");
			`;
      template.replace(this[internal.ids].import, style);
    }

    if (changed.system && changed.theme) {
      console.log(this[internal.state].theme);
      const style = template.createElement("style");
      style.textContent = `
      @import url("../themes/${this[internal.state].system}/themeProvider.css");
      @import url("../themes/${this[internal.state].theme}/themeProvider.css");
			`;
      template.replace(this[internal.ids].import, style);
    }
  }

  get [internal.template]() {
    return template.html`
				<span id="import"></span>
				<style>
					:host {
						display: block;
          }
          ::slotted(.background) {
            padding: 1rem;
						background: var(--theme-background);
          }
				</style>
				<slot></slot>
			`;
  }
}

customElements.define("sds-theme-provider", ThemeProvider);
