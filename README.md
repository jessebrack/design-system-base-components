This repository explores the possibility of implementing web components for the Salesforce Lightning Design System (SLDS) on top of a generic component library that was designed to be themed and extended. The particular component library used for this experiment is [Elix](https://component.kitchen/elix), which was expressly designed for such a purpose.

Demo published at https://janmiksovsky.github.io/lightning-factor.

Things to try:

- Open the button menu component at the top of the demo page using both standard UI methods of selecting a menu item with the mouse. First method: click on the button to open the menu, and click a second time on the desired menu item. Second method: mouse down on the menu button, drag into the menu while holding the mouse button down, then release the mouse over the desired menu item. See this [blog post](https://component.kitchen/blog/posts/building-a-great-menu-component-is-so-much-trickier-than-youd-think) on these techniques and other subtleties of menu interaction. On desktop, both techniques are critical to achieve the fluid interactivity of native desktop menus bars. The existing lightning-button-menu base component only supports the two-click method, and hence lacks full parity with desktop menus.

- In the carousels, navigate the selection with all interaction modes: mouse, keyboard, touch gesture (on a mobile device, or using the mobile emulator in dev tools), and trackpad swipe gesture (on a laptop with a trackpad). The exising lightning-carousel component supports the mouse and keyboard, but appears to have limited (?) touch support, and no support for trackpad gestures.

- Open the Network panel, load the page, and observe that _all the source modules are being loaded directly in the browser_. There is no build or bundling step required here, because the Elix component core is designed using only native browser APIs and no build-time dependencies. The size of the code transferred is nevertheless fairly small. In a production application, of course, the demo code files would be bundled and minified for better performance; the size of the resulting bundle would likely be in the ~20KB range.

Things to observe in the code in the `/src` folder:

- The code required to build each SLDS component is generally extremely small.
- Each SLDS web components starts by subclassing an existing Elix component class. The Elix base class takes care of nearly all the details of structural presentation (positioning a menu with regard to a button, say), interactions, and basics such as accessibility.
- Many of these SLDS component subclasses patch their base class template in order to bake in custom styling. See [Template Patching](https://component.kitchen/elix/customizing#template-patching) for details.
- Most of the component subclasses also dynamically [replace element parts](https://component.kitchen/elix/customizing#replaceable-element-parts) in the component's shadow. E.g., the SldsCarousel component indicates that, instead of using a standard Elix PageDot component for each of the little dots (called a "proxy"), the component should instead use a custom SLDSPageDot component for the dots instead.

Caveats:

- The styling used here does a reasonable job approximating the existing SLDS blueprints for each component, and uses some of the SLDS-provided CSS, but is not intended at this point to be a pixel-perfect match.
- These components do **not** attempt to provide drop-in replacements for the corresponding Lightning Base Web Components (BWC). Much additional work would be required to support the full API of the corresponding Lightning base component. That said, it's also the case that much of that full API is necessary because it's difficult to extend those components; that forces the components to try to cover a wide range of conceivable use cases. Instead of doing that, the approach suggested here would advocate defining a smaller base feature set for each component, and relying on specific teams to apply further customizations to address their unique or unusual use cases.
