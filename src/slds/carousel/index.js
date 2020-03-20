import * as internal from "/node_modules/elix/src/base/internal.js";
import Carousel from "/node_modules/elix/src/base/Carousel.js";
import CenteredStrip from "/node_modules/elix/src/base/CenteredStrip.js";
import html from "/node_modules/elix/src/core/html.js";
import SldsPageDot from "./pageDot/index.js";
import SlidingStage from "/node_modules/elix/src/base/SlidingStage.js";

/**
 * SLDS variation of an Elix [Carousel](https://component.kitchen/elix/Carousel).
 */
export default class SldsCarousel extends Carousel {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      proxyListOverlap: false,
      proxyListPartType: CenteredStrip,
      proxyPartType: SldsPageDot,
      showArrowButtons: false,
      stagePartType: SlidingStage
    });
  }

  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      html`
        <style>
          [part~="proxy-list"] {
            margin-top: 0.5em;
          }
        </style>
      `
    );
    return result;
  }
}

customElements.define("slds-carousel", SldsCarousel);
