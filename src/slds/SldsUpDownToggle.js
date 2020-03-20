import * as internal from "../../node_modules/elix/src/base/internal.js";
import * as template from "../../node_modules/elix/src/core/template.js";
import html from "../../node_modules/elix/src/core/html.js";
import UpDownToggle from "../../node_modules/elix/src/base/UpDownToggle.js";

class SldsUpDownToggle extends UpDownToggle {
	get [internal.template]() {
		const result = super[internal.template];

		// Replace the icons with our up/down glyphs.
		// For now, we use the same icon for both up and down.
		const downIcon = result.content.getElementById("downIcon");
		const downIconGlyph = html`
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="downIcon">
				<path
					d="M3.8 6.5h16.4c.4 0 .8.6.4 1l-8 9.8c-.3.3-.9.3-1.2 0l-8-9.8c-.4-.4-.1-1 .4-1z"
				></path>
			</svg>
		`.children[0];
		if (downIcon && downIconGlyph) {
			template.replace(downIcon, downIconGlyph);
		}
		const upIcon = result.content.getElementById("upIcon");
		const upIconGlyph = html`
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="upIcon">
				<path
					d="M3.8 6.5h16.4c.4 0 .8.6.4 1l-8 9.8c-.3.3-.9.3-1.2 0l-8-9.8c-.4-.4-.1-1 .4-1z"
				></path>
			</svg>
		`.children[0];
		if (upIcon && upIconGlyph) {
			template.replace(upIcon, upIconGlyph);
		}

		result.content.append(
			html`
				<style>
					[part~="down-icon"],
					[part~="up-icon"] {
						fill: currentColor;
						width: 0.875rem;
						height: 0.875rem;
					}
				</style>
			`
		);
		return result;
	}
}

export default SldsUpDownToggle;
