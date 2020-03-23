import * as internal from "../../../node_modules/elix/src/base/internal.js";
import * as template from "../../../node_modules/elix/src/core/template.js";
import ReactiveElement from "../../../node_modules/elix/src/core/ReactiveElement.js";

const Base = ReactiveElement;

/**
 * VStack was created to determine the complexity a developer
 * would experience if a new component was introduced to the
 * base component layer that was maybe too opinionated.
 *
 * VStack attempts to provide semantic structure that mimics
 * an HTML Article Element.
 *
 * This component will be used to be the foundation of a Card
 * found inside of the SDS design system.
 */

export default class VStack extends Base {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      sourcePartType: "article",
      headerPartType: "header",
      contentPartType: "div",
      footerPartType: "footer"
    });
  }

  get sourcePartType() {
    return this[internal.state].sourcePartType;
  }
  set sourcePartType(sourcePartType) {
    this[internal.setState]({ sourcePartType });
  }

  get headerPartType() {
    return this[internal.state].headerPartType;
  }
  set headerPartType(headerPartType) {
    this[internal.setState]({ headerPartType });
  }

  get contentPartType() {
    return this[internal.state].contentPartType;
  }
  set contentPartType(contentPartType) {
    this[internal.setState]({ contentPartType });
  }

  get footerPartType() {
    return this[internal.state].footerPartType;
  }
  set footerPartType(footerPartType) {
    this[internal.setState]({ footerPartType });
  }

  [internal.render](changed) {
    super[internal.render](changed);

    if (changed.sourcePartType) {
      template.transmute(
        this[internal.ids].source,
        this[internal.state].sourcePartType
      );
    }

    if (changed.headerPartType) {
      template.transmute(
        this[internal.ids].header,
        this[internal.state].headerPartType
      );
    }

    if (changed.contentPartType) {
      template.transmute(
        this[internal.ids].content,
        this[internal.state].contentPartType
      );
    }

    if (changed.footerPartType) {
      template.transmute(
        this[internal.ids].footer,
        this[internal.state].footerPartType
      );
    }
  }

  get [internal.template]() {
    return template.html`
      <style>
        :host {
          display: block;
        }
        [part="content"] {
          display: flex;
					flex-direction: column;
        }
			</style>

			<article id="source" part="source">
        <header id="header"></header>
				<div id="content" part="content">
					<slot name="above-content"></slot>
					<div id="inner-content" part="inner">
          	<slot></slot>
					</div>
					<slot name="below-content"></slot>
        </div>
		    <footer id="footer"></footer>
		  </article>
		`;
  }
}

customElements.define("base-vstack", VStack);
