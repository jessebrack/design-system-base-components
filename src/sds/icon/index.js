import * as internal from "../../../node_modules/elix/src/base/internal.js";
import * as template from "../../../node_modules/elix/src/core/template.js";
import ReactiveElement from "../../../node_modules/elix/src/core/ReactiveElement.js";

class SdsIcon extends ReactiveElement {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      set: "utility",
      symbol: "add"
    });
  }

  get size() {
    return this[internal.state].size;
  }
  set size(size) {
    this[internal.setState]({ size });
  }

  get boundarysize() {
    return this[internal.state].boundarysize;
  }
  set boundarysize(boundarysize) {
    this[internal.setState]({ boundarysize });
  }

  get set() {
    return this[internal.state].set;
  }
  set set(set) {
    this[internal.setState]({ set });
  }

  get symbol() {
    return this[internal.state].symbol;
  }
  set symbol(symbol) {
    this[internal.setState]({ symbol });
  }

  [internal.render](changed) {
    super[internal.render](changed);

    if (changed.size) {
      const computedSizeClassName = `lwc-icon_${this[internal.state].size}`;
      this[internal.ids].icon.classList.add(computedSizeClassName);
    }

    if (changed.boundarysize) {
      const computedSizeClassName = `lwc-icon-boundary_${
        this[internal.state].boundarysize
      }`;
      this[internal.ids].boundary.classList.add(computedSizeClassName);
    }

    if (changed.set || changed.symbol) {
      const computedSizeClassName = `lwc-icon-${this[internal.state].set}-${
        this[internal.state].symbol
      }`;
      this[internal.ids].icon.classList.add(computedSizeClassName);
      const path = `/public/icons/${this[internal.state].set}/symbols.svg#${
        this[internal.state].symbol
      }`;
      const useEl = this[internal.ids].icon.querySelector("use");
      useEl.setAttribute("xlink:href", path);
    }
  }

  get [internal.template]() {
    return template.html`
      <style>
        @import url("/src/sds/common/index.css");
        @import url("/src/sds/icon/index.css");
      </style>
      <span id="boundary" class="lwc-icon-boundary" part="icon-source">
				<span id="icon" class="lwc-icon">
					<svg class="lwc-svg" aria-hidden="true">
						<use xlink:href=""></use>
					</svg>
        </span>
      </span>
    `;
  }
}

export default SdsIcon;

customElements.define("sds-icon", SdsIcon);
