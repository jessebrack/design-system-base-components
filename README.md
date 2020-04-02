## About

> This repository is a fork of https://github.com/JanMiksovsky/lightning-factor. Original demo published at https://janmiksovsky.github.io/lightning-factor.

Demo: https://pensive-almeida-f443ce.netlify.com/

This repository explores the possibility of implementing web components for the Salesforce Lightning Design System (SLDS) on top of a generic component library that was designed to be themed and extended. The particular component library used for this experiment is [Elix](https://component.kitchen/elix), which was expressly designed for such a purpose.

In addition, this fork tries to highlight real-world customization scenarios seen on the Salesforce Platform. With that in mind, these examples try to highlight minimal customizations (changing brand colors) to extreme customizations (modifying HTML templates/extending APIs).

The goal is to capture evidence, conclusive or not, that the concepts provided by Elix can support creating a customized experience with any Design System of choice.

Most importantly, this work should determine the feasibility of building an agnostic design system (Salesforce Design System) that can be applied to a set of base components and extended into the existing structure of our LWC Lightning Components. The approaches will inform the architecture to meet a customers desire to build customized experiences.


## Quick Start

```
npm install
npm start
```

## Dependencies

This project requires little to no dependencies. The primitive layers requires Elix, which serves the customizable web components to build our interfaces for our Design System and its Sub Systems.

- `Node ^8.x` for a static web server to load ES modules.
- `Elix` for customizable authored web components.

### Things to build:

1. ✅ Build a net new component for Base Web Components that can be used by other Design Systems.
2. ✅ Use new Base Web Component to extend into the Salesforce Design System Layer and build another net new component that inherits the template and APIs from the Super Class.
3. ✅ Apply the Styling API and extend component to expose SDS specific APIs
4. Extend net new SDS Web Component to highlight real world use by a customer:
    - Layers
      - ✅ Salesforce Lightning Design System
      - ✅ Internal customer (Trailhead)
      - ✅ External customer (CodeScience)
      - External customer (Disney)
    - 3rd party open source Design System (Carbon - IBMs Design System)
5. ✅ Apply Dark Mode toggle

### Things to try:

- Open the button menu component at the top of the demo page using both standard UI methods of selecting a menu item with the mouse. First method: click on the button to open the menu, and click a second time on the desired menu item. Second method: mouse down on the menu button, drag into the menu while holding the mouse button down, then release the mouse over the desired menu item. See this [blog post](https://component.kitchen/blog/posts/building-a-great-menu-component-is-so-much-trickier-than-youd-think) on these techniques and other subtleties of menu interaction. On desktop, both techniques are critical to achieve the fluid interactivity of native desktop menus bars. The existing lightning-button-menu base component only supports the two-click method, and hence lacks full parity with desktop menus.

- In the carousels, navigate the selection with all interaction modes: mouse, keyboard, touch gesture (on a mobile device, or using the mobile emulator in dev tools), and trackpad swipe gesture (on a laptop with a trackpad). The exising lightning-carousel component supports the mouse and keyboard, but appears to have limited (?) touch support, and no support for trackpad gestures.

- Open the Network panel, load the page, and observe that _all the source modules are being loaded directly in the browser_. There is no build or bundling step required here, because the Elix component core is designed using only native browser APIs and no build-time dependencies. The size of the code transferred is nevertheless fairly small. In a production application, of course, the demo code files would be bundled and minified for better performance; the size of the resulting bundle would likely be in the ~20KB range.

### Things to observe in the code in the `/src` folder:

- Each folder contains a namespace of components.

  Though not illustrated in the folder structure, **base** is the foundational base web components layer (all of Elix plus a new component). Then the **sds** namespace is applied on top of the base layer. Then **slds** and **trailhead** use the Syling API and template patching to create their respective namespaced components.

```
| Theme: |           Dark Mode             |
|------------------------------------------|
| Layers: | slds | trailhead | CodeScience |
|------------------------------------------|
| Design System: |          sds            |
|------------------------------------------|
| Base Web Components: |       base        |
```

- The code required to build each SDS components + Layer components is generally extremely small.

- Each SDS web components starts by subclassing an existing Elix component class. The Elix base class takes care of nearly all the details of structural presentation (positioning a menu with regard to a button, say), interactions, and basics such as accessibility.

- Many of these SDS component subclasses patch their base class template in order to bake in custom styling. See [Template Patching](https://component.kitchen/elix/customizing#template-patching) for details.

- Most of the component subclasses also dynamically [replace element parts](https://component.kitchen/elix/customizing#replaceable-element-parts) in the component's shadow. E.g., the SldsCarousel component indicates that, instead of using a standard Elix PageDot component for each of the little dots (called a "proxy"), the component should instead use a custom SLDSPageDot component for the dots instead.

- In many situations, a theme being applied to the Styling API provided by the SDS layer is sufficient to achieve visual brand expression. Those components are still in the sds namespace for the custom element. Unless functionality or structure needs to be forked, a new namespace is not created.
  - This is how the dark mode is represented. Though my suggestion would be to create a mixin that a component can use to embed dark mode functionality into the component, rather then relying on a contextual theme attributes.

### Caveats:

- These components do **not** attempt to provide drop-in replacements for the corresponding Lightning Base Web Components (BWC). Much additional work would be required to support the full API of the corresponding Lightning base component. That said, it's also the case that much of that full API is necessary because it's difficult to extend those components; that forces the components to try to cover a wide range of conceivable use cases. Instead of doing that, the approach suggested here would advocate defining a smaller base feature set for each component, and relying on specific teams to apply further customizations to address their unique or unusual use cases.
