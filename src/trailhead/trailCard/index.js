import * as internal from "../../../node_modules/elix/src/base/internal.js";
import * as template from "../../../node_modules/elix/src/core/template.js";
import html from "../../../node_modules/elix/src/core/html.js";
import SdsCard from "../../sds/card/index.js";

/**
 * Lazy attempt to accept new HTML for image
 */
const trailImage = () => {
  return template.html`
    <div class="trail-image">
      <img src="/public/images/trail.png" alt="" width="90" />
    </div>
  `;
};

export default class TrailheadTrailCard extends SdsCard {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      imagePartType: trailImage()
    });
  }

  get image() {
    return this[internal.state].image;
  }
  set image(image) {
    this[internal.setState]({ image });
  }

  [internal.render](changed) {
    super[internal.render](changed);
    if (changed.image) {
      console.log("image changed");
    }

    if (changed.imagePartType) {
      template.transmute(
        this[internal.ids].trailImage,
        this[internal.state].imagePartType
      );
    }
  }

  get [internal.template]() {
    const result = super[internal.template];

    // Inject new HTML into location above header
    const headerPart = result.content.getElementById("header");
    const imagePlaceholder = document.createElement("div");
    imagePlaceholder.setAttribute("id", "trailImage");
    headerPart.insertAdjacentElement("beforebegin", imagePlaceholder);

    result.content.append(
      html`
        <style>
          @import url("/src/trailhead/trailCard/index.css");
        </style>
      `
    );
    return result;
  }
}

customElements.define("th-trail-card", TrailheadTrailCard);
