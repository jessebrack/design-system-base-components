import * as internal from "../../../node_modules/elix/src/base/internal.js";
import * as template from "../../../node_modules/elix/src/core/template.js";
import html from "../../../node_modules/elix/src/core/html.js";
import VStack from "../../base/VStack/index.js";

const header = title => {
  return template.html`
		<div class="lwc-card__header">
      <header>
        <slot name="headerIcon" id="headerIcon" class="lwc-card__header-figure"></slot>

				<h2 class="lwc-card__header-title">
					<span id="headerTitle">${title}</span>
        </h2>

        <slot name="headerActions" id="headerActions" class="lwc-card__header-actions"></slot>
			</header>
		</div>
	`;
};

const footer = () => {
  return template.html`
		<footer class="lwc-card__footer">
      <slot name="footer"></slot>
		</footer>
	`;
};

export default class SdsCard extends VStack {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      headerPartType: header("Card Title"),
      titlePartType: "h2",
      footerPartType: footer()
    });
  }

  get title() {
    return this[internal.state].title;
  }
  set title(title) {
    this[internal.setState]({ title });
  }

  get iconPartType() {
    return this[internal.state].iconPartType;
  }
  set iconPartType(iconPartType) {
    this[internal.setState]({ iconPartType });
  }

  get actionsPartType() {
    return this[internal.state].actionsPartType;
  }
  set actionsPartType(actionsPartType) {
    this[internal.setState]({ actionsPartType });
  }

  [internal.render](changed) {
    super[internal.render](changed);

    if (changed.title) {
      this[internal.ids].headerTitle.textContent = this[internal.state].title;
    }

    if (changed.iconPartType) {
      template.transmute(
        this[internal.ids].headerIcon,
        this[internal.state].iconPartType
      );
    }

    if (changed.actionsPartType) {
      template.transmute(
        this[internal.ids].headerActions,
        this[internal.state].actionsPartType
      );
    }
  }

  get [internal.template]() {
    const result = super[internal.template];

    // Can this be cleaned up?
    const sourcePart = result.content.getElementById("source");
    sourcePart.setAttribute("class", "lwc-card");

    const contentPart = result.content.getElementById("content");
    contentPart.setAttribute("class", "lwc-card__body");

    result.content.append(html`
      <style>
        @import url("/src/sds/common/index.css");
        @import url("/src/sds/card/index.css");
      </style>
    `);
    return result;
  }
}

customElements.define("sds-card", SdsCard);
