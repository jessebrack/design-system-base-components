(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  /**
   * Collection of shared Symbol objects for internal component communication.
   *
   * The shared `Symbol` objects in this module let mixins and a component
   * internally communicate without exposing these internal properties and methods
   * in the component's public API. They also help avoid unintentional name
   * collisions, as a component developer must specifically import the `internal`
   * module and reference one of its symbols.
   *
   * To use these `Symbol` objects in your own component, include this module and
   * then create a property or method whose key is the desired Symbol. E.g.,
   * [ShadowTemplateMixin](ShadowTemplateMixin) expects a component to define
   * a property called [internal.template](#template):
   *
   *     import * as internal from 'elix/src/internal.js';
   *     import * as template from 'elix/src/template.js'
   *     import ShadowTemplateMixin from 'elix/src/ShadowTemplateMixin.js';
   *
   *     class MyElement extends ShadowTemplateMixin(HTMLElement) {
   *       [internal.template]() {
   *         return template.html`Hello, <em>world</em>.`;
   *       }
   *     }
   *
   * The above use of `internal.template` lets the mixin find the component's
   * template in a way that will not pollute the component's public API or
   * interfere with other component logic. For example, if for some reason the
   * component wants to define a separate property with the plain string name,
   * "template", it can do so without affecting the above property setter.
   */

  /**
   * Symbol for the `componentDidMount` method.
   *
   * A component using [ReactiveMixin](ReactiveMixin) will have this method
   * invoked the first time the component is rendered in the DOM.
   *
   * This method has been deprecated; use `rendered` instead.
   */
  const componentDidMount = Symbol("componentDidMount");

  /**
   * Symbol for the `componentDidUpdate` method.
   *
   * A component using [ReactiveMixin](ReactiveMixin) will have this method
   * invoked a component already in the DOM has finished a subsequent render
   * operation.
   *
   * This method has been deprecated; use `rendered` instead.
   */
  const componentDidUpdate = Symbol("componentDidUpdate");

  /**
   * Symbol for the default state for this element.
   */
  const defaultState = Symbol("defaultState");

  /**
   * Symbol for the `delegatesFocus` property.
   *
   * [DelegatesFocusMixin](DelegatesFocusMixin) defines this property, returning
   * true to indicate that the focus is being delegated, even in browsers that
   * don't support that natively. Mixins like [KeyboardMixin](KeyboardMixin) use
   * this to accommodate focus delegation.
   */
  const delegatesFocus = Symbol("delegatesFocus");

  /**
   * Symbol for the `firstRender` property.
   *
   * [ReactiveMixin](ReactiveMixin) sets the property to `true` during the
   * element's first `render` and `rendered` callback, then `false` in subsequent
   * callbacks.
   *
   * You can inspect this property in your own `rendered` callback handler to do
   * work like wiring up events that should only happen once.
   */
  const firstRender = Symbol("firstRender");

  /**
   * Symbol for the `focusTarget` property.
   *
   * [DelegatesFocusMixin](DelegatesFocusMixin) defines this property as either:
   * 1) the element itself, in browsers that support native focus delegation or,
   * 2) the shadow root's first focusable element.
   */
  const focusTarget = Symbol("focusTarget");

  /**
   * Symbol for the `hasDynamicTemplate` property.
   *
   * If your component class does not always use the same template, define a
   * static class property getter with this symbol and have it return `true`.
   * This will disable template caching for your component.
   */
  const hasDynamicTemplate = Symbol("hasDynamicTemplate");

  /**
   * Symbol for the `ids` property.
   *
   * [ShadowTemplateMixin](ShadowTemplateMixin) defines a shorthand function
   * `internal.ids` that can be used to obtain a reference to a shadow element with
   * a given ID.
   *
   * Example: if component's template contains a shadow element
   * `<button id="foo">`, you can use the reference `this[internal.ids].foo` to obtain
   * the corresponding button in the component instance's shadow tree.
   * The `ids` function is simply a shorthand for `getElementById`, so
   * `this[internal.ids].foo` is the same as `this.shadowRoot.getElementById('foo')`.
   */
  const ids = Symbol("ids");

  /**
   * Symbol for access to native HTML element internals.
   */
  const nativeInternals = Symbol("nativeInternals");

  /**
   * Symbol for the `raiseChangeEvents` property.
   *
   * This property is used by mixins to determine whether they should raise
   * property change events. The standard HTML pattern is to only raise such
   * events in response to direct user interactions. For a detailed discussion
   * of this point, see the Gold Standard checklist item for
   * [Propery Change Events](https://github.com/webcomponents/gold-standard/wiki/Property%20Change%20Events).
   *
   * The above article describes a pattern for using a flag to track whether
   * work is being performed in response to internal component activity, and
   * whether the component should therefore raise property change events.
   * This `raiseChangeEvents` symbol is a shared flag used for that purpose by
   * all Elix mixins and components. Sharing this flag ensures that internal
   * activity (e.g., a UI event listener) in one mixin can signal other mixins
   * handling affected properties to raise change events.
   *
   * All UI event listeners (and other forms of internal handlers, such as
   * timeouts and async network handlers) should set `raiseChangeEvents` to
   * `true` at the start of the event handler, then `false` at the end:
   *
   *     this.addEventListener('click', event => {
   *       this[internal.raiseChangeEvents] = true;
   *       // Do work here, possibly setting properties, like:
   *       this.foo = 'Hello';
   *       this[internal.raiseChangeEvents] = false;
   *     });
   *
   * Elsewhere, property setters that raise change events should only do so it
   * this property is `true`:
   *
   *     set foo(value) {
   *       // Save foo value here, do any other work.
   *       if (this[internal.raiseChangeEvents]) {
   *         export const event = new CustomEvent('foo-changed');
   *         this.dispatchEvent(event);
   *       }
   *     }
   *
   * In this way, programmatic attempts to set the `foo` property will not
   * trigger the `foo-changed` event, but UI interactions that update that
   * property will cause those events to be raised.
   */
  const raiseChangeEvents = Symbol("raiseChangeEvents");

  /**
   * Symbol for the `render` method.
   *
   * [ReactiveMixin](ReactiveMixin) invokes this `internal.render` method to give
   * the component a chance to render recent changes in component state.
   */
  const render = Symbol("render");

  /**
   * Symbol for the `renderChanges` method.
   *
   * [ReactiveMixin](ReactiveMixin) invokes this method in response to a
   * `setState` call; you should generally not invoke this method yourself.
   */
  const renderChanges = Symbol("renderChanges");

  /**
   * Symbol for the `rendered` method.
   *
   * [ReactiveMixin](ReactiveMixin) will invoke this method after your
   * element has completely finished rendering.
   *
   * If you only want to do work the first time rendering happens (for example, if
   * you want to wire up event handlers), your `internal.rendered` implementation
   * can inspect the `internal.firstRender` flag.
   */
  const rendered = Symbol("rendered");

  /**
   * Symbol for the `rendering` property.
   *
   * [ReactiveMixin](ReactiveMixin) sets this property to true during rendering,
   * at other times it will be false.
   */
  const rendering = Symbol("rendering");

  /**
   * Symbol for the `setState` method.
   *
   * A component using [ReactiveMixin](ReactiveMixin) can invoke this method to
   * apply changes to the element's current state.
   */
  const setState = Symbol("setState");

  /**
   * Symbol for the `shadowRoot` property.
   *
   * This property holds a reference to an element's shadow root, like
   * `this.shadowRoot`. This propery exists because `this.shadowRoot` is not
   * available for components with closed shadow roots.
   * [ShadowTemplateMixin](ShadowTemplateMixin) creates open shadow roots by
   * default, but you can opt into creating closed shadow roots; see
   * [shadowRootMode](internal#internal.shadowRootMode).
   */
  const shadowRoot = Symbol("shadowRoot");

  /**
   * Symbol for the `shadowRootMode` property.
   *
   * If true (the default), then [ShadowTemplateMixin](ShadowTemplateMixin) will
   * create an open shadow root when the component is instantiated. Set this to
   * false if you want to programmatically hide component internals in a closed
   * shadow root.
   */
  const shadowRootMode = Symbol("shadowRootMode");

  /**
   * Symbol for the element's current state.
   *
   * This is managed by [ReactiveMixin](ReactiveMixin).
   */
  const state = Symbol("state");

  /**
   * Symbol for the `stateEffects` method.
   *
   * See [stateEffects](ReactiveMixin#stateEffects).
   */
  const stateEffects = Symbol("stateEffects");

  /**
   * Symbol for the `template` method.
   *
   * [ShadowTemplateMixin](ShadowTemplateMixin) uses this property to obtain a
   * component's template, which it will clone into a component's shadow root.
   */
  const template = Symbol("template");

  /**
   * Collection of shared Symbol objects for internal component communication.
   *
   * The shared `Symbol` objects in this module let mixins and a component
   * internally communicate without exposing these internal properties and methods
   * in the component's public API. They also help avoid unintentional name
   * collisions, as a component developer must specifically import the `internal`
   * module and reference one of its symbols.
   *
   * To use these `Symbol` objects in your own component, include this module and
   * then create a property or method whose key is the desired Symbol. E.g.,
   * [ShadowTemplateMixin](ShadowTemplateMixin) expects a component to define
   * a property called [internal.template](#template):
   *
   *     import * as internal from 'elix/src/internal.js';
   *     import * as template from 'elix/src/template.js'
   *     import ShadowTemplateMixin from 'elix/src/ShadowTemplateMixin.js';
   *
   *     class MyElement extends ShadowTemplateMixin(HTMLElement) {
   *       [internal.template]() {
   *         return template.html`Hello, <em>world</em>.`;
   *       }
   *     }
   *
   * The above use of `internal.template` lets the mixin find the component's
   * template in a way that will not pollute the component's public API or
   * interfere with other component logic. For example, if for some reason the
   * component wants to define a separate property with the plain string name,
   * "template", it can do so without affecting the above property setter.
   *
   * @module internal
   */

  /**
   * Symbol for the `checkSize` method.
   *
   * If defined, this method will be invoked by [ResizeMixin](ResizeMixin)
   * when an element's size may have changed. The default implementation of
   * this method compares the element's current `clientHeight` and `clientWidth`
   * properties against the last known values of those properties (saved in
   * `state.clienHeight` and `state.clientWidth`).
   *
   * Components should override this method if they contain elements that may need
   * to know about size changes as well. For example, when an [Overlay](Overlay)
   * mixin opens, it invokes this method on any content elements that define it.
   * This gives the contents a chance to resize in response to being displayed.
   */
  const checkSize = Symbol("checkSize");

  /**
   * Symbol for the `componentDidMount` method.
   *
   * A component using [ReactiveMixin](ReactiveMixin) will have this method
   * invoked the first time the component is rendered in the DOM.
   */
  const componentDidMount$1 = componentDidMount;

  /**
   * Symbol for the `componentDidUpdate` method.
   *
   * A component using [ReactiveMixin](ReactiveMixin) will have this method
   * invoked a component already in the DOM has finished a subsequent render
   * operation.
   */
  const componentDidUpdate$1 = componentDidUpdate;

  /**
   * Symbol for the `contentSlot` property.
   *
   * [SlotContentMixin](SlotContentMixin) uses this to identify which slot
   * element in the component's shadow tree that holds the component's content.
   * By default, this is the first slot element with no "name" attribute. You
   * can override this to return a different slot.
   */
  const contentSlot = Symbol("contentSlot");

  /**
   * Symbol for the `defaultTabIndex` property.
   *
   * [KeyboardMixin](KeyboardMixin) uses this if it is unable to successfully
   * parse a string tabindex attribute.
   */
  const defaultTabIndex = Symbol("defaultTabIndex");

  /**
   * The default state for this element.
   */
  const defaultState$1 = defaultState;

  /**
   * Symbol for the `delegatesFocus` property.
   *
   * [DelegatesFocusMixin](DelegatesFocusMixin) defines this property, returning
   * true to indicate that the focus is being delegated, even in browsers that
   * don't support that natively. Mixins like [KeyboardMixin](KeyboardMixin) use
   * this to accommodate focus delegation.
   */
  const delegatesFocus$1 = delegatesFocus;

  /**
   * Symbol for the `effectEndTarget` property.
   *
   * [TransitionEffectMixin](TransitionEffectMixin) inspects this property to
   * determine which element's `transitionend` event will signal the end of a
   * transition effect.
   */
  const effectEndTarget = Symbol("effectEndTarget");

  /**
   * Symbol for the `firstRender` property.
   *
   * [ReactiveMixin](ReactiveMixin) sets the property to `true` during the
   * element's first `connectedCallback`, then `false` in subsequent callbacks.
   *
   * You can inspect this property in your own `connectedCallback` handler
   * to do work like wiring up events that should only happen once.
   */
  const firstRender$1 = firstRender;

  /**
   * Symbol for the `focusTarget` property.
   *
   * [DelegatesFocusMixin](DelegatesFocusMixin) defines this property as either:
   * 1) the element itself, in browsers that support native focus delegation or,
   * 2) the shadow root's first focusable element.
   */
  const focusTarget$1 = focusTarget;

  /**
   * Symbol for the `getItemText` method.
   *
   * This method can be applied to an item to return its text.
   * [KeyboardPrefixSelectionMixin](KeyboardPrefixSelectionMixin) uses this to
   * obtain the text for each item in a list, then matches keypresses again that
   * text.
   *
   * This method takes a single parameter: the `HTMLElement` of the item from
   * which text should be extracted.
   */
  const getItemText = Symbol("getItemText");

  /**
   * Symbol for the `goDown` method.
   *
   * This method is invoked when the user wants to go/navigate down.
   */
  const goDown = Symbol("goDown");

  /**
   * Symbol for the `goEnd` method.
   *
   * This method is invoked when the user wants to go/navigate to the end (e.g.,
   * of a list).
   */
  const goEnd = Symbol("goEnd");

  /**
   * Symbol for the `goLeft` method.
   *
   * This method is invoked when the user wants to go/navigate left. Mixins that
   * make use of this method include
   * [KeyboardDirectionMixin](KeyboardDirectionMixin) and
   * [SwipeDirectionMixin](SwipeDirectionMixin).
   */
  const goLeft = Symbol("goLeft");

  /**
   * Symbol for the `goNext` method.
   *
   * This method is invoked when the user wants to go/navigate to the next item.
   */
  const goNext = Symbol("goNext");

  /**
   * Symbol for the `goPrevious` method.
   *
   * This method is invoked when the user wants to go/navigate to the previous item.
   */
  const goPrevious = Symbol("goPrevious");

  /**
   * Symbol for the `goRight` method.
   *
   * This method is invoked when the user wants to go/navigate right. Mixins
   * that make use of this method include
   * [KeyboardDirectionMixin](KeyboardDirectionMixin) and
   * [SwipeDirectionMixin](SwipeDirectionMixin).
   */
  const goRight = Symbol("goRight");

  /**
   * Symbol for the `goStart` method.
   *
   * This method is invoked when the user wants to go/navigate to the start
   * (e.g., of a list).
   */
  const goStart = Symbol("goStart");

  /**
   * Symbol for the `goUp` method.
   *
   * This method is invoked when the user wants to go/navigate up.
   */
  const goUp = Symbol("goUp");

  /**
   * Symbol for the `hasDynamicTemplate` property.
   *
   * If your component class does not always use the same template, define a
   * static class property getter with this symbol and have it return `true`.
   * This will disable template caching for your component.
   */
  const hasDynamicTemplate$1 = hasDynamicTemplate;

  /**
   * Symbol for the `ids` property.
   *
   * [ShadowTemplateMixin](ShadowTemplateMixin) defines a shorthand function
   * `internal.ids` that can be used to obtain a reference to a shadow element with
   * a given ID.
   *
   * Example: if component's template contains a shadow element
   * `<button id="foo">`, you can use the reference `this[internal.ids].foo` to obtain
   * the corresponding button in the component instance's shadow tree.
   * The `ids` function is simply a shorthand for `getElementById`, so
   * `this[internal.ids].foo` is the same as `this.shadowRoot.getElementById('foo')`.
   */
  const ids$1 = ids;

  /**
   * Symbol for the `itemMatchesState` method.
   *
   * `ContentItemsMixin` uses this callback to determine whether a content node
   * should be included in the `items` collection in the given state. By default,
   * substantive, visible elements are considered items; other nodes (including
   * text nodes, comment nodes, processing instructions) and invisible elements
   * (including `script` and `style` tags) are not considered to be items.
   *
   * Various mixins and components override this to refine the idea of what
   * counts as an item. E.g., [Menu](Menu) overrides this to exclude disabled
   * menu items, using code similar to this:
   *
   *     // Filter the set of items to ignore disabled items.
   *     [internal.itemMatchesState](item, state) {
   *       const base = super[internal.itemMatchesState] ?
   *         super[internal.itemMatchesState](item, state) :
   *         true;
   *       return base && !item.disabled;
   *     }
   *
   */
  const itemMatchesState = Symbol("itemMatchesState");

  /**
   * Symbol for the `itemsDelegate` property.
   *
   * A component using [DelegateItemsMixin](DelegateItemsMixin) uses this property
   * to indicate which one of its shadow elements is the one whose `items`
   * property will be treated as the component's own `items`.
   */
  const itemsDelegate = Symbol("itemsDelegate");

  /**
   * Symbol for the `keydown` method.
   *
   * This method is invoked when an element receives a `keydown` event.
   *
   * An implementation of `internal.keydown` should return `true` if it handled
   * the event, and `false` otherwise. If `true` is returned (the event was
   * handled), `KeyboardMixin` invokes the event's `preventDefault` and
   * `stopPropagation` methods to let the browser know the event was handled.
   *
   * The convention for handling `internal.keydown` is that the last mixin
   * applied wins. That is, if an implementation of `internal.keydown` *did*
   * handle the event, it can return immediately. If it did not, it should
   * invoke `super` to let implementations further up the prototype chain have
   * their chance.
   *
   * This method takes a `KeyboardEvent` parameter that contains the event being
   * processed.
   */
  const keydown = Symbol("keydown");

  /**
   * Symbol for the `mouseenter` method.
   *
   * [HoverMixin](HoverMixin) invokes this method when the user moves the
   * mouse over a component. That mixin provides a base implementation of this
   * method, but you can extend it to do additional work on `mouseenter`.
   *
   * This method takes a `MouseEvent` parameter that contains the event being
   * processed.
   */
  const mouseenter = Symbol("mouseenter");

  /**
   * Symbol for the `mouseleave` method.
   *
   * [HoverMixin](HoverMixin) invokes this method when the user moves off a
   * component. That mixin provides a base implementation of this method, but
   * you can extend it to do additional work on `mouseleave`.
   *
   * This method takes a `MouseEvent` parameter that contains the event being
   * processed.
   */
  const mouseleave = Symbol("mouseleave");

  /**
   * Symbol for access to native HTML element internals.
   */
  const nativeInternals$1 = nativeInternals;

  /**
   * Symbol for the `raiseChangeEvents` property.
   *
   * This property is used by mixins to determine whether they should raise
   * property change events. The standard HTML pattern is to only raise such
   * events in response to direct user interactions. For a detailed discussion
   * of this point, see the Gold Standard checklist item for
   * [Propery Change Events](https://github.com/webcomponents/gold-standard/wiki/Property%20Change%20Events).
   *
   * The above article describes a pattern for using a flag to track whether
   * work is being performed in response to internal component activity, and
   * whether the component should therefore raise property change events.
   * This `raiseChangeEvents` symbol is a shared flag used for that purpose by
   * all Elix mixins and components. Sharing this flag ensures that internal
   * activity (e.g., a UI event listener) in one mixin can signal other mixins
   * handling affected properties to raise change events.
   *
   * All UI event listeners (and other forms of internal handlers, such as
   * timeouts and async network handlers) should set `raiseChangeEvents` to
   * `true` at the start of the event handler, then `false` at the end:
   *
   *     this.addEventListener('click', event => {
   *       this[internal.raiseChangeEvents] = true;
   *       // Do work here, possibly setting properties, like:
   *       this.foo = 'Hello';
   *       this[internal.raiseChangeEvents] = false;
   *     });
   *
   * Elsewhere, property setters that raise change events should only do so it
   * this property is `true`:
   *
   *     set foo(value) {
   *       // Save foo value here, do any other work.
   *       if (this[internal.raiseChangeEvents]) {
   *         export const event = new CustomEvent('foo-changed');
   *         this.dispatchEvent(event);
   *       }
   *     }
   *
   * In this way, programmatic attempts to set the `foo` property will not
   * trigger the `foo-changed` event, but UI interactions that update that
   * property will cause those events to be raised.
   */
  const raiseChangeEvents$1 = raiseChangeEvents;

  /**
   * Symbol for the `render` method.
   *
   * [ReactiveMixin](ReactiveMixin) invokes this `internal.render` method to give
   * the component a chance to render recent changes in component state.
   */
  const render$1 = render;

  /**
   * Symbol for the `renderChanges` method.
   *
   * [ReactiveMixin](ReactiveMixin) invokes this method in response to a
   * `setState` call; you should generally not invoke this method yourself.
   */
  const renderChanges$1 = renderChanges;

  /**
   * Symbol for the `rendered` method.
   *
   * [ReactiveMixin](ReactiveMixin) will invoke this method after your
   * element has completely finished rendering.
   */
  const rendered$1 = rendered;

  /**
   * Symbol for the `rendering` property.
   *
   * [ReactiveMixin](ReactiveMixin) sets this property to true during rendering,
   * at other times it will be false.
   */
  const rendering$1 = rendering;

  /**
   * Symbol for the `scrollTarget` property.
   *
   * This property indicates which element in a component's shadow subtree
   * should be scrolled. [SelectionInViewMixin](SelectionInViewMixin) can use
   * this property to determine which element should be scrolled to keep the
   * selected item in view.
   */
  const scrollTarget = Symbol("scrollTarget");

  /**
   * Symbol for the `setState` method.
   *
   * A component using [ReactiveMixin](ReactiveMixin) can invoke this method to
   * apply changes to the element's current state.
   */
  const setState$1 = setState;

  /**
   * Symbol for the `shadowRoot` property.
   *
   * This property holds a reference to an element's shadow root, like
   * `this.shadowRoot`. This propery exists because `this.shadowRoot` is not
   * available for components with closed shadow roots.
   * [ShadowTemplateMixin](ShadowTemplateMixin) creates open shadow roots by
   * default, but you can opt into creating closed shadow roots; see
   * [shadowRootMode](internal#internal.shadowRootMode).
   */
  const shadowRoot$1 = shadowRoot;

  /**
   * Symbol for the `shadowRootMode` property.
   *
   * If true (the default), then [ShadowTemplateMixin](ShadowTemplateMixin) will
   * create an open shadow root when the component is instantiated. Set this to
   * false if you want to programmatically hide component internals in a closed
   * shadow root.
   */
  const shadowRootMode$1 = shadowRootMode;

  /**
   * Symbol for the `startEffect` method.
   *
   * A component using [TransitionEffectMixin](TransitionEffectMixin) can invoke
   * this method to trigger the application of a named, asynchronous CSS
   * transition effect.
   *
   * This method takes a single `string` parameter giving the name of the effect
   * to start.
   */
  const startEffect = Symbol("startEffect");

  /**
   * The element's current state.
   *
   * This is managed by [ReactiveMixin](ReactiveMixin).
   */
  const state$1 = state;

  const stateEffects$1 = stateEffects;

  /**
   * Symbol for the `swipeDown` method.
   *
   * The swipe mixin [TouchSwipeMixin](TouchSwipeMixin) invokes this method when
   * the user finishes a gesture to swipe down.
   */
  const swipeDown = Symbol("swipeDown");

  /**
   * Symbol for the `swipeDownComplete` method.
   *
   * [SwipeCommandsMixin](SwipeCommandsMixin) invokes this method after any
   * animated transition associated with a swipe down has completed.
   */
  const swipeDownComplete = Symbol("swipeDownComplete");

  /**
   * Symbol for the `swipeLeft` method.
   *
   * The swipe mixins [TouchSwipeMixin](TouchSwipeMixin) and
   * [TrackpadSwipeMixin](TrackpadSwipeMixin) invoke this method when the user
   * finishes a gesture to swipe left.
   */
  const swipeLeft = Symbol("swipeLeft");

  /**
   * Symbol for the `swipeLeftTransitionEnd` method.
   *
   * [SwipeCommandsMixin](SwipeCommandsMixin) invokes this method after any
   * animated transition associated with a swipe left has completed.
   */
  const swipeLeftTransitionEnd = Symbol("swipeLeftTransitionEnd");

  /**
   * Symbol for the `swipeRight` method.
   *
   * The swipe mixins [TouchSwipeMixin](TouchSwipeMixin) and
   * [TrackpadSwipeMixin](TrackpadSwipeMixin) invoke this method when the user
   * finishes a gesture to swipe right.
   */
  const swipeRight = Symbol("swipeRight");

  /**
   * Symbol for the `swipeRightTransitionEnd` method.
   *
   * [SwipeCommandsMixin](SwipeCommandsMixin) invokes this method after any
   * animated transition associated with a swipe right has completed.
   */
  const swipeRightTransitionEnd = Symbol("swipeRightTransitionEnd");

  /**
   * Symbol for the `swipeUp` method.
   *
   * The swipe mixin [TouchSwipeMixin](TouchSwipeMixin) invokes this method when
   * the user finishes a gesture to swipe up.
   */
  const swipeUp = Symbol("swipeUp");

  /**
   * Symbol for the `swipeUpComplete` method.
   *
   * [SwipeCommandsMixin](SwipeCommandsMixin) invokes this method after any
   * animated transition associated with a swipe up has completed.
   */
  const swipeUpComplete = Symbol("swipeUpComplete");

  /**
   * Symbol for the `swipeStart` method.
   *
   * [TouchSwipeMixin](TouchSwipeMixin) and
   * [TrackpadSwipeMixin](TrackpadSwipeMixin) invoke this method when a swipe
   * is starting, passing in the starting (x, y) client coordinate.
   */
  const swipeStart = Symbol("swipeStart");

  /**
   * Symbol for the `swipeTarget` property.
   *
   * By default, the swipe mixins [TouchSwipeMixin](TouchSwipeMixin) and
   * [TrackpadSwipeMixin](TrackpadSwipeMixin) assume that the element the user
   * is swiping the top-level element. In some cases (e.g., [Drawer](Drawer)),
   * the component wants to let the user swipe a shadow element. In such cases,
   * this property should return the element that should be swiped.
   *
   * The swipe target's `offsetWidth` is used by the mixin to calculate the
   * `state.swipeFraction` member when the user drags their finger. The
   * `swipeFraction` is the distance the user has dragged in the current drag
   * operation over that `offsetWidth`.
   */
  const swipeTarget = Symbol("swipeTarget");

  /**
   * Symbol for the `tap` method.
   *
   * This method is invoked when an element receives an operation that should
   * be interpreted as a tap. [TapSelectionMixin](TapSelectionMixin)
   * invokes this when the element receives a `mousedown` event, for example.
   */
  const tap = Symbol("tap");

  /**
   * Symbol for the `template` method.
   *
   * [ShadowTemplateMixin](ShadowTemplateMixin) uses this property to obtain a
   * component's template, which it will clone into a component's shadow root.
   */
  const template$1 = template;

  // Expose internals as a global when debugging.
  const elixdebug = new URLSearchParams(location.search).get("elixdebug");
  if (elixdebug === "true") {
    /** @type {any} */ (window).elix = {
      internal: {
        checkSize,
        componentDidMount: componentDidMount$1,
        componentDidUpdate: componentDidUpdate$1,
        contentSlot,
        defaultState: defaultState$1,
        defaultTabIndex,
        delegatesFocus: delegatesFocus$1,
        effectEndTarget,
        event,
        focusTarget: focusTarget$1,
        getItemText,
        goDown,
        goEnd,
        goLeft,
        goNext,
        goPrevious,
        goRight,
        goStart,
        goUp,
        hasDynamicTemplate: hasDynamicTemplate$1,
        ids: ids$1,
        itemMatchesState,
        itemsDelegate,
        keydown,
        mouseenter,
        mouseleave,
        nativeInternals: nativeInternals$1,
        raiseChangeEvents: raiseChangeEvents$1,
        render: render$1,
        renderChanges: renderChanges$1,
        rendering: rendering$1,
        scrollTarget,
        setState: setState$1,
        shadowRoot: shadowRoot$1,
        shadowRootMode: shadowRootMode$1,
        startEffect,
        state: state$1,
        swipeDown,
        swipeDownComplete,
        swipeLeft,
        swipeLeftTransitionEnd,
        swipeRight,
        swipeRightTransitionEnd,
        swipeStart,
        swipeTarget,
        swipeUp,
        swipeUpComplete,
        tap,
        template: template$1
      }
    };
  }

  /**
   * Miscellaneous DOM helpers for web components
   *
   * @module dom
   */

  /** @type {IndexedObject<boolean>} */
  const standardBooleanAttributes = {
    checked: true,
    defer: true,
    disabled: true,
    hidden: true,
    ismap: true,
    multiple: true,
    noresize: true,
    readonly: true,
    selected: true
  };

  /**
   * Given a string value for a named boolean attribute, return `true` if the
   * value is either: a) the empty string, or b) a case-insensitive match for the
   * name.
   *
   * This is native HTML behavior; see the MDN documentation on [boolean
   * attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes#Boolean_Attributes)
   * for the reasoning.
   *
   * Given a null value, this return `false`.
   * Given a boolean value, this return the value as is.
   *
   * @param {string} name
   * @param {string|boolean|null} value
   */
  function booleanAttributeValue(name, value) {
    return typeof value === "boolean"
      ? value
      : typeof value === "string"
      ? value === "" || name.toLowerCase() === value.toLowerCase()
      : false;
  }

  /**
   * Return the closest focusable node that's either the node itself (if it's
   * focusable), or the closest focusable ancestor in the *composed* tree.
   *
   * If no focusable node is found, this returns null.
   *
   * @param {Node} node
   * @returns {HTMLElement|null}
   */
  function closestFocusableNode(node) {
    for (const current of selfAndComposedAncestors(node)) {
      // If the current element defines a focusTarget (e.g., via
      // DelegateFocusMixin), use that, otherwise use the element itself.
      const focusTarget$1 = current[focusTarget] || current;
      // We want an element that has a tabIndex of 0 or more. We ignore disabled
      // elements, and slot elements (which oddly have a tabIndex of 0).
      /** @type {any} */ const cast = focusTarget$1;
      const focusable =
        focusTarget$1 instanceof HTMLElement &&
        focusTarget$1.tabIndex >= 0 &&
        !cast.disabled &&
        !(focusTarget$1 instanceof HTMLSlotElement);
      if (focusable) {
        return focusTarget$1;
      }
    }
    return null;
  }

  /**
   * Return the ancestors of the given node in the composed tree.
   *
   * In the composed tree, the ancestor of a node assigned to a slot is that slot,
   * not the node's DOM ancestor. The ancestor of a shadow root is its host.
   *
   * @param {Node} node
   * @returns {Iterable<Node>}
   */
  function* composedAncestors(node) {
    /** @type {Node|null} */
    let current = node;
    while (true) {
      current =
        current instanceof HTMLElement && current.assignedSlot
          ? current.assignedSlot
          : current instanceof ShadowRoot
          ? current.host
          : current.parentNode;
      if (current) {
        yield current;
      } else {
        break;
      }
    }
  }

  /**
   * Returns true if the first node contains the second, even if the second node
   * is in a shadow tree.
   *
   * The standard Node.contains() function does not account for Shadow DOM, and
   * returns false if the supplied target node is sitting inside a shadow tree
   * within the container.
   *
   * @param {Node} container - The container to search within.
   * @param {Node} target - The node that may be inside the container.
   * @returns {boolean} - True if the container contains the target node.
   */
  function deepContains(container, target) {
    /** @type {any} */
    let current = target;
    while (current) {
      const parent = current.assignedSlot || current.parentNode || current.host;
      if (parent === container) {
        return true;
      }
      current = parent;
    }
    return false;
  }

  /**
   * Return the first focusable element in the composed tree below the given root.
   * The composed tree includes nodes assigned to slots.
   *
   * This heuristic considers only the document order of the elements below the
   * root and whether a given element is focusable. It currently does not respect
   * the tab sort order defined by tabindex values greater than zero.
   *
   * @param {Node} root - the root of the tree in which to search
   * @returns {HTMLElement|null} - the first focusable element, or null if none
   * was found
   */
  function firstFocusableElement(root) {
    // CSS selectors for focusable elements from
    // https://stackoverflow.com/a/30753870/76472
    const focusableQuery =
      'a[href],area[href],button:not([disabled]),details,iframe,input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[contentEditable="true"],[tabindex]';
    // Walk the tree looking for nodes that match the above selectors.
    const walker = walkComposedTree(
      root,
      (/** @type {Node} */ node) =>
        node instanceof HTMLElement &&
        node.matches(focusableQuery) &&
        node.tabIndex >= 0
    );
    // We only actually need the first matching value.
    const { value } = walker.next();
    // value, if defined, will always be an HTMLElement, but we do the following
    // check to pass static type checking.
    return value instanceof HTMLElement ? value : null;
  }

  /**
   * Search a list element for the item that contains the specified target.
   *
   * When dealing with UI events (e.g., mouse clicks) that may occur in
   * subelements inside a list item, you can use this routine to obtain the
   * containing list item.
   *
   * @param {NodeList|Node[]} items - A list element containing a set of items
   * @param {Node} target - A target element that may or may not be an item in the
   * list.
   * @returns {number} - The index of the list child that is or contains the
   * indicated target node. Returns -1 if not found.
   */
  function indexOfItemContainingTarget(items, target) {
    return Array.prototype.findIndex.call(
      items,
      (/** @type Node */ item) => item === target || deepContains(item, target)
    );
  }

  /**
   * Return true if the event came from within the node (or from the node itself);
   * false otherwise.
   *
   * @param {Node} node - The node to consider in relation to the event
   * @param {Event} event - The event which may have been raised within/by the
   * node
   * @returns {boolean} - True if the event was raised within or by the node
   */
  function ownEvent(node, event) {
    /** @type {any} */
    const cast = event;
    const eventSource = cast.composedPath()[0];
    return node === eventSource || deepContains(node, eventSource);
  }

  /**
   * Adds or removes the element's `childNodes` as necessary to match the nodes
   * indicated in the `childNodes` parameter.
   *
   * This operation is useful in cases where you maintain your own set of nodes
   * which should be rendered as the children of some element. When you insert or
   * remove nodes in that set, you can invoke this function to efficiently apply
   * the new set as a delta to the existing children. Only the items in the set
   * that have actually changed will be added or removed.
   *
   * @param {Node} element - the element to update
   * @param {(NodeList|Node[])} childNodes - the set of nodes to apply
   */
  function updateChildNodes(element, childNodes) {
    // If the childNodes parameter is the actual childNodes of an element, then as
    // we append those nodes to the indicated target element, they'll get removed
    // from the original set. To keep the list stable, we make a copy.
    const copy = [...childNodes];

    const oldLength = element.childNodes.length;
    const newLength = copy.length;
    const length = Math.max(oldLength, newLength);
    for (let i = 0; i < length; i++) {
      const oldChild = element.childNodes[i];
      const newChild = copy[i];
      if (i >= oldLength) {
        // Add new item not in old set.
        element.appendChild(newChild);
      } else if (i >= newLength) {
        // Remove old item past end of new set.
        element.removeChild(element.childNodes[newLength]);
      } else if (oldChild !== newChild) {
        if (copy.indexOf(oldChild, i) >= i) {
          // Old node comes later in final set. Insert the new node rather than
          // replacing it so that we don't detach the old node only to have to
          // reattach it later.
          element.insertBefore(newChild, oldChild);
        } else {
          // Replace old item with new item.
          element.replaceChild(newChild, oldChild);
        }
      }
    }
  }

  /**
   * Returns the set that includes the given node and all of its ancestors in the
   * composed tree. See [composedAncestors](#composedAncestors) for details on the
   * latter.
   *
   * @param {Node} node
   * @returns {Iterable<Node>}
   */
  function* selfAndComposedAncestors(node) {
    if (node) {
      yield node;
      yield* composedAncestors(node);
    }
  }

  /**
   * Set an internal state for browsers that support the `:state` selector, as
   * well as an attribute of the same name to permit state-based styling on older
   * browsers.
   *
   * When all browsers support that, we'd like to deprecate use of attributes.
   *
   * @param {Element} element
   * @param {string} name
   * @param {boolean} value
   */
  function setInternalState(element, name, value) {
    element.toggleAttribute(name, value);
    if (
      element[nativeInternals] &&
      element[nativeInternals].states
    ) {
      element[nativeInternals].states.toggle(name, value);
    }
  }

  /**
   * Walk the composed tree at the root for elements that pass the given filter.
   *
   * Note: the jsDoc types required for the filter function are too complex for
   * the current jsDoc parser to support strong type-checking.
   *
   * @private
   * @param {Node} node
   * @param {function} filter
   * @returns {IterableIterator<Node>}
   */
  function* walkComposedTree(node, filter) {
    if (filter(node)) {
      yield node;
    }
    let children;
    if (node instanceof HTMLElement && node.shadowRoot) {
      // Walk the shadow instead of the light DOM.
      children = node.shadowRoot.children;
    } else {
      const assignedNodes =
        node instanceof HTMLSlotElement
          ? node.assignedNodes({ flatten: true })
          : [];
      children =
        assignedNodes.length > 0
          ? // Walk light DOM nodes assigned to this slot.
            assignedNodes
          : // Walk light DOM children.
            node.childNodes;
    }
    if (children) {
      for (let i = 0; i < children.length; i++) {
        yield* walkComposedTree(children[i], filter);
      }
    }
  }

  // Memoized maps of attribute to property names and vice versa.
  // We initialize this with the special case of the tabindex (lowercase "i")
  // attribute, which is mapped to the tabIndex (capital "I") property.
  /** @type {IndexedObject<string>} */
  const attributeToPropertyNames = {
    tabindex: "tabIndex"
  };
  /** @type {IndexedObject<string>} */
  const propertyNamesToAttributes = {
    tabIndex: "tabindex"
  };

  /**
   * Sets properties when corresponding attributes change.
   *
   * If your component exposes a setter for a property, it's generally a good
   * idea to let devs using your component be able to set that property in HTML
   * via an element attribute. You can code that yourself by writing an
   * `attributeChangedCallback`, or you can use this mixin to get a degree of
   * automatic support.
   *
   * This mixin implements an `attributeChangedCallback` that will attempt to
   * convert a change in an element attribute into a call to the corresponding
   * property setter. Attributes typically follow hyphenated names ("foo-bar"),
   * whereas properties typically use camelCase names ("fooBar"). This mixin
   * respects that convention, automatically mapping the hyphenated attribute
   * name to the corresponding camelCase property name.
   *
   * Example: You define a component using this mixin:
   *
   *     class MyElement extends AttributeMarshallingMixin(HTMLElement) {
   *       get fooBar() { return this._fooBar; }
   *       set fooBar(value) { this._fooBar = value; }
   *     }
   *
   * If someone then instantiates your component in HTML:
   *
   *     <my-element foo-bar="Hello"></my-element>
   *
   * Then, after the element has been upgraded, the `fooBar` setter will
   * automatically be invoked with the initial value "Hello".
   *
   * Attributes can only have string values. If you'd like to convert string
   * attributes to other types (numbers, booleans), you must implement parsing
   * yourself.
   *
   * @module AttributeMarshallingMixin
   * @param {Constructor<CustomElement>} Base
   */
  function AttributeMarshallingMixin(Base) {
    // The class prototype added by the mixin.
    class AttributeMarshalling extends Base {
      /**
       * Handle a change to the attribute with the given name.
       *
       * @ignore
       * @param {string} attributeName
       * @param {string} oldValue
       * @param {string} newValue
       */
      attributeChangedCallback(attributeName, oldValue, newValue) {
        if (super.attributeChangedCallback) {
          super.attributeChangedCallback(attributeName, oldValue, newValue);
        }
        // Sometimes there's not actually any change.
        // We also skip setting properties if we're rendering. A component
        // may want to reflect property values to attributes during rendering,
        // but such attribute changes shouldn't trigger property updates.
        if (newValue !== oldValue && !this[rendering]) {
          const propertyName = attributeToPropertyName(attributeName);
          // If the attribute name corresponds to a property name, set the property.
          if (propertyName in this) {
            this[propertyName] = castPotentialBooleanAttribute(
              attributeName,
              newValue
            );
          }
        }
      }

      // Because maintaining the mapping of attributes to properties is tedious,
      // this provides a default implementation for `observedAttributes` that
      // assumes that your component will want to expose all public properties in
      // your component's API as properties.
      //
      // You can override this default implementation of `observedAttributes`. For
      // example, if you have a system that can statically analyze which
      // properties are available to your component, you could hand-author or
      // programmatically generate a definition for `observedAttributes` that
      // avoids the minor run-time performance cost of determining your
      // component's public properties.
      static get observedAttributes() {
        return attributesForClass(this);
      }
    }

    return AttributeMarshalling;
  }

  /**
   * Return the custom attributes for the given class.
   *
   * @private
   * @param {Constructor<HTMLElement>} classFn
   * @returns {string[]}
   */
  function attributesForClass(classFn) {
    // We treat the HTMLElement base class as if it has no attributes, since we
    // don't want to receive attributeChangedCallback for it.
    if (classFn === HTMLElement) {
      return [];
    }

    // Get attributes for parent class.
    const baseClass = Object.getPrototypeOf(classFn.prototype).constructor;
    // See if parent class defines observedAttributes manually.
    let baseAttributes = baseClass.observedAttributes;
    if (!baseAttributes) {
      // Calculate parent class attributes ourselves.
      baseAttributes = attributesForClass(baseClass);
    }

    // Get attributes for this class.
    const propertyNames = Object.getOwnPropertyNames(classFn.prototype);
    const setterNames = propertyNames.filter(propertyName => {
      const descriptor = Object.getOwnPropertyDescriptor(
        classFn.prototype,
        propertyName
      );
      return descriptor && typeof descriptor.set === "function";
    });
    const attributes = setterNames.map(setterName =>
      propertyNameToAttribute(setterName)
    );

    // Merge.
    const diff = attributes.filter(
      attribute => baseAttributes.indexOf(attribute) < 0
    );
    const result = baseAttributes.concat(diff);

    return result;
  }

  /**
   * Convert hyphenated foo-bar attribute name to camel case fooBar property name.
   *
   * @private
   * @param {string} attributeName
   */
  function attributeToPropertyName(attributeName) {
    let propertyName = attributeToPropertyNames[attributeName];
    if (!propertyName) {
      // Convert and memoize.
      const hyphenRegEx = /-([a-z])/g;
      propertyName = attributeName.replace(hyphenRegEx, match =>
        match[1].toUpperCase()
      );
      attributeToPropertyNames[attributeName] = propertyName;
    }
    return propertyName;
  }

  /**
   * If the given attribute name corresponds to a standard boolean attribute, map
   * the supplied string value to a boolean. Otherwise return as is.
   *
   * @private
   * @param {string} name
   * @param {string} value
   */
  function castPotentialBooleanAttribute(name, value) {
    return standardBooleanAttributes[name]
      ? booleanAttributeValue(name, value)
      : value;
  }

  /**
   * Convert a camel case fooBar property name to a hyphenated foo-bar attribute.
   *
   * @private
   * @param {string} propertyName
   */
  function propertyNameToAttribute(propertyName) {
    let attribute = propertyNamesToAttributes[propertyName];
    if (!attribute) {
      // Convert and memoize.
      const uppercaseRegEx = /([A-Z])/g;
      attribute = propertyName.replace(uppercaseRegEx, "-$1").toLowerCase();
      propertyNamesToAttributes[propertyName] = attribute;
    }
    return attribute;
  }

  /** @type {any} */
  const stateKey = Symbol("state");
  /** @type {any} */
  const raiseChangeEventsInNextRenderKey = Symbol(
    "raiseChangeEventsInNextRender"
  );
  // Tracks total set of changes made to elements since their last render.
  /** @type {any} */
  const changedSinceLastRenderKey = Symbol("changedSinceLastRender");

  /**
   * Manages component state and renders changes in state
   *
   * This is modeled after React/Preact's state management, and is adapted for
   * use with web components. Applying this mixin to a component will give it
   * FRP behavior comparable to React's.
   *
   * @module ReactiveMixin
   * @param {Constructor<CustomElement>} Base
   */
  function ReactiveMixin(Base) {
    class Reactive extends Base {
      constructor() {
        super();
        this[firstRender] = undefined;
        this[changedSinceLastRenderKey] = {};
        // Set the initial state from the default state defined by the component
        // and its mixins.
        this[setState](this[defaultState]);
      }

      [componentDidMount]() {
        if (super[componentDidMount]) {
          super[componentDidMount]();
        }
        if (
          super[componentDidMount] ||
          this[componentDidMount] !==
            Reactive.prototype[componentDidMount]
        ) {
          /* eslint-disable no-console */
          console.warn(
            "Deprecation warning: componentDidMount is being replaced with the internal.rendered method and the internal.firstRender flag. See https://elix.org/documentation/ReactiveMixin#lifecycle-methods."
          );
        }
      }

      [componentDidUpdate](changed) {
        if (super[componentDidUpdate]) {
          super[componentDidUpdate](changed);
        }
        if (
          super[componentDidUpdate] ||
          this[componentDidUpdate] !==
            Reactive.prototype[componentDidUpdate]
        ) {
          /* eslint-disable no-console */
          console.warn(
            "Deprecation warning: componentDidUpdate is being replaced with the internal.rendered method and the internal.firstRender flag. See https://elix.org/documentation/ReactiveMixin#lifecycle-methods."
          );
        }
      }

      connectedCallback() {
        if (super.connectedCallback) {
          super.connectedCallback();
        }
        // Render the component. If the component was forced to render before this
        // point, and the state hasn't changed, this call will be a no-op.
        this[renderChanges]();
      }

      /**
       * The default state for the component. This can be extended by mixins and
       * classes to provide additional default state.
       *
       * @type {PlainObject}
       */
      get [defaultState]() {
        // Defer to base implementation if defined.
        return super[defaultState] || {};
      }

      /**
       * Render the indicated changes in state to the DOM.
       *
       * The default implementation of this method does nothing. Override this
       * method in your component to update your component's host element and
       * any shadow elements to reflect the component's new state. See the
       * [rendering example](ReactiveMixin#rendering).
       *
       * Be sure to call `super` in your method implementation so that your
       * component's base classes and mixins have a chance to perform their own
       * render work.
       *
       * @param {ChangedFlags} changed - dictionary of flags indicating which state
       * members have changed since the last render
       */
      [render](/** @type {ChangedFlags} */ changed) {
        if (super[render]) {
          super[render](changed);
        }
      }

      /**
       * Render any pending component changes to the DOM.
       *
       * This method does nothing if the state has not changed since the last
       * render call.
       *
       * ReactiveMixin will invoke this method following a `setState` call;
       * you should not need to invoke this method yourself.
       *
       * This method invokes the internal `render` method, then invokes the
       * `rendered` method.
       */
      [renderChanges]() {
        // Determine what's changed since the last render.
        const changed = this[changedSinceLastRenderKey];

        if (typeof this[firstRender] === "undefined") {
          // First render.
          this[firstRender] = true;
        }

        // We only render if the component's never been rendered before, or is
        // something's actually changed since the last render. Consecutive
        // synchronous[internal.setState] calls will queue up corresponding async render
        // calls. By the time the first render call actually happens, the complete
        // state is available, and that is what is rendered. When the following
        // render calls happen, they will see that the complete state has already
        // been rendered, and skip doing any work.
        if (this[firstRender] || Object.keys(changed).length > 0) {
          // If at least one of the[internal.setState] calls was made in response to user
          // interaction or some other component-internal event, set the
          // raiseChangeEvents flag so that componentDidMount/componentDidUpdate
          // know whether to raise property change events.
          const saveRaiseChangeEvents = this[raiseChangeEvents];
          this[raiseChangeEvents] = this[
            raiseChangeEventsInNextRenderKey
          ];

          // We set a flag to indicate that rendering is happening. The component
          // may use this to avoid triggering other updates during the render.
          this[rendering] = true;

          // Invoke any internal render implementations.
          this[render](/** @type {ChangedFlags} */ changed);

          this[rendering] = false;

          // Since we've now rendered all changes, clear the change log. If other
          // async render calls are queued up behind this call, they'll see an
          // empty change log, and so skip unnecessary render work.
          this[changedSinceLastRenderKey] = {};

          // Let the component know it was rendered.
          this[rendered](changed);

          // DEPRECATED: First time is consider mounting; subsequent times are updates.
          if (this[firstRender]) {
            if (this[componentDidMount]) {
              this[componentDidMount]();
            }
          } else {
            if (this[componentDidUpdate]) {
              this[componentDidUpdate](changed);
            }
          }

          // We've now rendered for the first time.
          this[firstRender] = false;

          // Restore state of event flags.
          this[raiseChangeEvents] = saveRaiseChangeEvents;
          this[raiseChangeEventsInNextRenderKey] = saveRaiseChangeEvents;
        }
      }

      /**
       * Perform any work that must happen after state changes have been rendered
       * to the DOM.
       *
       * The default implementation of this method does nothing. Override this
       * method in your component to perform work that requires the component to
       * be fully rendered, such as setting focus on a shadow element or
       * inspecting the computed style of an element. If such work should result
       * in a change in component state, you can safely call `setState` during the
       * `rendered` method.
       *
       * Be sure to call `super` in your method implementation so that your
       * component's base classes and mixins have a chance to perform their own
       * post-render work.
       *
       * @param {ChangedFlags} changed
       */
      [rendered](/** @type {ChangedFlags} */ changed) {
        if (super[rendered]) {
          super[rendered](changed);
        }
      }

      /**
       * Update the component's state by merging the specified changes on
       * top of the existing state. If the component is connected to the document,
       * and the new state has changed, this returns a promise to asynchronously
       * render the component. Otherwise, this returns a resolved promise.
       *
       * @param {PlainObject} changes - the changes to apply to the element's state
       * @returns {Promise} - resolves when the new state has been rendered
       */
      async [setState](changes) {
        // There's no good reason to have a render method update state.
        if (this[rendering]) {
          /* eslint-disable no-console */
          console.warn(
            `${this.constructor.name} called [internal.setState] during rendering, which you should avoid.\nSee https://elix.org/documentation/ReactiveMixin.`
          );
        }

        const firstSetState = this[stateKey] === undefined;

        // Apply the changes to the component's state to produce a new state
        // and a dictionary of flags indicating which fields actually changed.
        const { state, changed } = copyStateWithChanges(this, changes);

        const renderWorthy = firstSetState || Object.keys(changed).length > 0;
        if (!renderWorthy) {
          // No need to update state.
          return;
        }

        // Freeze the new state so it's immutable. This prevents accidental
        // attempts to set state without going through [internal.setState].
        Object.freeze(state);

        // Set this as the component's new state.
        this[stateKey] = state;

        // Add this round of changed fields to the complete set that have
        // changed since the component was last rendered.
        Object.assign(this[changedSinceLastRenderKey], changed);

        if (!this.isConnected) {
          // Not in document, so no need to render.
          return;
        }

        // Remember whether we're supposed to raise property change events.
        if (this[raiseChangeEvents]) {
          this[raiseChangeEventsInNextRenderKey] = true;
        }

        // Yield with promise timing. This lets any *synchronous* setState calls
        // that happen after the current setState call complete first. Their
        // effects on the state will be batched up before the render call below
        // actually happens.
        await Promise.resolve();

        // Render the component.
        this[renderChanges]();
      }

      /**
       * The component's current state.
       *
       * The returned state object is immutable. To update it, invoke
       * `internal.setState`.
       *
       * It's extremely useful to be able to inspect component state while
       * debugging. If you append `?elixdebug=true` to a page's URL, then
       * ReactiveMixin will conditionally expose a public `state` property
       * that returns the component's state. You can then access the state
       * in your browser's debug console.
       *
       * @type {PlainObject}
       */
      get [state]() {
        return this[stateKey];
      }

      /**
       * Ask the component whether a state with a set of recently-changed fields
       * implies that additional second-order changes should be applied to that
       * state to make it consistent.
       *
       * This method is invoked during a call to `internal.setState` to give all
       * of a component's mixins and classes a chance to respond to changes in
       * state. If one mixin/class updates state that it controls, another
       * mixin/class may want to respond by updating some other state member that
       * *it* controls.
       *
       * This method should return a dictionary of changes that should be applied
       * to the state. If the dictionary object is not empty, the
       * `internal.setState` will apply the changes to the state, and invoke this
       * `stateEffects` method again to determine whether there are any
       * third-order effects that should be applied. This process repeats until
       * all mixins/classes report that they have no additional changes to make.
       *
       * See an example of how `ReactiveMixin` invokes the `stateEffects` to
       * [ensure state consistency](ReactiveMixin#ensuring-state-consistency).
       *
       * @param {PlainObject} state - a proposal for a new state
       * @param {ChangedFlags} changed - the set of fields changed in this
       * latest proposal for the new state
       * @returns {PlainObject}
       */
      [stateEffects](state, changed) {
        return super[stateEffects]
          ? super[stateEffects](state, changed)
          : {};
      }
    }

    // Expose state when debugging; see note for `[internal.state]` getter.
    const elixdebug = new URLSearchParams(location.search).get("elixdebug");
    if (elixdebug === "true") {
      Object.defineProperty(Reactive.prototype, "state", {
        get() {
          return this[state];
        }
      });
    }

    return Reactive;
  }

  /**
   * Create a copy of the component's state with the indicated changes applied.
   * Ask the component whether the new state implies any second-order effects. If
   * so, apply those and loop again until the state has stabilized. Return the new
   * state and a dictionary of flags indicating which fields were actually
   * changed.
   *
   * @private
   * @param {Element} element
   * @param {PlainObject} changes
   */
  function copyStateWithChanges(element, changes) {
    // Start with a copy of the current state.
    /** @type {PlainObject} */
    const state = Object.assign({}, element[stateKey]);
    /** @type {ChangedFlags} */
    const changed = {};
    // Take the supplied changes as the first round of effects.
    let effects = changes;
    // Loop until there are no effects to apply.
    /* eslint-disable no-constant-condition */
    while (true) {
      // See whether the effects actually changed anything in state.
      const changedByEffects = fieldsChanged(state, effects);
      if (Object.keys(changedByEffects).length === 0) {
        // No more effects to apply; we're done.
        break;
      }
      // Apply the effects.
      Object.assign(state, effects);
      Object.assign(changed, changedByEffects);
      // Ask the component if there are any second- (or third-, etc.) order
      // effects that should be applied.
      effects = element[stateEffects](state, changedByEffects);
    }
    return { state, changed };
  }

  /**
   * Return true if the two values are equal.
   *
   * @private
   * @param {any} value1
   * @param {any} value2
   * @returns {boolean}
   */
  function equal(value1, value2) {
    if (value1 instanceof Date && value2 instanceof Date) {
      return value1.getTime() === value2.getTime();
    }
    return value1 === value2;
  }

  /**
   * Return a dictionary of flags indicating which of the indicated changes to the
   * state are actually changes.
   *
   * @private
   * @param {PlainObject} state
   * @param {PlainObject} changes
   */
  function fieldsChanged(state, changes) {
    /** @type {ChangedFlags} */
    const changed = {};
    for (const field in changes) {
      if (!equal(changes[field], state[field])) {
        changed[field] = true;
      }
    }
    return changed;
  }

  // A cache of processed templates, indexed by element class.
  const classTemplateMap = new Map();

  // A Proxy that maps shadow element IDs to shadow elements.
  /** @type {any} */
  const shadowIdProxyKey = Symbol("shadowIdProxy");

  // Reference stored on the proxy target to get to the actual element.
  const proxyElementKey = Symbol("proxyElement");

  // A handler used for the shadow element ID proxy.
  const shadowIdProxyHandler = {
    get(target, property) {
      const element = target[proxyElementKey];
      const root = element[shadowRoot];
      return root && typeof property === "string"
        ? root.getElementById(property)
        : null;
    }
  };

  /**
   * Stamps a template into a component's Shadow DOM when instantiated
   *
   * To use this mixin, define a `template` method that returns a string or HTML
   * `<template>` element:
   *
   *     import * as template from 'elix/src/template.js';
   *
   *     class MyElement extends ShadowTemplateMixin(HTMLElement) {
   *       get [internal.template]() {
   *         return template.html`Hello, <em>world</em>.`;
   *       }
   *     }
   *
   * When your component class is instantiated, a shadow root will be created on
   * the instance, and the contents of the template will be cloned into the
   * shadow root. If your component does not define a `template` method, this
   * mixin has no effect.
   *
   * This adds a member on the component called `this[internal.ids]` that can be used to
   * reference shadow elements with IDs. E.g., if component's shadow contains an
   * element `<button id="foo">`, then this mixin will create a member
   * `this[internal.ids].foo` that points to that button.
   *
   * @module ShadowTemplateMixin
   * @param {Constructor<HTMLElement>} Base
   */
  function ShadowTemplateMixin(Base) {
    // The class prototype added by the mixin.
    class ShadowTemplate extends Base {
      /**
       * A convenient shortcut for looking up an element by ID in the component's
       * Shadow DOM subtree.
       *
       * Example: if component's template contains a shadow element `<button
       * id="foo">`, you can use the reference `this[internal.ids].foo` to obtain
       * the corresponding button in the component instance's shadow tree. The
       * `ids` property is simply a shorthand for `getElementById`, so
       * `this[internal.ids].foo` is the same as
       * `this[internal.shadowRoot].getElementById('foo')`.
       *
       * @type {object} - a dictionary mapping shadow element IDs to elements
       */
      get [ids]() {
        if (!this[shadowIdProxyKey]) {
          // Construct a proxy that maps to getElementById.
          const target = {
            // Give the proxy a means of refering this element via the target.
            [proxyElementKey]: this
          };
          this[shadowIdProxyKey] = new Proxy(target, shadowIdProxyHandler);
        }
        return this[shadowIdProxyKey];
      }

      /*
       * If the component defines a template, a shadow root will be created on the
       * component instance, and the template stamped into it.
       */
      [render](/** @type {ChangedFlags} */ changed) {
        if (super[render]) {
          super[render](changed);
        }
        if (this[shadowRoot]) {
          // Already rendered
          return;
        }

        // If this type of element defines a template, prepare it for use.
        const template = getTemplate(this);
        if (template) {
          // Stamp the template into a new shadow root.
          const delegatesFocus$1 = this[delegatesFocus];
          const root = this.attachShadow({
            delegatesFocus: delegatesFocus$1,
            mode: this[shadowRootMode]
          });
          const clone = document.importNode(template.content, true);
          root.append(clone);
          this[shadowRoot] = root;
        }
      }

      /**
       * @type {ShadowRootMode}
       */
      get [shadowRootMode]() {
        return "open";
      }
    }

    return ShadowTemplate;
  }

  /**
   * Return the template for the element being instantiated.
   *
   * If this is the first time we're creating this type of element, or the
   * component has indicated that its template is dynamic (and should be retrieved
   * each time), ask the component class for the template and cache the result.
   * Otherwise, immediately return the cached template.
   *
   * @private
   * @param {HTMLElement} element
   * @returns {HTMLTemplateElement}
   */
  function getTemplate(element) {
    const hasDynamicTemplate$1 = element[hasDynamicTemplate];
    let template$1 = hasDynamicTemplate$1
      ? undefined // Always retrieve template
      : classTemplateMap.get(element.constructor); // See if we've cached it
    if (template$1 === undefined) {
      // Ask the component for its template.
      template$1 = element[template];
      // A component using this mixin isn't required to supply a template --
      // if they don't, they simply won't end up with a shadow root.
      if (template$1) {
        // But if the component does supply a template, it needs to be an
        // HTMLTemplateElement instance.
        if (!(template$1 instanceof HTMLTemplateElement)) {
          throw `Warning: the [internal.template] property for ${element.constructor.name} must return an HTMLTemplateElement.`;
        }
        if (!hasDynamicTemplate$1) {
          // Store prepared template for next creation of same type of element.
          classTemplateMap.set(element.constructor, template$1);
        }
      }
    }
    return template$1;
  }

  /**
   * General-purpose base for writing components in functional-reactive style
   *
   * This base class lets you create web components in a functional-reactive
   * programming (FRP) style. It simply bundles a small set of mixins:
   *
   *     const ReactiveElement =
   *       AttributeMarshallingMixin(
   *       ReactiveMixin(
   *       ShadowTemplateMixin(
   *         HTMLElement
   *       )))));
   *
   * `ReactiveElement` is provided as a convenience. You can achieve the same
   * result by applying the mixins yourself to `HTMLElement`.
   *
   * @inherits HTMLElement
   * @mixes AttributeMarshallingMixin
   * @mixes ReactiveMixin
   * @mixes ShadowTemplateMixin
   */
  const ReactiveElement = AttributeMarshallingMixin(
    ReactiveMixin(ShadowTemplateMixin(HTMLElement))
  );

  /**
   * Lets a component define its ARIA role through a `role` state member
   *
   * Among other things, this allows a class or mixin to define a default
   * role through the component's `defaultState`.
   *
   * Some mixins come with identicial support for managing an ARIA role. Those
   * mixins include [AriaListMixin](AriaListMixin),
   * [AriaMenuMixin](AriaMenuMixin), [DialogModalityMixin](DialogModalityMixin),
   * and [PopupModalityMixin](PopupModalityMixin). If you're using one of those
   * mixins, you do *not* need to use this mixin.
   *
   * @module AriaRoleMixin
   * @param {Constructor<ReactiveElement>} Base
   */
  function AriaRoleMixin(Base) {
    // The class prototype added by the mixin.
    class AriaRole extends Base {
      [render$1](/** @type {ChangedFlags} */ changed) {
        if (super[render$1]) {
          super[render$1](changed);
        }
        if (changed.role) {
          // Apply top-level role.
          const { role } = this[state$1];
          this.setAttribute("role", role);
        }
      }

      // Setting the standard role attribute will invoke this property setter,
      // which will allow us to update our state.
      get role() {
        return super.role;
      }
      set role(role) {
        super.role = role;
        if (!this[rendering$1]) {
          this[setState$1]({ role });
        }
      }
    }

    return AriaRole;
  }

  // Quick detection of whether we'll need to handle focus.
  // As of February 2019, we don't need to handle this in Chrome, perhaps because
  // they already support delegatesFocus (which handles related focus issues).
  const focusTest = document.createElement("div");
  focusTest.attachShadow({ mode: "open", delegatesFocus: true });
  /** @type {any} */
  const shadowRoot$2 = focusTest.shadowRoot;
  const nativeDelegatesFocus = shadowRoot$2.delegatesFocus;

  /**
   * Normalizes focus treatment for custom elements with Shadow DOM
   *
   * This mixin exists because the default behavior for mousedown should set the
   * focus to the closest ancestor of the clicked element that can take the focus.
   * As of Nov 2018, Chrome and Safari don't handle this as expected when the
   * clicked element is reassigned across more than one slot to end up inside a
   * focusable element. In such cases, the focus will end up on the body. Firefox
   * exhibits the behavior we want. See
   * https://github.com/w3c/webcomponents/issues/773.
   *
   * This mixin normalizes behavior to provide what Firefox does. When the user
   * mouses down inside anywhere inside the component's light DOM or Shadow DOM,
   * we walk up the composed tree to find the first element that can take the
   * focus and put the focus on it.
   *
   * @module ComposedFocusMixin
   * @param {Constructor<ReactiveElement>} Base
   */
  function ComposedFocusMixin(Base) {
    // The class prototype added by the mixin.
    class ComposedFocus extends Base {
      get [defaultState$1]() {
        return Object.assign(super[defaultState$1], {
          composeFocus: !nativeDelegatesFocus
        });
      }

      [render$1](/** @type {ChangedFlags} */ changed) {
        if (super[render$1]) {
          super[render$1](changed);
        }
        if (this[firstRender$1]) {
          this.addEventListener("mousedown", event => {
            if (!this[state$1].composeFocus) {
              return;
            }
            // Only process events for the main (usually left) button.
            if (event.button !== 0) {
              return;
            }
            if (event.target instanceof Element) {
              const target = closestFocusableNode(event.target);
              if (target) {
                target.focus();
                event.preventDefault();
              }
            }
          });
        }
      }
    }

    return ComposedFocus;
  }

  // We consider the keyboard to be active if the window has received a keydown
  // event since the last mousedown event.
  let keyboardActive = false;

  /** @type {any} */
  const focusVisibleChangedListenerKey = Symbol("focusVisibleChangedListener");

  /**
   * Shows a focus indication if and only if the keyboard is active.
   *
   * The keyboard is considered to be active if a keyboard event has occurred
   * since the last mousedown event.
   *
   * This is loosely modeled after the proposed
   * [focus-visible](https://github.com/WICG/focus-visible) feature for CSS.
   *
   * @module FocusVisibleMixin
   * @param {Constructor<ReactiveElement>} Base
   */
  function FocusVisibleMixin(Base) {
    // The class prototype added by the mixin.
    return class FocusVisible extends Base {
      constructor() {
        // @ts-ignore
        super();

        // We listen to focusin/focusout instead of focus/blur because components
        // like Menu want to handle focus visiblity for the items they contain,
        // and those contained items can get the focus. Using focusin/focusout
        // lets us know whether this element *or any element it contains* has the
        // focus.
        //
        // Focus events are problematic in that they can occur during rendering:
        // if an element with the focus is updated so that its tabindex is
        // removed, it will lose focus. Since these focus handlers need to set
        // state, this could lead to setting state during rendering, which is bad.
        // To avoid this problem, we use promise timing to defer the setting of
        // state.
        this.addEventListener("focusout", event => {
          Promise.resolve().then(() => {
            // What has the focus now?
            /** @type {any} */ const cast = event;
            const newFocusedElement =
              cast.relatedTarget || document.activeElement;
            const isFocusedElement = this === newFocusedElement;
            const containsFocus = deepContains(this, newFocusedElement);
            const lostFocus = !isFocusedElement && !containsFocus;
            if (lostFocus) {
              this[setState$1]({
                focusVisible: false
              });
              // No longer need to listen for changes in focus visibility.
              document.removeEventListener(
                "focus-visible-changed",
                this[focusVisibleChangedListenerKey]
              );
              this[focusVisibleChangedListenerKey] = null;
            }
          });
        });
        this.addEventListener("focusin", () => {
          Promise.resolve().then(() => {
            if (this[state$1].focusVisible !== keyboardActive) {
              // Show the element as focused if the keyboard has been used.
              this[setState$1]({
                focusVisible: keyboardActive
              });
            }
            if (!this[focusVisibleChangedListenerKey]) {
              // Listen to subsequent changes in focus visibility.
              this[focusVisibleChangedListenerKey] = () => refreshFocus(this);
              document.addEventListener(
                "focus-visible-changed",
                this[focusVisibleChangedListenerKey]
              );
            }
          });
        });
      }

      get [defaultState$1]() {
        return Object.assign(super[defaultState$1], {
          focusVisible: false
        });
      }

      [render$1](/** @type {ChangedFlags} */ changed) {
        if (super[render$1]) {
          super[render$1](changed);
        }
        if (changed.focusVisible) {
          // Suppress the component's normal `outline` style unless we know the
          // focus should be visible.
          this.style.outline = this[state$1].focusVisible ? "" : "none";
        }
      }

      /**
       * Temporarily suppress visibility of the keyboard focus until the next
       * keydown event.
       *
       * This can be useful in components like [Menu](Menu) that actively manage
       * where the focus is in response to mouse hover activity. If the user uses
       * the keyboard to invoke a menu, then changes to using the mouse, it can be
       * distracting to see the focus indicator moving as well. In such
       * situations, the component can invoke this method (e.g., in response to
       * `mousemove`) to temporarily suppress focus visibility.
       */
      suppressFocusVisibility() {
        keyboardActive = false;
        refreshFocus(this);
      }
    };
  }

  function refreshFocus(/** @type {ReactiveElement} */ element) {
    element[setState$1]({
      focusVisible: keyboardActive
    });
  }

  function updateKeyboardActive(/** @type {boolean} */ newKeyboardActive) {
    if (keyboardActive !== newKeyboardActive) {
      keyboardActive = newKeyboardActive;
      const event = new CustomEvent("focus-visible-changed", {
        detail: {
          focusVisible: keyboardActive
        }
      });
      document.dispatchEvent(event);
    }
  }

  // Listen for top-level keydown and mousedown events.
  // Use capture phase so we detect events even if they're handled.
  window.addEventListener(
    "keydown",
    () => {
      updateKeyboardActive(true);
    },
    { capture: true }
  );

  window.addEventListener(
    "mousedown",
    () => {
      updateKeyboardActive(false);
    },
    { capture: true }
  );

  /**
   * A helper for creating a DocumentFragment in JavaScript.
   *
   * @module html
   */

  /**
   * A JavaScript template string literal that returns an HTML document fragment.
   *
   * Example:
   *
   *     const fragment = html`Hello, <em>world</em>.`
   *
   * returns a `DocumentFragment` whose `innerHTML` is `Hello, <em>world</em>.`
   *
   * This function is called `html` so that it can be easily used with HTML
   * syntax-highlighting extensions for various popular code editors.
   *
   * See also [template.html](template#html), which returns a similar result but
   * as an HTMLTemplateElement.
   *
   * @param {TemplateStringsArray} strings - the strings passed to the JavaScript template
   * literal
   * @param {string[]} substitutions - the variable values passed to the
   * JavaScript template literal
   * @returns {DocumentFragment}
   */
  function html(strings, ...substitutions) {
    const template = document.createElement("template");
    template.innerHTML = String.raw(strings, ...substitutions);
    return template.content;
  }

  /**
   * Manages keyboard handling for a component.
   *
   * This mixin handles several keyboard-related features.
   *
   * First, it wires up a single keydown event handler that can be shared by
   * multiple mixins on a component. The event handler will invoke a `keydown`
   * method with the event object, and any mixin along the prototype chain that
   * wants to handle that method can do so.
   *
   * If a mixin wants to indicate that keyboard event has been handled, and that
   * other mixins should *not* handle it, the mixin's `keydown` handler should
   * return a value of true. The convention that seems to work well is that a
   * mixin should see if it wants to handle the event and, if not, then ask the
   * superclass to see if it wants to handle the event. This has the effect of
   * giving the mixin that was applied last the first chance at handling a
   * keyboard event.
   *
   * Example:
   *
   *     [internal.keydown](event) {
   *       let handled;
   *       switch (event.key) {
   *         // Handle the keys you want, setting handled = true if appropriate.
   *       }
   *       // Prefer mixin result if it's defined, otherwise use base result.
   *       return handled || (super[internal.keydown] && super[internal.keydown](event));
   *     }
   *
   * A second feature provided by this mixin is that it implicitly makes the
   * component a tab stop if it isn't already, by setting `tabindex` to 0. This
   * has the effect of adding the component to the tab order in document order.
   *
   * @module KeyboardMixin
   * @param {Constructor<ReactiveElement>} Base
   */
  function KeyboardMixin(Base) {
    // The class prototype added by the mixin.
    class Keyboard extends Base {
      constructor() {
        // @ts-ignore
        super();
        this.addEventListener("keydown", async event => {
          this[raiseChangeEvents$1] = true;
          // For use with FocusVisibleMixin.
          if (!this[state$1].focusVisible) {
            // The user may have begun interacting with this element using the
            // mouse/touch, but has now begun using the keyboard, so show focus.
            this[setState$1]({
              focusVisible: true
            });
          }
          const handled = this[keydown](event);
          if (handled) {
            event.preventDefault();
            event.stopImmediatePropagation();
          }
          await Promise.resolve();
          this[raiseChangeEvents$1] = false;
        });
      }

      get [defaultState$1]() {
        // If we're using DelegateFocusMixin, we don't need or want to set a
        // tabindex on the host; we'll rely on the inner shadow elements to take
        // the focus and raise keyboard events. Otherwise, we do set a tabindex on
        // the host, so that we can get keyboard events.
        const tabIndex = this[delegatesFocus$1] ? null : 0;
        const state = Object.assign(super[defaultState$1], {
          tabIndex
        });

        return state;
      }

      /**
       * See the [symbols](internal#internal.keydown) documentation for details.
       */
      [keydown](/** @type {KeyboardEvent} */ event) {
        if (super[keydown]) {
          return super[keydown](event);
        }
        return false;
      }

      [render$1](/** @type {ChangedFlags} */ changed) {
        if (super[render$1]) {
          super[render$1](changed);
        }
        if (changed.tabIndex) {
          this.tabIndex = this[state$1].tabIndex;
        }
      }

      // Record our own notion of the state of the tabIndex property so we can
      // rerender if necessary.
      get tabIndex() {
        return super.tabIndex;
      }
      set tabIndex(tabIndex) {
        // Parse the passed value, which could be a string or null.
        let parsed = tabIndex !== null ? Number(tabIndex) : null;
        if (parsed !== null && isNaN(parsed)) {
          const defaultTabIndex$1 = this[defaultTabIndex];
          parsed = defaultTabIndex$1 ? defaultTabIndex$1 : 0;
        }

        // If parsed value isn't null and has changed, invoke the super setter.
        if (parsed !== null && super.tabIndex !== parsed) {
          super.tabIndex = parsed;
        }

        // The tabIndex setter can get called during rendering when we render our
        // own notion of the tabIndex state, in which case we don't need or want
        // to set state again.
        if (!this[rendering$1]) {
          // Record the new tabIndex in our state.
          this[setState$1]({
            tabIndex: parsed
          });
        }
      }
    }

    return Keyboard;
  }

  /**
   * Helpers for dynamically creating and patching component templates.
   *
   * The [ShadowTemplateMixin](ShadowTemplateMixin) lets you define a component
   * template that will be used to popuplate the shadow subtree of new component
   * instances. These helpers, especially the [html](#html) function, are intended
   * to simplify the creation of such templates.
   *
   * In particular, these helpers can be useful in [patching
   * templates](customizing#template-patching) inherited from a base class.
   *
   * Some of these functions take _descriptors_ that can either be a class, a tag
   * name, or an HTML template. These are generally used to fill specific roles in
   * an element's template; see [element roles](customizing#element-part-types).
   *
   * @module template
   */

  // Used by registerCustomElement.
  const mapBaseTagToCount = new Map();

  /**
   * Create an element from a role descriptor (a component class constructor or
   * an HTML tag name).
   *
   * If the descriptor is an HTML template, and the resulting document fragment
   * contains a single top-level node, that node is returned directly (instead of
   * the fragment).
   *
   * @param {PartDescriptor} descriptor - the descriptor that will be used to
   * create the element
   * @returns {Element} the new element
   */
  function createElement(descriptor) {
    if (typeof descriptor === "function") {
      // Instantiable component class constructor
      let element;
      try {
        element = new descriptor();
      } catch (e) {
        if (e.name === "TypeError") {
          // Most likely this error results from the fact that the indicated
          // component class hasn't been registered. Register it now with a random
          // name and try again.
          registerCustomElement(descriptor);
          element = new descriptor();
        } else {
          // The exception was for some other reason.
          throw e;
        }
      }
      return element;
      // @ts-ignore
    } else if (descriptor instanceof HTMLTemplateElement) {
      // Template
      /* eslint-disable no-console */
      console.warn(
        "Deprecation warning: template.createElement and template.transmute will soon stop accepting an HTMLTemplateElement as a part descriptor."
      );
      const fragment = document.importNode(descriptor.content, true);
      // @ts-ignore
      return fragment.children.length === 1 ? fragment.children[0] : fragment;
    } else {
      // String tag name: e.g., 'div'
      return document.createElement(descriptor);
    }
  }

  /**
   * A JavaScript template string literal that returns an HTML template.
   *
   * Example:
   *
   *     const myTemplate = html`Hello, <em>world</em>.`
   *
   * returns an `HTMLTemplateElement` whose `innerHTML` is `Hello, <em>world</em>.`
   *
   * This function is called `html` so that it can be easily used with HTML
   * syntax-highlighting extensions for various popular code editors.
   *
   * See also [html](html), a helper which returns a similar result but as an
   * DocumentFragment.
   *
   * @param {TemplateStringsArray} strings - the strings passed to the JavaScript template
   * literal
   * @param {string[]} substitutions - the variable values passed to the
   * JavaScript template literal
   * @returns {HTMLTemplateElement}
   */
  function html$1(strings, ...substitutions) {
    const template = document.createElement("template");
    template.innerHTML = String.raw(strings, ...substitutions);
    return template;
  }

  /**
   * Register the indicated constructor as a custom element class.
   *
   * This function generates a suitable string tag for the class. If the
   * constructor is a named function (which is typical for hand-authored code),
   * the function's `name` will be used as the base for the tag. If the
   * constructor is an anonymous function (which often happens in
   * generated/minified code), the tag base will be "custom-element".
   *
   * In either case, this function adds a uniquifying number to the end of the
   * base to produce a complete tag.
   *
   * @private
   * @param {Constructor<HTMLElement>} classFn
   */
  function registerCustomElement(classFn) {
    let baseTag;
    // HTML places more restrictions on the first character in a tag than
    // JavaScript places on the first character of a class name. We apply this
    // more restrictive condition to the class names we'll convert to tags. Class
    // names that fail this check -- often generated class names -- will result in
    // a base tag name of "custom-element".
    const classNameRegex = /^[A-Za-z][A-Za-z0-9_$]*$/;
    const classNameMatch = classFn.name && classFn.name.match(classNameRegex);
    if (classNameMatch) {
      // Given the class name `FooBar`, calculate the base tag name `foo-bar`.
      const className = classNameMatch[0];
      const uppercaseRegEx = /([A-Z])/g;
      const hyphenated = className.replace(
        uppercaseRegEx,
        (match, letter, offset) => (offset > 0 ? `-${letter}` : letter)
      );
      baseTag = hyphenated.toLowerCase();
    } else {
      baseTag = "custom-element";
    }
    // Add a uniquifying number to the end of the tag until we find a tag
    // that hasn't been registered yet.
    let count = mapBaseTagToCount.get(baseTag) || 0;
    let tag;
    for (; ; count++) {
      tag = `${baseTag}-${count}`;
      if (!customElements.get(tag)) {
        // Not in use.
        break;
      }
    }
    // Register with the generated tag.
    customElements.define(tag, /** @type {any} */ classFn);
    // Bump number and remember it. If we see the same base tag again later, we'll
    // start counting at that number in our search for a uniquifying number.
    mapBaseTagToCount.set(baseTag, count + 1);
  }

  /**
   * Replace an original node in a tree or document fragment with the indicated
   * replacement node. The attributes, classes, styles, and child nodes of the
   * original node will be moved to the replacement.
   *
   * @param {Node} original - an existing node to be replaced
   * @param {Node} replacement - the node to replace the existing node with
   * @returns {Node} the updated replacement node
   */
  function replace(original, replacement) {
    const parent = original.parentNode;
    if (!parent) {
      throw "An element must have a parent before it can be substituted.";
    }
    if (
      (original instanceof HTMLElement || original instanceof SVGElement) &&
      (replacement instanceof HTMLElement || replacement instanceof SVGElement)
    ) {
      // Merge attributes from original to replacement, letting replacement win
      // conflicts. Handle classes and styles separately (below).
      Array.prototype.forEach.call(original.attributes, (
        /** @type {Attr} */ attribute
      ) => {
        if (
          !replacement.getAttribute(attribute.name) &&
          attribute.name !== "class" &&
          attribute.name !== "style"
        ) {
          replacement.setAttribute(attribute.name, attribute.value);
        }
      });
      // Copy classes/styles from original to replacement, letting replacement win
      // conflicts.
      Array.prototype.forEach.call(original.classList, (
        /** @type {string} */ className
      ) => {
        replacement.classList.add(className);
      });
      Array.prototype.forEach.call(original.style, (
        /** @type {number} */ key
      ) => {
        if (!replacement.style[key]) {
          replacement.style[key] = original.style[key];
        }
      });
    }
    // Copy over children.
    // @ts-ignore
    replacement.append(...original.childNodes);

    parent.replaceChild(replacement, original);
    return replacement;
  }

  /**
   * Replace a node with a new element, transferring all attributes, classes,
   * styles, and child nodes from the original(s) to the replacement(s).
   *
   * The descriptor used for the replacements can be a 1) component class
   * constructor, 2) an HTML tag name, or 3) an HTML template. For #1 and #2, if
   * the existing elements that match the selector are already of the desired
   * class/tag name, the replacement operation is skipped.
   *
   * @param {Element} original - the node to replace
   * @param {PartDescriptor} descriptor - the descriptor used to generate the
   * replacement element
   * @returns {Element} the replacement node(s)
   */
  function transmute(original, descriptor) {
    if (
      (typeof descriptor === "function" && original.constructor === descriptor) ||
      (typeof descriptor === "string" &&
        original instanceof Element &&
        original.localName === descriptor)
    ) {
      // Already correct type of element, no transmutation necessary.
      return original;
    } else {
      // Transmute the single node.
      const replacement = createElement(descriptor);
      replace(original, replacement);
      return replacement;
    }
  }

  /**
   * Delegates a component's focus to its first focusable shadow element.
   *
   * This mixin serves as a polyfill for the standard `delegatesFocus` shadow
   * root property. As of April 2019, that property is only supported in Chrome.
   *
   * @module DelegateFocusMixin
   * @param {Constructor<ReactiveElement>} Base
   */
  function DelegateFocusMixin(Base) {
    // The class prototype added by the mixin.
    class DelegateFocus extends Base {
      /**
       * Returns true if the component is delegating its focus.
       *
       * A component using `DelegateFocusMixin` will always have this property be
       * true unless a class takes measures to override it.
       *
       * @type {boolean}
       * @default true
       */
      get [delegatesFocus$1]() {
        return true;
      }

      /**
       * If someone tries to put the focus on us, delegate the focus to the first
       * focusable element in the composed tree below our shadow root.
       *
       * @ignore
       * @param {FocusOptions=} focusOptions
       */
      focus(focusOptions) {
        /** @type {any} */ const cast = this[shadowRoot$1];
        if (cast.delegatesFocus) {
          // Native support for delegatesFocus, so don't need to do anything.
          super.focus(focusOptions);
          return;
        }
        const focusElement = this[focusTarget$1];
        if (focusElement) {
          focusElement.focus(focusOptions);
        }
      }

      get [focusTarget$1]() {
        // HACK: The commented-out code lets us rely on the browser to indicate
        // which element should be focused on in browsers that don't support
        // native delegatesFocus. However, this code creates subtle focus problems
        // in components like AutoCompleteListBox: if the user clicks the toggle
        // button, the focus won't be placed on the top-level AutoCompleteComboBox
        // as expected; that element will be returned as the focus target, but if
        // it doesn't have a non-negative tabindex, forwardFocus won't think it's
        // focusable. A more correct solution would be for all components that are
        // focusable to give themselves a tabIndex of 0 by default. Until we have
        // to fully explore that, we workaround the bug by providing the polyfill
        // behavior even in browsers that have delegatesFocus.

        // /** @type {any} */ const cast = this[internal.shadowRoot];
        // return cast.delegatesFocus
        //   ? this
        //   : firstFocusableElement(this[internal.shadowRoot]);
        return firstFocusableElement(this[shadowRoot$1]);
      }

      [render$1](/** @type {ChangedFlags} */ changed) {
        if (super[render$1]) {
          super[render$1](changed);
        }
        if (this[firstRender$1]) {
          // The delegatesFocus spec says that the focus outline should be shown
          // on both the host and the focused subelement — which seems confusing
          // and (in our opinion) looks ugly. If the browser supports
          // delegatesFocus we suppress the host focus outline.
          if (/** @type {any} */ (this[shadowRoot$1]).delegatesFocus) {
            this.style.outline = "none";
          }
        }
      }
    }

    return DelegateFocus;
  }

  const extendsKey = Symbol("extends");

  /* True if a standard element is focusable by default. */
  /** @type {IndexedObject<boolean>} */
  const focusableByDefault = {
    a: true,
    area: true,
    button: true,
    details: true,
    iframe: true,
    input: true,
    select: true,
    textarea: true
  };

  /*
   * A set of events which, if fired by the inner standard element, should be
   * re-raised by the custom element.
   *
   * These are events which are spec'ed to NOT get retargetted across a Shadow DOM
   * boundary, organized by which element(s) raise the events. To properly
   * simulate these, we will need to listen for the real events, then re-raise a
   * simulation of the original event. For more information, see
   * https://www.w3.org/TR/shadow-dom/#h-events-that-are-not-leaked-into-ancestor-trees.
   *
   * It appears that we do *not* need to re-raise the non-bubbling "focus" and
   * "blur" events. These appear to be automatically re-raised as expected -- but
   * it's not clear why that happens.
   *
   * The list below is reasonably complete. It omits elements that cannot be
   * wrapped (see class notes above). Also, we haven't actually tried wrapping
   * every element in this list; some of the more obscure ones might not actually
   * work as expected, but it was easier to include them for completeness than
   * to actually verify whether or not the element can be wrapped.
   */
  /** @type {IndexedObject<string[]>} */
  const reraiseEvents = {
    address: ["scroll"],
    blockquote: ["scroll"],
    caption: ["scroll"],
    center: ["scroll"],
    dd: ["scroll"],
    dir: ["scroll"],
    div: ["scroll"],
    dl: ["scroll"],
    dt: ["scroll"],
    fieldset: ["scroll"],
    form: ["reset", "scroll"],
    frame: ["load"],
    h1: ["scroll"],
    h2: ["scroll"],
    h3: ["scroll"],
    h4: ["scroll"],
    h5: ["scroll"],
    h6: ["scroll"],
    iframe: ["load"],
    img: ["abort", "error", "load"],
    input: ["abort", "change", "error", "select", "load"],
    li: ["scroll"],
    link: ["load"],
    menu: ["scroll"],
    object: ["error", "scroll"],
    ol: ["scroll"],
    p: ["scroll"],
    script: ["error", "load"],
    select: ["change", "scroll"],
    tbody: ["scroll"],
    tfoot: ["scroll"],
    thead: ["scroll"],
    textarea: ["change", "select", "scroll"]
  };

  /*
   * Mouse events that should be disabled if the inner component is disabled.
   */
  const mouseEventNames = [
    "click",
    "dblclick",
    "mousedown",
    "mouseenter",
    "mouseleave",
    "mousemove",
    "mouseout",
    "mouseover",
    "mouseup",
    "wheel"
  ];

  // Keep track of which re-raised events should bubble.
  /** @type {IndexedObject<boolean>} */
  const eventBubbles = {
    abort: true,
    change: true,
    reset: true
  };

  // Elements which are display: block by default.
  // Source: https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements
  const blockElements = [
    "address",
    "article",
    "aside",
    "blockquote",
    "canvas",
    "dd",
    "div",
    "dl",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "hgroup",
    "hr",
    "li",
    "main",
    "nav",
    "noscript",
    "ol",
    "output",
    "p",
    "pre",
    "section",
    "table",
    "tfoot",
    "ul",
    "video"
  ];

  // Standard attributes that don't have corresponding properties.
  // These need to be delegated from the wrapper to the inner element.
  const attributesWithoutProperties = [
    "accept-charset",
    "autoplay",
    "buffered",
    "challenge",
    "codebase",
    "colspan",
    "contenteditable",
    "controls",
    "crossorigin",
    "datetime",
    "dirname",
    "for",
    "formaction",
    "http-equiv",
    "icon",
    "ismap",
    "itemprop",
    "keytype",
    "language",
    "loop",
    "manifest",
    "maxlength",
    "minlength",
    "muted",
    "novalidate",
    "preload",
    "radiogroup",
    "readonly",
    "referrerpolicy",
    "rowspan",
    "scoped",
    "usemap"
  ];

  const Base = DelegateFocusMixin(ReactiveElement);

  /**
   * Wraps a standard HTML element so it can be extended
   *
   * The typical way to use this class is via its static `wrap` method.
   *
   * @inherits ReactiveElement
   * @mixes DelegateFocusMixin
   * @part inner - the inner standard HTML element
   */
  class WrappedStandardElement extends Base {
    constructor() {
      super();
      /** @type {any} */ const cast = this;
      if (!this[nativeInternals$1] && cast.attachInternals) {
        this[nativeInternals$1] = cast.attachInternals();
      }
    }

    /**
     *
     * Wrapped standard elements need to forward some attributes to the inner
     * element in cases where the attribute does not have a corresponding
     * property. These attributes include those prefixed with "aria-", and some
     * unusual standard attributes like contenteditable. To handle those, this
     * class defines its own attributeChangedCallback.
     *
     * @ignore
     * @param {string} name
     * @param {string} oldValue
     * @param {string} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
      const forwardAttribute = attributesWithoutProperties.indexOf(name) >= 0;
      if (forwardAttribute) {
        const innerAttributes = Object.assign(
          {},
          this[state$1].innerAttributes,
          {
            [name]: newValue
          }
        );
        this[setState$1]({ innerAttributes });
      } else {
        // Rely on the base attributeChangedCallback provided by
        // AttributeMarshallingMixin.
        super.attributeChangedCallback(name, oldValue, newValue);
      }
    }

    // Delegate method defined by HTMLElement.
    blur() {
      this.inner.blur();
    }

    // One HTMLElement we *don't* delegate is `click`. Generally speaking, a click
    // on the outer wrapper should behave the same as a click on the inner
    // element. Also, we want to ensure outside event listeners get a click event
    // when the click method is invoked. But a click on the inner element will
    // raise a click event that won't be re-raised by default across the shadow
    // boundary. The precise behavior seems to be slightly different in Safari
    // than other browsers, but it seems safer to not delegate click.
    //
    // click() {}

    get [defaultState$1]() {
      return Object.assign(super[defaultState$1], {
        innerAttributes: {},
        innerProperties: {}
      });
    }

    get [defaultTabIndex]() {
      return focusableByDefault[this.extends] ? 0 : -1;
    }

    /**
     * The tag name of the standard HTML element extended by this class.
     *
     * @returns {string}
     */
    get extends() {
      return this.constructor[extendsKey];
    }

    /**
     * Returns a reference to the inner standard HTML element!
     *
     * @type {HTMLElement}
     */
    get inner() {
      /** @type {any} */
      const result = this[ids$1] && this[ids$1].inner;
      if (!result) {
        /* eslint-disable no-console */
        console.warn(
          "Attempted to get an inner standard element before it was instantiated."
        );
      }
      return result;
    }

    /**
     * Return the value of the named property on the inner standard element.
     *
     * @param {string} name
     * @returns {any}
     */
    getInnerProperty(name) {
      // If we haven't rendered yet, use internal state value. Once we've
      // rendered, we get the value from the wrapped element itself. Return our
      // concept of the current property value from state. If the property hasn't
      // been defined, however, get the current value of the property from the
      // inner element.
      //
      // This is intended to support cases like an anchor element. If someone sets
      // `href` on a wrapped anchor, we'll know the value of `href` from state,
      // but we won't know the value of href-dependent calculated properties like
      // `protocol`. Using two sources of truth (state and the inner element)
      // seems fragile, but it's unclear how else to handle this without
      // reimplementing all HTML property interactions ourselves.
      //
      // This arrangement also means that, if an inner element property can change
      // in response to user interaction (e.g., an input element's value changes
      // as the user types), the component must listen to suitable events on the
      // inner element and update its state accordingly.
      const value = this[state$1].innerProperties[name];
      return value || (this[shadowRoot$1] && this.inner[name]);
    }

    static get observedAttributes() {
      // For our custom attributeChangedCallback to work, we need to observe
      // the attributes we want to forward.
      // @ts-ignore
      return [...super.observedAttributes, ...attributesWithoutProperties];
    }

    [render$1](/** @type {ChangedFlags} */ changed) {
      super[render$1](changed);

      const inner = this.inner;
      if (this[firstRender$1]) {
        // Listen for any events raised by the inner element which will not
        // automatically be retargetted across the Shadow DOM boundary, and
        // re-raise those events when they happen.
        const eventNames = reraiseEvents[this.extends] || [];
        eventNames.forEach(eventName => {
          inner.addEventListener(eventName, () => {
            const event = new Event(eventName, {
              bubbles: eventBubbles[eventName] || false
            });
            this.dispatchEvent(event);
          });
        });

        // If inner element can be disabled, then listen to mouse events on the
        // *outer* element and absorb them if the inner element is disabled.
        // Without this, a mouse event like a click on the inner disabled element
        // would be treated as a click on the outer element. Someone listening to
        // clicks on the outer element would get a click event, even though the
        // overall element is supposed to be disabled.
        if ("disabled" in inner) {
          mouseEventNames.forEach(eventName => {
            this.addEventListener(eventName, event => {
              if (/** @type {any} */ (inner).disabled) {
                event.stopImmediatePropagation();
              }
            });
          });
        }
      }

      if (changed.tabIndex) {
        inner.tabIndex = this[state$1].tabIndex;
      }

      if (changed.innerAttributes) {
        // Forward attributes to the inner element.
        // See notes at attributeChangedCallback.
        const { innerAttributes } = this[state$1];
        for (const name in innerAttributes) {
          applyAttribute(inner, name, innerAttributes[name]);
        }
      }

      if (changed.innerProperties) {
        // Forward properties to the inner element.
        const { innerProperties } = this[state$1];
        Object.assign(inner, innerProperties);
      }
    }

    [rendered$1](/** @type {ChangedFlags} */ changed) {
      super[rendered$1](changed);
      if (changed.innerProperties) {
        const { innerProperties } = this[state$1];
        const { disabled } = innerProperties;
        if (disabled !== undefined) {
          setInternalState(this, "disabled", disabled);
        }
      }
    }

    /**
     * Set the named property on the inner standard element.
     *
     * @param {string} name
     * @param {any} value
     */
    setInnerProperty(name, value) {
      // We normally don't check an existing state value before calling[internal.setState],
      // relying instead on[internal.setState] to do that check for us. However, we have
      // dangers in this particular component of creating infinite loops.
      //
      // E.g., setting the tabindex attibute will call attributeChangedCallback,
      // which will set the tabIndex property, which will want to set state, which
      // will cause a render, which will try to reflect the current value of the
      // tabIndex property to the tabindex attribute, causing a loop.
      //
      // To avoid this, we check the existing value before updating our state.
      const current = this[state$1].innerProperties[name];
      if (current !== value) {
        const innerProperties = Object.assign(
          {},
          this[state$1].innerProperties,
          {
            [name]: value
          }
        );
        this[setState$1]({ innerProperties });
      }
    }

    /**
     * The template copied into the shadow tree of new instances of this element.
     *
     * The default value of this property is a template that includes an instance
     * the standard element being wrapped, with a `<slot>` element inside that
     * to pick up the element's light DOM content. For example, if you wrap an
     * `<a>` element, then the default template will look like:
     *
     *     <template>
     *       <style>
     *       :host {
     *         display: inline-block;
     *       }
     *       </style>
     *       <a id="inner">
     *         <slot></slot>
     *       </a>
     *     </template>
     *
     * The `display` styling applied to the host will be `block` for elements that
     * are block elements by default, and `inline-block` (not `inline`) for other
     * elements.
     *
     * If you'd like the template to include other elements, then override this
     * property and return a template of your own. The template should include an
     * instance of the standard HTML element you are wrapping, and the ID of that
     * element should be "inner".
     *
     * @type {(string|HTMLTemplateElement)}
     */
    get [template$1]() {
      const display = blockElements.includes(this.extends)
        ? "block"
        : "inline-block";
      return html$1`
      <style>
        :host {
          display: ${display}
        }
        
        [part~="inner"] {
          box-sizing: border-box;
          height: 100%;
          width: 100%;
        }
      </style>
      <${this.extends} id="inner" part="inner">
        <slot></slot>
      </${this.extends}>
    `;
    }

    /**
     * Creates a class that wraps a standard HTML element.
     *
     * Note that the resulting class is a subclass of WrappedStandardElement, not
     * the standard class being wrapped. E.g., if you call
     * `WrappedStandardElement.wrap('a')`, you will get a class whose shadow tree
     * will include an anchor element, but the class will *not* inherit from
     * HTMLAnchorElement.
     *
     * @static
     * @param {string} extendsTag - the standard HTML element tag to extend
     */
    static wrap(extendsTag) {
      // Create the new class.
      /** @type {Constructor<WrappedStandardElement>} */
      class Wrapped extends WrappedStandardElement {}

      // Indicate which tag it wraps.
      /** @type {any} */ (Wrapped)[extendsKey] = extendsTag;

      // Create getter/setters that delegate to the wrapped element.
      const element = document.createElement(extendsTag);
      defineDelegates(Wrapped, Object.getPrototypeOf(element));

      return Wrapped;
    }
  }

  /**
   * Update the given attribute on an element.
   *
   * Passing a non-null `value` acts like a call to `setAttribute(name, value)`.
   * If the supplied `value` is nullish, this acts like a call to
   * `removeAttribute(name)`.
   *
   * @private
   * @param {HTMLElement} element
   * @param {string} name
   * @param {string} value
   */
  function applyAttribute(element, name, value) {
    if (standardBooleanAttributes[name]) {
      // Boolean attribute
      if (typeof value === "string") {
        element.setAttribute(name, "");
      } else if (value === null) {
        element.removeAttribute(name);
      }
    } else {
      // Regular string-valued attribute
      if (value != null) {
        element.setAttribute(name, value.toString());
      } else {
        element.removeAttribute(name);
      }
    }
  }

  /**
   * Create a delegate for the method or property identified by the descriptor.
   *
   * @private
   * @param {string} name
   * @param {PropertyDescriptor} descriptor
   */
  function createDelegate(name, descriptor) {
    if (typeof descriptor.value === "function") {
      if (name !== "constructor") {
        return createMethodDelegate(name, descriptor);
      }
    } else if (
      typeof descriptor.get === "function" ||
      typeof descriptor.set === "function"
    ) {
      return createPropertyDelegate(name, descriptor);
    }
    return null;
  }

  /**
   * Create a delegate for the method identified by the descriptor.
   *
   * @private
   * @param {string} name
   * @param {PropertyDescriptor} descriptor
   */
  function createMethodDelegate(name, descriptor) {
    const value = function(/** @type {any[]} */ ...args) {
      // @ts-ignore
      this.inner[name](...args);
    };
    const delegate = {
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable,
      value,
      writable: descriptor.writable
    };
    return delegate;
  }

  /**
   * Create a delegate for the property identified by the descriptor.
   *
   * @private
   * @param {string} name
   * @param {PropertyDescriptor} descriptor
   */
  function createPropertyDelegate(name, descriptor) {
    /** @type {PlainObject} */
    const delegate = {
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable
    };
    if (descriptor.get) {
      delegate.get = function() {
        return this.getInnerProperty(name);
      };
    }
    if (descriptor.set) {
      delegate.set = function(/** @type {any} */ value) {
        this.setInnerProperty(name, value);
      };
    }
    if (descriptor.writable) {
      delegate.writable = descriptor.writable;
    }
    return delegate;
  }

  /**
   * Define delegates for the given class for each property/method on the
   * indicated prototype.
   *
   * @private
   * @param {Constructor<Object>} cls
   * @param {Object} prototype
   */
  function defineDelegates(cls, prototype) {
    const names = Object.getOwnPropertyNames(prototype);
    names.forEach(name => {
      const descriptor = Object.getOwnPropertyDescriptor(prototype, name);
      if (!descriptor) {
        return;
      }
      const delegate = createDelegate(name, descriptor);
      if (delegate) {
        Object.defineProperty(cls.prototype, name, delegate);
      }
    });
  }

  const Base$1 = AriaRoleMixin(
    ComposedFocusMixin(
      FocusVisibleMixin(KeyboardMixin(WrappedStandardElement.wrap("button")))
    )
  );

  // Do we need to explicitly map Space/Enter keys to a button click?
  //
  // As of February 2019, Firefox automatically translates a Space/Enter key on a
  // button into a click event that bubbles to its host. Chrome/Safari do not do
  // this automatically, so we have to do it ourselves.
  //
  // It's gross to look for a specific browser (Firefox), but it seems extremely
  // hard to feature-detect this. Even if we try to create a button in a shadow at
  // runtime and send a key event to it, Chrome/Safari don't seem to do their
  // normal mapping of Space/Enter to a click for synthetic keyboard events.
  //
  // Firefox detection adapted from https://stackoverflow.com/a/9851769/76472
  // and adjusted to pass type checks.
  const firefox = "InstallTrigger" in window;
  const mapKeysToClick = !firefox;

  /**
   * Base class for custom buttons.
   *
   * `Button` wraps a standard HTML `button` element, allowing for custom styling
   * and behavior while ensuring standard keyboard and focus behavior.
   *
   * @inherits WrappedStandardElement
   * @mixes AriaRoleMixin
   * @mixes ComposedFocusMixin
   * @mixes FocusVisibleMixin
   * @mixes KeyboardMixin
   */
  class Button extends Base$1 {
    get [defaultState$1]() {
      return Object.assign(super[defaultState$1], {
        role: "button",
        treatEnterAsClick: true,
        treatSpaceAsClick: true
      });
    }

    // Pressing Enter or Space raises a click event, as if the user had clicked
    // the inner button.
    // TODO: Space should raise the click on *keyup*.
    [keydown](/** @type {KeyboardEvent} */ event) {
      let handled;
      if (mapKeysToClick) {
        switch (event.key) {
          case " ":
            if (this[state$1].treatSpaceAsClick) {
              this[tap]();
              handled = true;
            }
            break;

          case "Enter":
            if (this[state$1].treatEnterAsClick) {
              this[tap]();
              handled = true;
            }
            break;
        }
      }

      // Prefer mixin result if it's defined, otherwise use base result.
      return (
        handled || (super[keydown] && super[keydown](event))
      );
    }

    [render$1](/** @type {ChangedFlags} */ changed) {
      super[render$1](changed);
      if (changed.focusVisible) {
        // Override host `outline` style supplied by FocusVisibleMixin.
        this.style.outline = "none";
        const { focusVisible } = this[state$1];
        this[ids$1].inner.style.outline = focusVisible ? "" : "none";
      }
    }

    // Respond to a simulated click.
    [tap]() {
      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true
      });
      this.dispatchEvent(clickEvent);
    }

    get [template$1]() {
      const result = super[template$1];
      result.content.append(
        html`
        <style>
          :host {
            display: inline-flex;
            outline: none;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
          }

          [part~="inner"] {
            align-items: center;
            background: none;
            border: none;
            color: inherit;
            flex: 1;
            font: inherit;
            padding: 0;
          }
        </style>
      `
      );
      return result;
    }
  }

  /**
   * Button component in the Plain reference design system
   *
   * @inherits Button
   */
  class PlainButton extends Button {
    get [template$1]() {
      const result = super[template$1];
      result.content.append(
        html`
        <style>
          [part~="inner"] {
            display: inline-flex;
            justify-content: center;
            margin: 0;
            position: relative;
          }
        </style>
      `
      );
      return result;
    }
  }

  class ElixButton extends PlainButton {}
  customElements.define("elix-button", ElixButton);

  /**
   * Button with a border in the Plain reference design system
   *
   * @inherits PlainButton
   */
  class PlainBorderButton extends PlainButton {
    get [template$1]() {
      const result = super[template$1];
      result.content.append(
        html`
        <style>
          [part~="inner"] {
            background: #eee;
            border: 1px solid #ccc;
            padding: 0.25em 0.5em;
          }
        </style>
      `
      );
      return result;
    }
  }

  class ElixBorderButton extends PlainBorderButton {}
  customElements.define("elix-border-button", ElixBorderButton);

  /**
   * Helpers related to universal accessibility
   *
   * Universal accessibility is a core goal of the Elix project. These helpers are
   * used by mixins like [AriaListMixin](AriaListMixin) and
   * [AriaMenuMixin](AriaMenuMixin) to support accessibility via ARIA.
   *
   * @module accessibility
   */

  /**
   * A dictionary mapping built-in HTML elements to their default ARIA role.
   *
   * Example: `defaultAriaRole.ol` returns "list", since the default ARIA role
   * for an `ol` (ordered list) element is "list".
   */
  const defaultAriaRole = {
    a: "link",
    article: "region",
    button: "button",
    h1: "sectionhead",
    h2: "sectionhead",
    h3: "sectionhead",
    h4: "sectionhead",
    h5: "sectionhead",
    h6: "sectionhead",
    hr: "sectionhead",
    iframe: "region",
    link: "link",
    menu: "menu",
    ol: "list",
    option: "option",
    output: "liveregion",
    progress: "progressbar",
    select: "select",
    table: "table",
    td: "td",
    textarea: "textbox",
    th: "th",
    ul: "list"
  };

  /**
   * Tells assistive technologies to describe a list's items as a menu of choices.
   *
   * @module AriaMenuMixin
   * @param {Constructor<ReactiveElement>} Base
   */
  function AriaMenuMixin(Base) {
    // The class prototype added by the mixin.
    class AriaMenu extends Base {
      get [defaultState$1]() {
        const base = super[defaultState$1];
        return Object.assign(base, {
          itemRole: base.itemRole || "menuitem",
          role: base.role || "menu"
        });
      }

      get itemRole() {
        return this[state$1].itemRole;
      }
      set itemRole(itemRole) {
        this[setState$1]({ itemRole });
      }

      [render$1](/** @type {ChangedFlags} */ changed) {
        if (super[render$1]) {
          super[render$1](changed);
        }
        const { selectedIndex, itemRole } = this[state$1];
        /** @type {ListItemElement[]} */ const items = this[state$1].items;
        if ((changed.items || changed.itemRole) && items) {
          // Give each item a role.
          items.forEach(item => {
            if (itemRole === defaultAriaRole[item.localName]) {
              item.removeAttribute("role");
            } else {
              item.setAttribute("role", itemRole);
            }
          });
        }
        if ((changed.items || changed.selectedIndex) && items) {
          // Reflect the selection state to each item.
          items.forEach((item, index) => {
            const selected = index === selectedIndex;
            item.setAttribute("aria-checked", selected.toString());
          });
        }
        if (changed.role) {
          // Apply top-level role.
          const { role } = this[state$1];
          this.setAttribute("role", role);
        }
      }

      // Setting the standard role attribute will invoke this property setter,
      // which will allow us to update our state.
      get role() {
        return super.role;
      }
      set role(role) {
        super.role = role;
        if (!this[rendering$1]) {
          this[setState$1]({ role });
        }
      }
    }

    return AriaMenu;
  }

  /**
   * Maps direction semantics to selection semantics.
   *
   * This turns a movement in a direction (go left, go right) into a change in
   * selection (select previous, select next).
   *
   * This mixin can be used in conjunction with
   * [KeyboardDirectionMixin](KeyboardDirectionMixin) (which maps keyboard
   * events to directions) and a mixin that handles selection like
   * [SingleSelectionMixin](SingleSelectionMixin).
   *
   * @module DirectionSelectionMixin
   * @param {Constructor<ReactiveElement>} Base
   */
  function DirectionSelectionMixin(Base) {
    // The class prototype added by the mixin.
    class DirectionSelection extends Base {
      get [defaultState$1]() {
        return Object.assign(super[defaultState$1], {
          canGoDown: null,
          canGoLeft: null,
          canGoRight: null,
          canGoUp: null
        });
      }

      /**
       * Invokes `selectNext` to select the next item.
       */
      [goDown]() {
        if (super[goDown]) {
          super[goDown]();
        }
        if (!this.selectNext) {
          /* eslint-disable no-console */
          console.warn(
            `DirectionSelectionMixin expects ${this.constructor.name} to define a "selectNext" method.`
          );
          return false;
        } else {
          return this.selectNext();
        }
      }

      /**
       * Invokes `selectLast` to select the next item.
       */
      [goEnd]() {
        if (super[goEnd]) {
          super[goEnd]();
        }
        if (!this.selectLast) {
          /* eslint-disable no-console */
          console.warn(
            `DirectionSelectionMixin expects ${this.constructor.name} to define a "selectLast" method.`
          );
          return false;
        } else {
          return this.selectLast();
        }
      }

      /**
       * Invokes `selectPrevious` to select the previous item.
       *
       * If the element has a `rightToLeft` property and it is true, then this
       * selects the _next_ item.
       */
      [goLeft]() {
        if (super[goLeft]) {
          super[goLeft]();
        }
        if (!this.selectPrevious) {
          /* eslint-disable no-console */
          console.warn(
            `DirectionSelectionMixin expects ${this.constructor.name} to define a "selectPrevious" method.`
          );
          return false;
        } else {
          return this[state$1] && this[state$1].rightToLeft
            ? this.selectNext()
            : this.selectPrevious();
        }
      }

      /**
       * Invokes `selectNext` to select the next item.
       */
      [goNext]() {
        if (super[goNext]) {
          super[goNext]();
        }
        return this.selectNext();
      }

      /**
       * Invokes `selectPrevious` to select the previous item.
       */
      [goPrevious]() {
        if (super[goPrevious]) {
          super[goPrevious]();
        }
        return this.selectPrevious();
      }

      /**
       * Invokes `selectNext` to select the next item.
       *
       * If the element has a `rightToLeft` property and it is true, then this
       * selects the _previous_ item.
       */
      [goRight]() {
        if (super[goRight]) {
          super[goRight]();
        }
        if (!this.selectNext) {
          /* eslint-disable no-console */
          console.warn(
            `DirectionSelectionMixin expects ${this.constructor.name} to define a "selectNext" method.`
          );
          return false;
        } else {
          return this[state$1] && this[state$1].rightToLeft
            ? this.selectPrevious()
            : this.selectNext();
        }
      }

      /**
       * Invokes `selectFirst` to select the first item.
       */
      [goStart]() {
        if (super[goStart]) {
          super[goStart]();
        }
        if (!this.selectFirst) {
          /* eslint-disable no-console */
          console.warn(
            `DirectionSelectionMixin expects ${this.constructor.name} to define a "selectFirst" method.`
          );
          return false;
        } else {
          return this.selectFirst();
        }
      }

      /**
       * Invokes `selectPrevious` to select the previous item.
       */
      [goUp]() {
        if (super[goUp]) {
          super[goUp]();
        }
        if (!this.selectPrevious) {
          /* eslint-disable no-console */
          console.warn(
            `DirectionSelectionMixin expects ${this.constructor.name} to define a "selectPrevious" method.`
          );
          return false;
        } else {
          return this.selectPrevious();
        }
      }

      [stateEffects$1](state, changed) {
        const effects = super[stateEffects$1]
          ? super[stateEffects$1](state, changed)
          : {};

        // Update computed state members to track whether we can go
        // down/left/right/up.
        if (
          changed.canSelectNext ||
          changed.canSelectPrevious ||
          changed.languageDirection ||
          changed.orientation ||
          changed.rightToLeft
        ) {
          const {
            canSelectNext,
            canSelectPrevious,
            orientation,
            rightToLeft
          } = state;
          const canGoNext = canSelectNext;
          const canGoPrevious = canSelectPrevious;
          const horizontal =
            orientation === "horizontal" || orientation === "both";
          const vertical = orientation === "vertical" || orientation === "both";
          const canGoDown = vertical && canSelectNext;
          const canGoLeft = !horizontal
            ? false
            : rightToLeft
            ? canSelectNext
            : canSelectPrevious;
          const canGoRight = !horizontal
            ? false
            : rightToLeft
            ? canSelectPrevious
            : canSelectNext;
          const canGoUp = vertical && canSelectPrevious;
          Object.assign(effects, {
            canGoDown,
            canGoLeft,
            canGoNext,
            canGoPrevious,
            canGoRight,
            canGoUp
          });
        }

        return effects;
      }
    }

    return DirectionSelection;
  }

  /**
   * Exposes the text content of a list's items as an array of strings.
   *
   * @module ItemsTextMixin
   * @param {Constructor<ReactiveElement>} Base
   */
  function ItemsTextMixin(Base) {
    // The class prototype added by the mixin.
    class ItemsText extends Base {
      get [defaultState$1]() {
        return Object.assign(super[defaultState$1], {
          texts: null
        });
      }

      /**
       * Extract the text from the given item.
       *
       * The default implementation returns an item's `alt` attribute or its
       * `textContent`, in that order.
       *
       * @param {ListItemElement} item
       * @returns {string}
       */
      [getItemText](item) {
        return getItemText$1(item);
      }

      [stateEffects$1](state, changed) {
        const effects = super[stateEffects$1]
          ? super[stateEffects$1](state, changed)
          : {};

        // Regenerate texts when items change.
        if (changed.items) {
          const { items } = state;
          const texts = getTextsFromItems(items, this[getItemText]);
          if (texts) {
            Object.freeze(texts);
            Object.assign(effects, { texts });
          }
        }

        return effects;
      }
    }

    return ItemsText;
  }

  /**
   * Extract the text from the given item.
   *
   * @private
   * @param {ListItemElement} item
   */
  function getItemText$1(item) {
    return item.getAttribute("alt") || item.textContent || "";
  }

  /**
   * Extract the text from the given items.
   *
   * @private
   * @param {ListItemElement[]} items
   */
  function getTextsFromItems(items, getText = getItemText$1) {
    return items ? Array.from(items, item => getText(item)) : null;
  }

  /**
   * Maps direction keys to direction semantics.
   *
   * This mixin is useful for components that want to map direction keys (Left,
   * Right, etc.) to movement in the indicated direction (go left, go right,
   * etc.).
   *
   * This mixin expects the component to invoke a `keydown` method when a key is
   * pressed. You can use [KeyboardMixin](KeyboardMixin) for that
   * purpose, or wire up your own keyboard handling and call `keydown` yourself.
   *
   * This mixin calls methods such as `goLeft` and `goRight`. You can define
   * what that means by implementing those methods yourself. If you want to use
   * direction keys to navigate a selection, use this mixin with
   * [DirectionSelectionMixin](DirectionSelectionMixin).
   *
   * If the component defines a property called `orientation`, the value of that
   * property will constrain navigation to the horizontal or vertical axis.
   *
   * @module KeyboardDirectionMixin
   * @param {Constructor<ReactiveElement>} Base
   */
  function KeyboardDirectionMixin(Base) {
    // The class prototype added by the mixin.
    class KeyboardDirection extends Base {
      /**
       * Invoked when the user wants to go/navigate down.
       * The default implementation of this method does nothing.
       */
      [goDown]() {
        if (super[goDown]) {
          return super[goDown]();
        }
      }

      /**
       * Invoked when the user wants to go/navigate to the end (e.g., of a list).
       * The default implementation of this method does nothing.
       */
      [goEnd]() {
        if (super[goEnd]) {
          return super[goEnd]();
        }
      }

      /**
       * Invoked when the user wants to go/navigate left.
       * The default implementation of this method does nothing.
       */
      [goLeft]() {
        if (super[goLeft]) {
          return super[goLeft]();
        }
      }

      /**
       * Invoked when the user wants to go/navigate right.
       * The default implementation of this method does nothing.
       */
      [goRight]() {
        if (super[goRight]) {
          return super[goRight]();
        }
      }

      /**
       * Invoked when the user wants to go/navigate to the start (e.g., of a
       * list). The default implementation of this method does nothing.
       */
      [goStart]() {
        if (super[goStart]) {
          return super[goStart]();
        }
      }

      /**
       * Invoked when the user wants to go/navigate up.
       * The default implementation of this method does nothing.
       */
      [goUp]() {
        if (super[goUp]) {
          return super[goUp]();
        }
      }

      [keydown](/** @type {KeyboardEvent} */ event) {
        let handled = false;

        // Respect orientation state if defined, otherwise assume "both".
        const orientation = this[state$1].orientation || "both";
        const horizontal = orientation === "horizontal" || orientation === "both";
        const vertical = orientation === "vertical" || orientation === "both";

        // Ignore Left/Right keys when metaKey or altKey modifier is also pressed,
        // as the user may be trying to navigate back or forward in the browser.
        switch (event.key) {
          case "ArrowDown":
            if (vertical) {
              handled = event.altKey
                ? this[goEnd]()
                : this[goDown]();
            }
            break;

          case "ArrowLeft":
            if (horizontal && !event.metaKey && !event.altKey) {
              handled = this[goLeft]();
            }
            break;

          case "ArrowRight":
            if (horizontal && !event.metaKey && !event.altKey) {
              handled = this[goRight]();
            }
            break;

          case "ArrowUp":
            if (vertical) {
              handled = event.altKey
                ? this[goStart]()
                : this[goUp]();
            }
            break;

          case "End":
            handled = this[goEnd]();
            break;

          case "Home":
            handled = this[goStart]();
            break;
        }

        // Prefer mixin result if it's defined, otherwise use base result.
        return (
          handled ||
          (super[keydown] && super[keydown](event)) ||
          false
        );
      }
    }

    return KeyboardDirection;
  }

  /**
   * This helper returns a guess as to what portion of the given element can be
   * scrolled. This is used by [SelectionInViewMixin](SelectionInViewMixin) to
   * provide a default implementation of [internal.scrollTarget].
   *
   * If the element has a shadow root containing a default (unnamed) slot, this
   * returns the first ancestor of that slot that has either `overflow-x` or
   * `overflow-y` styled as `auto` or `scroll`. If the element has no default
   * slot, or no scrolling ancestor is found, the element itself is returned.
   *
   * @param {Element} element – the component to examine for a scrolling
   * element
   * @returns {Element}
   */
  function defaultScrollTarget(element) {
    const root = element[shadowRoot$1];
    const slot = root && root.querySelector("slot:not([name])");
    const scrollingParent =
      slot &&
      slot.parentNode instanceof Element &&
      getScrollableElement(slot.parentNode);
    return scrollingParent || element;
  }

  /**
   * Return true if the given element can be scrolled.
   *
   * @private
   * @param {HTMLElement} element
   */
  function isElementScrollable(element) {
    const style = getComputedStyle(element);
    const overflowX = style.overflowX;
    const overflowY = style.overflowY;
    return (
      overflowX === "scroll" ||
      overflowX === "auto" ||
      overflowY === "scroll" ||
      overflowY === "auto"
    );
  }

  /**
   * If the given element can be scrolled, return that. If not, return the closest
   * ancestor that can be scrolled. If no such ancestor is found, return null.
   *
   * @param {Element} node
   * @returns {Element|null}
   */
  function getScrollableElement(node) {
    for (const ancestor of selfAndComposedAncestors(node)) {
      if (ancestor instanceof HTMLElement && isElementScrollable(ancestor)) {
        return ancestor;
      }
    }
    return null;
  }

  /**
   * Maps the Page Up and Page Down keys to selection operations.
   *
   * The keyboard interaction model generally follows that of Microsoft Windows'
   * list boxes instead of those in OS X:
   *
   * * The Page Up/Down and Home/End keys actually change the selection, rather
   *   than just scrolling. The former behavior seems more generally useful for
   *   keyboard users.
   *
   * * Pressing Page Up/Down will change the selection to the topmost/bottommost
   *   visible item if the selection is not already there. Thereafter, the key
   *   will move the selection up/down by a page, and (per the above point) make
   *   the selected item visible.
   *
   * To ensure the selected item is in view following use of Page Up/Down, use
   * the related [SelectionInViewMixin](SelectionInViewMixin).
   *
   * This mixin expects the component to provide:
   *
   * * A `[internal.keydown]` method invoked when a key is pressed. You can use
   *   [KeyboardMixin](KeyboardMixin) for that purpose, or wire up your own
   *   keyboard handling and call `[internal.keydown]` yourself.
   * * A `selectedIndex` state member updatable via [internal.setState]`.
   *
   * @module KeyboardPagedSelectionMixin
   * @param {Constructor<ReactiveElement>} Base
   */
  function KeyboardPagedSelectionMixin(Base) {
    // The class prototype added by the mixin.
    class KeyboardPagedSelection extends Base {
      [keydown](/** @type {KeyboardEvent} */ event) {
        let handled = false;
        const orientation = this.orientation;
        if (orientation !== "horizontal") {
          switch (event.key) {
            case "PageDown":
              handled = this.pageDown();
              break;

            case "PageUp":
              handled = this.pageUp();
              break;
          }
        }

        // Prefer mixin result if it's defined, otherwise use base result.
        return (
          handled || (super[keydown] && super[keydown](event))
        );
      }

      // Default orientation implementation defers to super,
      // but if not found, looks in state.
      get orientation() {
        return (
          super.orientation ||
          (this[state$1] && this[state$1].orientation) ||
          "both"
        );
      }

      /**
       * Scroll down one page.
       */
      pageDown() {
        if (super.pageDown) {
          super.pageDown();
        }
        return scrollOnePage(this, true);
      }

      /**
       * Scroll up one page.
       */
      pageUp() {
        if (super.pageUp) {
          super.pageUp();
        }
        return scrollOnePage(this, false);
      }

      /**
       * The element that will be scrolled when the user presses Page Up or
       * Page Down. The default value is calculated by
       * [defaultScrollTarget](defaultScrollTarget#defaultScrollTarget).
       *
       * See [internal.scrollTarget](internal#internal.scrollTarget).
       *
       * @type {HTMLElement}
       */
      get [scrollTarget]() {
        /** @type {any} */
        const element = this;
        return super[scrollTarget] || defaultScrollTarget(element);
      }
    }

    return KeyboardPagedSelection;
  }

  /**
   * Return the item whose content spans the given y position (relative to the
   * top of the list's scrolling client area), or null if not found.
   *
   * If downward is true, move down the list of items to find the first item
   * found at the given y position; if downward is false, move up the list of
   *
   * items to find the last item at that position.
   *
   * @private
   * @param {ListItemElement[]} items
   * @param {number} y
   * @param {boolean} downward
   */
  function getIndexOfItemAtY(items, y, downward) {
    const start = downward ? 0 : items.length - 1;
    const end = downward ? items.length : 0;
    const step = downward ? 1 : -1;

    // Find the item spanning the indicated y coordinate.
    let index;
    /** @type {HTMLElement|SVGElement|null} */ let item = null;
    let itemRect;
    for (index = start; index !== end; index += step) {
      itemRect = items[index].getBoundingClientRect();
      if (itemRect.top <= y && y <= itemRect.bottom) {
        // Item spans the indicated y coordinate.
        item = items[index];
        break;
      }
    }

    if (!item || !itemRect) {
      return null;
    }

    // We may have found an item whose padding spans the given y coordinate,
    // but whose content is actually above/below that point.
    // TODO: If the item has a border, then padding should be included in
    // considering a hit.
    const itemStyle = getComputedStyle(item);
    const itemPaddingTop = itemStyle.paddingTop
      ? parseFloat(itemStyle.paddingTop)
      : 0;
    const itemPaddingBottom = itemStyle.paddingBottom
      ? parseFloat(itemStyle.paddingBottom)
      : 0;
    const contentTop = itemRect.top + itemPaddingTop;
    const contentBottom =
      contentTop + item.clientHeight - itemPaddingTop - itemPaddingBottom;
    if ((downward && contentTop <= y) || (!downward && contentBottom >= y)) {
      // The indicated coordinate hits the actual item content.
      return index;
    } else {
      // The indicated coordinate falls within the item's padding. Back up to
      // the item below/above the item we found and return that.
      return index - step;
    }
  }

  /**
   * Move by one page downward (if downward is true), or upward (if false).
   * Return true if we ended up changing the selection, false if not.
   *
   * @private
   * @param {ReactiveElement} element
   * @param {boolean} downward
   */
  function scrollOnePage(element, downward) {
    const scrollTarget$1 = element[scrollTarget];
    const items = element[state$1].items;
    const selectedIndex = element[state$1].selectedIndex;

    // Determine the item visible just at the edge of direction we're heading.
    // We'll select that item if it's not already selected.
    const targetRect = scrollTarget$1.getBoundingClientRect();
    const edge = downward ? targetRect.bottom : targetRect.top;
    const indexOfItemAtEdge = getIndexOfItemAtY(items, edge, downward);

    let newIndex;
    if (indexOfItemAtEdge && selectedIndex === indexOfItemAtEdge) {
      // The item at the edge was already selected, so scroll in the indicated
      // direction by one page, measuring from the bounds of the currently
      // selected item. Leave the new item at that edge selected.
      const selectedItem = items[selectedIndex];
      const selectedRect = selectedItem.getBoundingClientRect();
      const pageHeight = scrollTarget$1.clientHeight;
      const y = downward
        ? selectedRect.bottom + pageHeight
        : selectedRect.top - pageHeight;
      newIndex = getIndexOfItemAtY(items, y, downward);
    } else {
      // The item at the edge wasn't selected yet. Instead of scrolling, we'll
      // just select that item. That is, the first attempt to page up/down
      // usually just moves the selection to the edge in that direction.
      newIndex = indexOfItemAtEdge;
    }

    if (!newIndex) {
      // We can't find an item in the direction we want to travel. Select the
      // last item (if moving downward) or first item (if moving upward).
      newIndex = downward ? items.length - 1 : 0;
    }

    // If external code causes an operation that scrolls the page, it's impossible
    // for it to predict where the selectedIndex is going to end up. Accordingly,
    // we raise change events.
    const saveRaiseChangesEvents = element[raiseChangeEvents$1];
    element[raiseChangeEvents$1] = true;

    element[setState$1]({
      selectedIndex: newIndex
    });

    element[raiseChangeEvents$1] = saveRaiseChangesEvents;

    const changed = element[state$1].selectedIndex !== selectedIndex;
    return changed;
  }

  /**
   * Constants used by Elix mixins and components
   *
   * Sharing these constants allows for greater consistency in things such as user
   * interface timings.
   *
   * @module constants
   */

  /**
   * Time in milliseconds after which the user is considered to have stopped
   * typing.
   *
   * This is used by
   * [KeyboardPrefixSelectionMixin](KeyboardPrefixSelectionMixin).
   *
   * @const {number} TYPING_TIMEOUT_DURATION
   */
  const TYPING_TIMEOUT_DURATION = 1000;

  // Symbols for private data members on an element.
  const typedPrefixKey = Symbol("typedPrefix");
  const prefixTimeoutKey = Symbol("prefixTimeout");

  /**
   * Lets a user select a list item by typing the first few characters
   *
   * Example: suppose a component using this mixin has the following items:
   *
   *     <sample-list-component>
   *       <div>Apple</div>
   *       <div>Apricot</div>
   *       <div>Banana</div>
   *       <div>Blackberry</div>
   *       <div>Blueberry</div>
   *       <div>Cantaloupe</div>
   *       <div>Cherry</div>
   *       <div>Lemon</div>
   *       <div>Lime</div>
   *     </sample-list-component>
   *
   * If this component receives the focus, and the user presses the "b" or "B"
   * key, the "Banana" item will be selected, because it's the first item that
   * matches the prefix "b". (Matching is case-insensitive.) If the user now
   * presses the "l" or "L" key quickly, the prefix to match becomes "bl", so
   * "Blackberry" will be selected.
   *
   * The prefix typing feature has a one second timeout — the prefix to match
   * will be reset after a second has passed since the user last typed a key.
   * If, in the above example, the user waits a second between typing "b" and
   * "l", the prefix will become "l", so "Lemon" would be selected.
   *
   * This mixin expects the component to invoke a `keydown` method when a key is
   * pressed. You can use [KeyboardMixin](KeyboardMixin) for that
   * purpose, or wire up your own keyboard handling and call `keydown` yourself.
   *
   * This mixin also expects the component to provide an `items` property. The
   * `textContent` of those items will be used for purposes of prefix matching.
   *
   * @module KeyboardPrefixSelectionMixin
   * @param {Constructor<ReactiveElement>} Base
   */
  function KeyboardPrefixSelectionMixin(Base) {
    // The class prototype added by the mixin.
    class KeyboardPrefixSelection extends Base {
      constructor() {
        // @ts-ignore
        super();
        resetTypedPrefix(this);
      }

      [keydown](/** @type {KeyboardEvent} */ event) {
        let handled;

        switch (event.key) {
          case "Backspace":
            handleBackspace(this);
            handled = true;
            break;

          case "Escape":
            // Pressing Escape lets user quickly start typing a new prefix.
            resetTypedPrefix(this);
            break;

          default:
            if (
              !event.ctrlKey &&
              !event.metaKey &&
              !event.altKey &&
              event.key.length === 1
            ) {
              handlePlainCharacter(this, event.key);
            }
        }

        // Prefer mixin result if it's defined, otherwise use base result.
        return (
          handled || (super[keydown] && super[keydown](event))
        );
      }

      /**
       * Select the first item whose text content begins with the given prefix.
       *
       * @param {string} prefix - The prefix string to search for
       * @returns {boolean}
       */
      selectItemWithTextPrefix(prefix) {
        if (super.selectItemWithTextPrefix) {
          super.selectItemWithTextPrefix(prefix);
        }
        if (prefix == null || prefix.length === 0) {
          return false;
        }
        // Find item that begins with the prefix. Ignore case.
        const searchText = prefix.toLowerCase();
        /** @type {string[]} */ const texts = this[state$1].texts;
        const selectedIndex = texts.findIndex(
          text => text.substr(0, prefix.length).toLowerCase() === searchText
        );
        if (selectedIndex >= 0) {
          const previousIndex = this.selectedIndex;
          this[setState$1]({ selectedIndex });
          return this.selectedIndex !== previousIndex;
        } else {
          return false;
        }
      }
    }

    return KeyboardPrefixSelection;
  }

  /**
   * Handle the Backspace key: remove the last character from the prefix.
   *
   * @private
   * @param {ReactiveElement} element
   */
  function handleBackspace(element) {
    /** @type {any} */ const cast = element;
    const length = cast[typedPrefixKey] ? cast[typedPrefixKey].length : 0;
    if (length > 0) {
      cast[typedPrefixKey] = cast[typedPrefixKey].substr(0, length - 1);
    }
    element.selectItemWithTextPrefix(cast[typedPrefixKey]);
    setPrefixTimeout(element);
  }

  /**
   * Add a plain character to the prefix.
   *
   * @private
   * @param {ReactiveElement} element
   * @param {string} char
   */
  function handlePlainCharacter(element, char) {
    /** @type {any} */ const cast = element;
    const prefix = cast[typedPrefixKey] || "";
    cast[typedPrefixKey] = prefix + char;
    element.selectItemWithTextPrefix(cast[typedPrefixKey]);
    setPrefixTimeout(element);
  }

  /**
   * Stop listening for typing.
   *
   * @private
   * @param {ReactiveElement} element
   */
  function resetPrefixTimeout(element) {
    /** @type {any} */ const cast = element;
    if (cast[prefixTimeoutKey]) {
      clearTimeout(cast[prefixTimeoutKey]);
      cast[prefixTimeoutKey] = false;
    }
  }

  /**
   * Clear the prefix under construction.
   *
   * @private
   * @param {ReactiveElement} element
   */
  function resetTypedPrefix(element) {
    /** @type {any} */ (element)[typedPrefixKey] = "";
    resetPrefixTimeout(element);
  }

  /**
   * Wait for the user to stop typing.
   *
   * @private
   * @param {ReactiveElement} element
   */
  function setPrefixTimeout(element) {
    resetPrefixTimeout(element);
    /** @type {any} */ (element)[prefixTimeoutKey] = setTimeout(() => {
      resetTypedPrefix(element);
    }, TYPING_TIMEOUT_DURATION);
  }

  /**
   * Lets an element determine whether it resides in right-to-left text.
   *
   * @module LanguageDirectionMixin
   * @param {Constructor<ReactiveElement>} Base
   */
  function LanguageDirectionMixin(Base) {
    // The class prototype added by the mixin.
    return class LanguageDirection extends Base {
      // The only way to get text direction is to wait for the component to
      // connect and then inspect the computed style on its root element. We set
      // state before calling super so the new state will be included when
      // ReactiveMixin calls render.
      connectedCallback() {
        /** @type {any} */ const element = this;
        const languageDirection = getComputedStyle(element).direction;
        const rightToLeft = languageDirection === "rtl";
        this[setState$1]({ rightToLeft });
        if (super.connectedCallback) {
          super.connectedCallback();
        }
      }
    };
  }

  /**
   * Defines a component's value as the text content of the selected item.
   *
   * This mixin exists for list-like components that want to provide a more
   * convenient way to get/set the selected item using text. It adds a `value`
   * property that gets the `textContent` of a component's `selectedItem`. The
   * `value` property can also be set to set the selection to the first item in
   * the `items` collection that has the requested `textContent`. If the indicated
   * text is not found in `items`, the selection is cleared.
   *
   * This mixin expects a component to provide an `items` array of all elements
   * in the list. A standard way to do that with is
   * [ContentItemsMixin](ContentItemsMixin). This also expects the definition
   * of `selectedIndex` and `selectedItem` properties, which can be obtained
   * from [SingleSelectionMixin](SingleSelectionMixin).
   *
   * @module SelectedItemTextValueMixin
   * @param {Constructor<ReactiveElement>} Base
   */
  function SelectedItemTextValueMixin(Base) {
    // The class prototype added by the mixin.
    class SelectedItemTextValue extends Base {
      [rendered$1](/** @type {ChangedFlags} */ changed) {
        if (super[rendered$1]) {
          super[rendered$1](changed);
        }
        const { items, pendingValue } = this[state$1];
        if (pendingValue && items) {
          const index = indexOfItemWithText(items, pendingValue);
          this[setState$1]({
            selectedIndex: index,
            pendingValue: null
          });
        }
      }

      /**
       * The text content of the selected item.
       *
       * Setting this value to a string will attempt to select the first list item
       * whose text content match that string. Setting this to a string not matching
       * any list item will result in no selection.
       *
       * @type {string}
       */
      get value() {
        return this.selectedItem == null || this.selectedItem.textContent == null
          ? ""
          : this.selectedItem.textContent;
      }
      set value(text) {
        const items = this[state$1].items;
        if (items === null) {
          // No items yet, save and try again later.
          this[setState$1]({
            pendingValue: text
          });
        } else {
          // Select the index of the indicate text, if found.
          const selectedIndex = indexOfItemWithText(items, text);
          this[setState$1]({ selectedIndex });
        }
      }
    }

    return SelectedItemTextValue;
  }

  /**
   * @private
   * @param {Element[]} items
   * @param {string} text
   */
  function indexOfItemWithText(items, text) {
    return items.findIndex(item => item.textContent === text);
  }

  /**
   * Scrolls to ensure the selected item is visible
   *
   * When the selected item in a list-like component changes, the selected item
   * should be brought into view so that the user can confirm their selection.
   *
   * This mixin expects an `items` collection, such as that provided by
   * [ContentItemsMixin](ContentItemsMixin). It also expects a
   * `state.selectedIndex` member indicating which item is curently selected. You
   * can supply that yourself, or use
   * [SingleSelectionMixin](SingleSelectionMixin).
   *
   * @module SelectionInViewMixin
   * @param {Constructor<ReactiveElement>} Base
   */
  function SelectionInViewMixin(Base) {
    // The class prototype added by the mixin.
    class SelectionInView extends Base {
      [rendered$1](/** @type {ChangedFlags} */ changed) {
        if (super[rendered$1]) {
          super[rendered$1](changed);
        }

        if (changed.selectedIndex) {
          this.scrollSelectionIntoView();
        }
      }

      /**
       * Scroll the selected item element completely into view, minimizing the
       * degree of scrolling performed.
       *
       * Blink has a `scrollIntoViewIfNeeded()` function that does something
       * similar, but unfortunately it's non-standard, and in any event often ends
       * up scrolling more than is absolutely necessary.
       *
       * This scrolls the containing element defined by the `scrollTarget`
       * property. By default, it will scroll the element itself.
       */
      scrollSelectionIntoView() {
        if (super.scrollSelectionIntoView) {
          super.scrollSelectionIntoView();
        }

        const scrollTarget$1 = this[scrollTarget];
        const { selectedIndex, items } = this[state$1];
        if (selectedIndex < 0 || !items) {
          return;
        }

        const selectedItem = items[selectedIndex];
        if (!selectedItem) {
          return;
        }

        // Determine the bounds of the scroll target and item. We use
        // getBoundingClientRect instead of .offsetTop, etc., because the latter
        // round values, and we want to handle fractional values.
        const scrollTargetRect = scrollTarget$1.getBoundingClientRect();
        const itemRect = selectedItem.getBoundingClientRect();

        // Determine how far the item is outside the viewport.
        const bottomDelta = itemRect.bottom - scrollTargetRect.bottom;
        const leftDelta = itemRect.left - scrollTargetRect.left;
        const rightDelta = itemRect.right - scrollTargetRect.right;
        const topDelta = itemRect.top - scrollTargetRect.top;

        // Scroll the target as necessary to bring the item into view.
        // If an `orientation` state member is defined, only scroll along that
        // axis. Otherwise, assume the orientation is "both".
        const orientation = this[state$1].orientation || "both";
        if (orientation === "horizontal" || orientation === "both") {
          if (rightDelta > 0) {
            scrollTarget$1.scrollLeft += rightDelta; // Scroll right
          } else if (leftDelta < 0) {
            scrollTarget$1.scrollLeft += Math.ceil(leftDelta); // Scroll left
          }
        }
        if (orientation === "vertical" || orientation === "both") {
          if (bottomDelta > 0) {
            scrollTarget$1.scrollTop += bottomDelta; // Scroll down
          } else if (topDelta < 0) {
            scrollTarget$1.scrollTop += Math.ceil(topDelta); // Scroll up
          }
        }
      }

      /**
       * The element that should be scrolled to get the selected item into view.
       *
       * By default, this uses the [defaultScrollTarget](defaultScrollTarget)
       * helper to find the most likely candidate for scrolling. You can override
       * this property to directly identify which element should be scrolled.
       *
       * See also [internal.scrollTarget](internal#internal.scrollTarget).
       */
      get [scrollTarget]() {
        const base = super[scrollTarget];
        /** @type {any} */
        const element = this;
        return base || defaultScrollTarget(element);
      }
    }

    return SelectionInView;
  }

  /**
   * Adds single-selection semantics to a list-like element.
   *
   * This mixin expects a component to provide an `items` Array or NodeList of
   * all elements in the list.
   *
   * This mixin tracks a single selected item in the list, and provides means to
   * get and set that state by item position (`selectedIndex`) or item identity
   * (`selectedItem`). The selection can be moved in the list via the methods
   * `selectFirst`, `selectLast`, `selectNext`, and `selectPrevious`.
   *
   * This mixin does not produce any user-visible effects to represent
   * selection.
   *
   * @module SingleSelectionMixin
   * @param {Constructor<ReactiveElement>} Base
   */
  function SingleSelectionMixin(Base) {
    // The class prototype added by the mixin.
    class SingleSelection extends Base {
      /**
       * True if the selection can be moved to the next item, false if not (the
       * selected item is the last item in the list).
       *
       * @type {boolean}
       */
      get canSelectNext() {
        return this[state$1].canSelectNext;
      }

      /**
       * True if the selection can be moved to the previous item, false if not
       * (the selected item is the first one in the list).
       *
       * @type {boolean}
       */
      get canSelectPrevious() {
        return this[state$1].canSelectPrevious;
      }

      get [defaultState$1]() {
        return Object.assign(super[defaultState$1], {
          canSelectNext: null,
          canSelectPrevious: null,
          selectedIndex: -1,
          selectionRequired: false,
          selectionWraps: false,
          trackSelectedItem: true
        });
      }

      [rendered$1](/** @type {ChangedFlags} */ changed) {
        if (super[rendered$1]) {
          super[rendered$1](changed);
        }
        if (changed.selectedIndex && this[raiseChangeEvents$1]) {
          const selectedIndex = this[state$1].selectedIndex;
          /**
           * Raised when the `selectedIndex` property changes.
           *
           * @event selected-index-changed
           */
          const event = new CustomEvent("selected-index-changed", {
            detail: { selectedIndex }
          });
          this.dispatchEvent(event);
        }
      }

      /**
       * Select the first item in the list.
       *
       * @returns {Boolean} True if the selection changed, false if not.
       */
      selectFirst() {
        if (super.selectFirst) {
          super.selectFirst();
        }
        return updateSelectedIndex(this, 0);
      }

      /**
       * The index of the currently-selected item, or -1 if no item is selected.
       *
       * @type {number}
       */
      get selectedIndex() {
        const { items, selectedIndex } = this[state$1];
        return items && items.length > 0 ? selectedIndex : -1;
      }
      set selectedIndex(selectedIndex) {
        const parsed = Number(selectedIndex);
        if (!isNaN(parsed)) {
          this[setState$1]({
            selectedIndex: parsed
          });
        }
      }

      /**
       * The currently-selected item, or null if no item is selected.
       *
       * @type {Element}
       */
      get selectedItem() {
        const { items, selectedIndex } = this[state$1];
        return items && items[selectedIndex];
      }
      set selectedItem(selectedItem) {
        const { items } = this[state$1];
        if (!items) {
          return;
        }
        const selectedIndex = items.indexOf(selectedItem);
        if (selectedIndex >= 0) {
          this[setState$1]({ selectedIndex });
        }
      }

      /**
       * True if the list should always have a selection (if it has items).
       *
       * @type {boolean}
       * @default false
       */
      get selectionRequired() {
        return this[state$1].selectionRequired;
      }
      set selectionRequired(selectionRequired) {
        this[setState$1]({
          selectionRequired: String(selectionRequired) === "true"
        });
      }

      /**
       * True if selection navigations wrap from last to first, and vice versa.
       *
       * @type {boolean}
       * @default false
       */
      get selectionWraps() {
        return this[state$1].selectionWraps;
      }
      set selectionWraps(selectionWraps) {
        this[setState$1]({
          selectionWraps: String(selectionWraps) === "true"
        });
      }

      /**
       * Select the last item in the list.
       *
       * @returns {Boolean} True if the selection changed, false if not.
       */
      selectLast() {
        if (super.selectLast) {
          super.selectLast();
        }
        return updateSelectedIndex(this, this[state$1].items.length - 1);
      }

      /**
       * Select the next item in the list.
       *
       * If the list has no selection, the first item will be selected.
       *
       * @returns {Boolean} True if the selection changed, false if not.
       */
      selectNext() {
        if (super.selectNext) {
          super.selectNext();
        }
        return updateSelectedIndex(this, this[state$1].selectedIndex + 1);
      }

      /**
       * Select the previous item in the list.
       *
       * If the list has no selection, the last item will be selected.
       *
       * @returns {Boolean} True if the selection changed, false if not.
       */
      selectPrevious() {
        if (super.selectPrevious) {
          super.selectPrevious();
        }
        let newIndex;
        const { items, selectedIndex, selectionWraps } = this[state$1];
        if (
          (items && selectedIndex < 0) ||
          (selectionWraps && selectedIndex === 0)
        ) {
          // No selection yet, or we're on the first item, and selection wraps.
          // In either case, select the last item.
          newIndex = items.length - 1;
        } else if (selectedIndex > 0) {
          // Select the previous item.
          newIndex = selectedIndex - 1;
        } else {
          // Already on first item, can't go previous.
          return false;
        }
        return updateSelectedIndex(this, newIndex);
      }

      [stateEffects$1](state, changed) {
        const effects = super[stateEffects$1]
          ? super[stateEffects$1](state, changed)
          : {};

        // Ensure selectedIndex is valid.
        if (changed.items || changed.selectedIndex || changed.selectionRequired) {
          const {
            items,
            selectedIndex,
            selectionRequired,
            selectionWraps
          } = state;

          let adjustedIndex = selectedIndex;
          if (
            changed.items &&
            items &&
            !changed.selectedIndex &&
            state.trackSelectedItem
          ) {
            // The index stayed the same, but the item may have moved.
            const selectedItem = this.selectedItem;
            if (items[selectedIndex] !== selectedItem) {
              // The item moved or was removed. See if we can find the item
              // again in the list of items.
              const currentIndex = items.indexOf(selectedItem);
              if (currentIndex >= 0) {
                // Found the item again. Update the index to match.
                adjustedIndex = currentIndex;
              }
            }
          }

          // If items are null, we haven't received items yet. Don't validate the
          // selected index, as it may be set through markup; we'll want to validate
          // it only after we have items.
          if (items) {
            const validatedIndex = validateIndex(
              adjustedIndex,
              items.length,
              selectionRequired,
              selectionWraps
            );
            Object.assign(effects, {
              selectedIndex: validatedIndex
            });
          }
        }

        // Update computed state members canSelectNext/canSelectPrevious.
        if (changed.items || changed.selectedIndex || changed.selectionWraps) {
          const { items, selectedIndex, selectionWraps } = state;
          if (items) {
            const count = items.length;
            const canSelectNext =
              count === 0
                ? false
                : selectionWraps ||
                  selectedIndex < 0 ||
                  selectedIndex < count - 1;
            const canSelectPrevious =
              count === 0
                ? false
                : selectionWraps || selectedIndex < 0 || selectedIndex > 0;
            Object.assign(effects, {
              canSelectNext,
              canSelectPrevious
            });
          }
        }

        return effects;
      }
    }

    return SingleSelection;
  }

  /**
   * Validate the given selected index and, if that's not the element's current
   * selected index, update it.
   *
   * @private
   * @param {ReactiveElement} element
   * @param {number} selectedIndex
   */
  function updateSelectedIndex(element, selectedIndex) {
    const validatedIndex = validateIndex(
      selectedIndex,
      element[state$1].items.length,
      element[state$1].selectionRequired,
      element[state$1].selectionWraps
    );
    const changed = element[state$1].selectedIndex !== validatedIndex;
    if (changed) {
      element[setState$1]({
        selectedIndex: validatedIndex
      });
    }
    return changed;
  }

  /**
   * Force the indicated index to be between -1 and count - 1.
   *
   * @private
   * @param {number} index
   * @param {number} count
   * @param {boolean} selectionRequired
   * @param {boolean} selectionWraps
   */
  function validateIndex(index, count, selectionRequired, selectionWraps) {
    let validatedIndex;
    if (index === -1 && selectionRequired && count > 0) {
      // Ensure there's a selection.
      validatedIndex = 0;
    } else if (selectionWraps && count > 0) {
      // Wrap the index.
      // JavaScript mod doesn't handle negative numbers the way we want to wrap.
      // See http://stackoverflow.com/a/18618250/76472
      validatedIndex = ((index % count) + count) % count;
    } else {
      // Force index within bounds of -1 (no selection) to array length-1.
      // This logic also handles the case where there are no items
      // (count=0), which will produce a validated index of -1 (no
      // selection) regardless of what selectedIndex was asked for.
      validatedIndex = Math.max(Math.min(index, count - 1), -1);
    }
    return validatedIndex;
  }

  /**
   * Helpers for working with element content.
   *
   * @module content
   */

  // These are tags for elements that can appear in the document body, but do not
  // seem to have any user-visible manifestation.
  // See https://developer.mozilla.org/en-US/docs/Web/HTML/Element
  const auxiliarycustomTags = [
    "applet", // deprecated
    "basefont", // deprecated
    "embed",
    "font", // deprecated
    "frame", // deprecated
    "frameset", // deprecated
    "isindex", // deprecated
    "keygen", // deprecated
    "link",
    "multicol", // deprecated
    "nextid", // deprecated
    "noscript",
    "object",
    "param",
    "script",
    "style",
    "template",
    "noembed" // deprecated
  ];

  /**
   * Return true if the given node is likely to be useful as component content.
   *
   * This will be `true` for nodes that are: a) instances of `Element`
   * (`HTMLElement` or `SVGElement`), and b) not on a blacklist of normally
   * invisible elements (such as `style` or `script`). Among other things, this
   * returns `false` for Text nodes.
   *
   * This is used by [ContentItemsMixin](ContentItemsMixin) to filter out nodes
   * which are unlikely to be interesting as list items. This is intended to
   * satisfy the Gold Standard checklist criteria [Auxiliary
   * Content](https://github.com/webcomponents/gold-standard/wiki/Auxiliary-Content),
   * so that a component does not inadvertently treat `<style>` and other invisible
   * items as element content.
   *
   * @param {Node} node
   * @returns {boolean}
   */
  function isSubstantiveElement(node) {
    return (
      node instanceof Element &&
      (!node.localName || auxiliarycustomTags.indexOf(node.localName) < 0)
    );
  }

  /**
   * Treats an element's content nodes as list items.
   *
   * Items differ from nodes contents in several ways:
   *
   * * They are often referenced via index.
   * * They may have a selection state.
   * * It's common to do work to initialize the appearance or state of a new
   *   item.
   * * Text nodes are filtered out.
   * * Auxiliary invisible child elements are filtered out and not counted as
   *   items. Auxiliary elements include link, script, style, and template
   *   elements. This filtering ensures that those auxiliary elements can be
   *   used in markup inside of a list without being treated as list items.
   *
   * This mixin expects a component to provide a `content` state member returning
   * a raw set of elements. You can provide that yourself, or use
   * [SlotContentMixin](SlotContentMixin).
   *
   * Most Elix [elements](elements) use `ContentItemsMixin`, including
   * [ListBox](ListBox), [Modes](Modes), and [Tabs](Tabs).
   *
   * @module ContentItemsMixin
   * @param {Constructor<ReactiveElement>} Base
   */
  function ContentItemsMixin(Base) {
    return class ContentItems extends Base {
      get [defaultState$1]() {
        return Object.assign(super[defaultState$1], {
          items: null
        });
      }

      /**
       * Returns true if the given item should be shown in the indicated state.
       *
       * @param {ListItemElement} item
       * @param {PlainObject} state
       * @returns {boolean}
       */
      [itemMatchesState](item, state) {
        const base = super[itemMatchesState]
          ? super[itemMatchesState](item, state)
          : true;
        return base && isSubstantiveElement(item);
      }

      /**
       * The current set of items drawn from the element's current state.
       *
       * @type {ListItemElement[]|null} the element's current items
       */
      get items() {
        return this[state$1] ? this[state$1].items : null;
      }

      [rendered$1](/** @type {ChangedFlags} */ changed) {
        if (super[rendered$1]) {
          super[rendered$1](changed);
        }

        // Raise items-changed if items changed after the initial render. We'll
        // see changed.items on initial render, and raiseChangeEvents will be true
        // if we're using SlotContentMixin, but we don't want to actually raise
        // the event then because the items didn't change in response to user
        // activity.
        if (
          !this[firstRender$1] &&
          changed.items &&
          this[raiseChangeEvents$1]
        ) {
          /**
           * Raised when the `items` property changes.
           *
           * @event items-changed
           */
          const event = new CustomEvent("items-changed");
          this.dispatchEvent(event);
        }
      }

      [stateEffects$1](state, changed) {
        const effects = super[stateEffects$1]
          ? super[stateEffects$1](state, changed)
          : {};

        // Regenerate items when content changes, or if items has been nullified
        // by another mixin (as a signal that items should be regenerated).
        if (changed.content || changed.items) {
          /** @type {Node[]} */ const content = state.content;
          const needsItems = content && !state.items; // Signal from other mixins
          if (changed.content || needsItems) {
            const items = content
              ? Array.prototype.filter.call(content, (/** @type {Node} */ item) =>
                  item instanceof HTMLElement || item instanceof SVGElement
                    ? this[itemMatchesState](item, state)
                    : false
                )
              : null;
            if (items) {
              Object.freeze(items);
            }
            Object.assign(effects, { items });
          }
        }

        return effects;
      }
    };
  }

  /**
   * Defines a component's content as the flattened set of nodes assigned to a
   * slot.
   *
   * This mixin defines a component's `content` state member as the flattened
   * set of nodes assigned to a slot, typically the default slot.
   *
   * If the set of assigned nodes changes, the `content` state will be updated.
   * This helps a component satisfy the Gold Standard checklist item for
   * monitoring
   * [Content Changes](https://github.com/webcomponents/gold-standard/wiki/Content-Changes).
   *
   * By default, the mixin looks in the component's shadow subtree for a default
   * (unnamed) `slot` element. You can specify that a different slot should be
   * used by overriding the `internal.contentSlot` property.
   *
   * Most Elix [elements](elements) use `SlotContentMixin`, including
   * [ListBox](ListBox), [Modes](Modes), and [Tabs](Tabs).
   *
   * @module SlotContentMixin
   * @param {Constructor<ReactiveElement>} Base
   */
  function SlotContentMixin(Base) {
    // The class prototype added by the mixin.
    class SlotContent extends Base {
      /**
       * See [internal.contentSlot](internal#internal.contentSlot).
       */
      get [contentSlot]() {
        /** @type {HTMLSlotElement|null} */ const slot =
          this[shadowRoot$1] &&
          this[shadowRoot$1].querySelector("slot:not([name])");
        if (!this[shadowRoot$1] || !slot) {
          /* eslint-disable no-console */
          console.warn(
            `SlotContentMixin expects ${this.constructor.name} to define a shadow tree that includes a default (unnamed) slot.\nSee https://elix.org/documentation/SlotContentMixin.`
          );
        }
        return slot;
      }

      get [defaultState$1]() {
        return Object.assign(super[defaultState$1], {
          content: null
        });
      }

      [rendered$1](/** @type {ChangedFlags} */ changed) {
        if (super[rendered$1]) {
          super[rendered$1](changed);
        }

        // Listen to changes on the default slot.
        const slot = this[contentSlot];
        if (slot) {
          slot.addEventListener("slotchange", async () => {
            // Although slotchange isn't generally a user-driven event, it's
            // impossible for us to know whether a change in slot content is going
            // to result in effects that the host of this element can predict.
            // To be on the safe side, we raise any change events that come up
            // during the processing of this event.
            this[raiseChangeEvents$1] = true;

            // The nodes assigned to the given component have changed.
            // Update the component's state to reflect the new content.
            const content = slot.assignedNodes({ flatten: true });
            Object.freeze(content);
            this[setState$1]({ content });

            await Promise.resolve();
            this[raiseChangeEvents$1] = false;
          });
        }
      }
    }

    return SlotContent;
  }

  /**
   * Treats the elements assigned to the default slot as list items
   *
   * This is simply a combination of
   * [ContentItemsMixin](ContentItemsMixin) and
   * [SlotContentMixin](SlotContentMixin).
   *
   * @module SlotItemsMixin
   * @mixes ContentItemsMixin
   * @mixes SlotContentMixin
   * @param {Constructor<ReactiveElement>} Base
   */
  function SlotItemsMixin(Base) {
    return ContentItemsMixin(SlotContentMixin(Base));
  }

  /**
   * Maps a tap/mousedown on a list item to selection of that item
   *
   * This simple mixin is useful in list-like elements like [ListBox](ListBox),
   * where a tap/mousedown on a list item implicitly selects it.
   *
   * The standard use for this mixin is in list-like elements. Native list
   * boxes don't appear to be consistent with regard to whether they select
   * on mousedown or click/mouseup. This mixin assumes the use of mousedown.
   * On touch devices, that event appears to trigger when the touch is *released*.
   *
   * This mixin only listens to mousedown events for the primary mouse button
   * (typically the left button). Right clicks are ignored so that the browser may
   * display a context menu.
   *
   * This mixin expects the component to provide an `state.items` member. It also
   * expects the component to define a `state.selectedIndex` member; you can
   * provide that yourself, or use [SingleSelectionMixin](SingleSelectionMixin).
   *
   * If the component receives an event that doesn't correspond to an item (e.g.,
   * the user taps on the element background visible between items), the selection
   * will be removed. However, if the component sets `state.selectionRequired` to
   * true, a background tap will *not* remove the selection.
   *
   * @module TapSelectionMixin
   * @param {Constructor<ReactiveElement>} Base
   */
  function TapSelectionMixin(Base) {
    // The class prototype added by the mixin.
    return class TapSelection extends Base {
      constructor() {
        // @ts-ignore
        super();
        this.addEventListener("mousedown", event => {
          // Only process events for the main (usually left) button.
          if (event.button !== 0) {
            return;
          }
          this[raiseChangeEvents$1] = true;
          this[tap](event);
          this[raiseChangeEvents$1] = false;
        });
      }

      [render$1](/** @type {ChangedFlags} */ changed) {
        if (super[render$1]) {
          super[render$1](changed);
        }
        if (this[firstRender$1]) {
          Object.assign(this.style, {
            touchAction: "manipulation", // for iOS Safari
            mozUserSelect: "none",
            msUserSelect: "none",
            webkitUserSelect: "none",
            userSelect: "none"
          });
        }
      }

      [tap](/** @type {MouseEvent} */ event) {
        // In some situations, the event target will not be the child which was
        // originally clicked on. E.g., if the item clicked on is a button, the
        // event seems to be raised in phase 2 (AT_TARGET) — but the event target
        // will be the component, not the item that was clicked on. Instead of
        // using the event target, we get the first node in the event's composed
        // path.
        // @ts-ignore
        const target = event.composedPath
          ? event.composedPath()[0]
          : event.target;

        // Find which item was clicked on and, if found, select it. For elements
        // which don't require a selection, a background click will determine
        // the item was null, in which we case we'll remove the selection.
        const { items, selectedIndex, selectionRequired } = this[state$1];
        if (items && target instanceof Node) {
          const targetIndex = indexOfItemContainingTarget(items, target);
          if (
            targetIndex >= 0 ||
            (!selectionRequired && selectedIndex !== targetIndex)
          ) {
            this[setState$1]({
              selectedIndex: targetIndex
            });
            event.stopPropagation();
          }
        }
      }
    };
  }

  const Base$2 = AriaMenuMixin(
    DelegateFocusMixin(
      DirectionSelectionMixin(
        FocusVisibleMixin(
          ItemsTextMixin(
            KeyboardDirectionMixin(
              KeyboardMixin(
                KeyboardPagedSelectionMixin(
                  KeyboardPrefixSelectionMixin(
                    LanguageDirectionMixin(
                      SelectedItemTextValueMixin(
                        SelectionInViewMixin(
                          SingleSelectionMixin(
                            SlotItemsMixin(TapSelectionMixin(ReactiveElement))
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  );

  /**
   * A menu of choices or commands
   *
   * This holds the contents of the menu, not the top-level UI element that invokes
   * a menu. For that, see [MenuButton](MenuButton) or [PopupSource](PopupSource).
   *
   * @inherits ReactiveElement
   * @mixes AriaMenuMixin
   * @mixes DelegateFocusMixin
   * @mixes DirectionSelectionMixin
   * @mixes FocusVisibleMixin
   * @mixes ItemsTextMixin
   * @mixes KeyboardDirectionMixin
   * @mixes KeyboardMixin
   * @mixes KeyboardPagedSelectionMixin
   * @mixes KeyboardPrefixSelectionMixin
   * @mixes LanguageDirectionMixin
   * @mixes SelectedItemTextValueMixin
   * @mixes SelectionInViewMixin
   * @mixes SingleSelectionMixin
   * @mixes SlotItemsMixin
   * @mixes TapSelectionMixin
   */
  class Menu extends Base$2 {
    get [defaultState$1]() {
      return Object.assign(super[defaultState$1], {
        highlightSelection: true,
        orientation: "vertical",
        selectionFocused: false
      });
    }

    /**
     * Highlight the selected item.
     *
     * By default, this uses a heuristic to guess whether the menu was closed by a
     * keyboard or mouse. If so, the menu flashes the selected item off then back
     * on, emulating the menu item selection effect in macOS. Otherwise, it does
     * nothing.
     */
    async highlightSelectedItem() {
      const keyboardActive = this[state$1].focusVisible;
      const probablyDesktop = matchMedia("(pointer: fine)").matches;
      if (keyboardActive || probablyDesktop) {
        const flashDuration = 75; // milliseconds
        this[setState$1]({ highlightSelection: false });
        await new Promise(resolve => setTimeout(resolve, flashDuration));
        this[setState$1]({ highlightSelection: true });
        await new Promise(resolve => setTimeout(resolve, flashDuration));
      }
    }

    /**
     * Returns true if the given item should be shown in the indicated state.
     *
     * @param {ListItemElement} item
     * @param {PlainObject} state
     */
    [itemMatchesState](item, state) {
      const base = super[itemMatchesState]
        ? super[itemMatchesState](item, state)
        : true;
      /** @type {any} */ const cast = item;
      return base && !cast.disabled;
    }

    [render$1](/** @type {ChangedFlags} */ changed) {
      super[render$1](changed);

      if (this[firstRender$1]) {
        this.addEventListener("mousemove", () => {
          this.suppressFocusVisibility();
        });

        // Treat a pointerdown event as a tap.
        if ("PointerEvent" in window) {
          // Prefer listening to standard pointer events.
          this.addEventListener("pointerdown", event =>
            this[tap](event)
          );
        } else {
          this.addEventListener("touchstart", event => this[tap](event));
        }

        this.removeAttribute("tabindex");
      }

      const { selectedIndex, items } = this[state$1];
      if ((changed.items || changed.selectedIndex) && items) {
        // Reflect the selection state to the item.
        items.forEach((item, index) => {
          item.toggleAttribute("selected", index === selectedIndex);
        });
      }

      if (
        (changed.items ||
          changed.selectedIndex ||
          changed.selectionFocused ||
          changed.focusVisible) &&
        items
      ) {
        // A menu has a complicated focus arrangement in which the selected item has
        // focus, which means it needs a tabindex. However, we don't want any other
        // item in the menu to have a tabindex, so that if the user presses Tab or
        // Shift+Tab, they move away from the menu entirely (rather than just moving
        // to the next or previous item).
        //
        // That's already complex, but to make things worse, if we remove the
        // tabindex from an item that has the focus, the focus gets moved to the
        // document. In popup menus, the popup will conclude it's lost the focus,
        // and implicitly close. So we want to move the focus in two phases: 1)
        // set tabindex on a newly-selected item so we can focus on it, 2) after
        // the new item has been focused, remove the tabindex from any
        // previously-selected item.
        items.forEach((item, index) => {
          const selected = index === selectedIndex;
          const isDefaultFocusableItem = selectedIndex < 0 && index === 0;
          if (!this[state$1].selectionFocused) {
            // Phase 1: Add tabindex to newly-selected item.
            if (selected || isDefaultFocusableItem) {
              item.tabIndex = 0;
            }
          } else {
            // Phase 2: Remove tabindex from any previously-selected item.
            if (!(selected || isDefaultFocusableItem)) {
              item.removeAttribute("tabindex");
            }
          }

          // Don't show focus on selected item if we're suppressing the focus
          // (because the mouse was used for selection) or if the item was
          // selected by default when the menu opened.
          const suppressFocus =
            (selected && !this[state$1].focusVisible) ||
            isDefaultFocusableItem;
          item.style.outline = suppressFocus ? "none" : "";
        });
      }
    }

    [rendered$1](/** @type {ChangedFlags} */ changed) {
      super[rendered$1](changed);
      if (
        !this[firstRender$1] &&
        changed.selectedIndex &&
        !this[state$1].selectionFocused
      ) {
        // The selected item needs the focus, but this is complicated. See notes
        // in render.
        const focusElement =
          this.selectedItem instanceof HTMLElement ? this.selectedItem : this;
        focusElement.focus();

        // Now that the selection has been focused, we can remove/reset the
        // tabindex on any item that had previously been selected.
        this[setState$1]({
          selectionFocused: true
        });
      }
    }

    get [scrollTarget]() {
      return this[ids$1].content;
    }

    [stateEffects$1](state, changed) {
      const effects = super[stateEffects$1](state, changed);

      // When selection changes, we'll need to focus on it in rendered.
      if (changed.selectedIndex) {
        Object.assign(effects, {
          selectionFocused: false
        });
      }

      return effects;
    }

    get [template$1]() {
      return html$1`
      <style>
        :host {
          box-sizing: border-box;
          cursor: default;
          display: flex;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        #content {
          display: flex;
          flex: 1;
          flex-direction: column;
          max-height: 100%;
          overflow-x: hidden;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch; /* for momentum scrolling */
        }
        
        ::slotted(*) {
          flex-shrink: 0;
          touch-action: manipulation;
        }

        ::slotted(option) {
          font: inherit;
          min-height: inherit;
        }
      </style>
      <div id="content" role="none">
        <slot></slot>
      </div>
    `;
    }
  }

  /**
   * Tracks the disabled state of a component that can be disabled
   *
   * @module DisabledMixin
   * @param {Constructor<ReactiveElement>} Base
   */
  function DisabledMixin(Base) {
    // The class prototype added by the mixin.
    class Disabled extends Base {
      get [defaultState$1]() {
        return Object.assign(super[defaultState$1], {
          disabled: false
        });
      }

      /**
       * True if the component is disabled, false (the default) if not.
       *
       * The value of this property will be reflected to the `disabled` attribute
       * so that it can be referenced in CSS. Note that this non-native
       * implementation of the `disabled` attribute will *not* trigger the
       * `:disabled` CSS pseudo-class, so your style rules will have to reference
       * the presence or absence of the `disabled` attribute. That is, instead
       * of writing
       *
       *     my-component:disabled { ... }
       *
       * write this instead
       *
       *     my-component[disabled] { ... }
       *
       * Like the native `disabled` attribute, this attribute is boolean. That
       * means that it's *existence* in markup sets the attribute, even if set to
       * an empty string or a string like "false".
       *
       * @type {boolean}
       * @default false
       */
      get disabled() {
        return this[state$1].disabled;
      }
      // AttributeMarshallingMixin should parse this as a boolean attribute for us.
      set disabled(disabled) {
        this[setState$1]({ disabled });
      }

      [rendered$1](/** @type {ChangedFlags} */ changed) {
        if (super[rendered$1]) {
          super[rendered$1](changed);
        }
        if (changed.disabled) {
          // Reflect value of disabled property to the corresponding attribute.
          this.toggleAttribute("disabled", this.disabled);
        }
      }
    }

    return Disabled;
  }

  /** @type {any} */
  const closePromiseKey = Symbol("closePromise");
  /** @type {any} */
  const closeResolveKey = Symbol("closeResolve");

  /**
   * Tracks the open/close state of a component.
   *
   * @module OpenCloseMixin
   * @param {Constructor<ReactiveElement>} Base
   */
  function OpenCloseMixin(Base) {
    // The class prototype added by the mixin.
    class OpenClose extends Base {
      /**
       * Close the component (if not already closed).
       *
       * Some components like [AlertDialog](AlertDialog) want to indicate why or
       * how they were closed. To support such scenarios, you can supply a value
       * to the optional `closeResult` parameter. This closeResult will be made
       * available in the `whenClosed` promise and the `state.closeResult` member.
       *
       * @param {object} [closeResult] - an indication of how or why the element closed
       */
      async close(closeResult) {
        if (super.close) {
          await super.close();
        }
        this[setState$1]({ closeResult });
        await this.toggle(false);
      }

      /**
       * True if the element is currently closed.
       *
       * This read-only property is provided as a convenient inverse of `opened`.
       *
       * @type {boolean}
       */
      get closed() {
        return this[state$1] && !this[state$1].opened;
      }

      /**
       * True if the element has completely closed.
       *
       * For components not using asynchronous open/close effects, this property
       * returns the same value as the `closed` property. For elements that have a
       * true value of `state.openCloseEffects` (e.g., elements using
       * [TransitionEffectMixin](TransitionEffectMixin)), this property returns
       * true only if `state.effect` is "close" and `state.effectPhase` is
       * "after".
       *
       * @type {boolean}
       */
      get closeFinished() {
        // TODO: Define closeFinished as computed state
        return this[state$1].openCloseEffects
          ? this[state$1].effect === "close" &&
              this[state$1].effectPhase === "after"
          : this.closed;
      }

      get closeResult() {
        return this[state$1].closeResult;
      }

      get [defaultState$1]() {
        const defaults = {
          closeResult: null,
          opened: false
        };
        // If this component defines a `startEffect` method (e.g., by using
        // TransitionEffectMixin), include default state for open/close effects.
        // Since the component is closed by default, the default effect state is
        // after the close effect has completed.
        if (this[startEffect]) {
          Object.assign(defaults, {
            effect: "close",
            effectPhase: "after",
            openCloseEffects: true
          });
        }
        return Object.assign(super[defaultState$1], defaults);
      }

      /**
       * Open the element (if not already opened).
       */
      async open() {
        if (super.open) {
          await super.open();
        }
        this[setState$1]({ closeResult: undefined });
        await this.toggle(true);
      }

      /**
       * True if the element is currently opened.
       *
       * This property can be set as a boolean attribute
       *
       * @type {boolean|string}
       */
      get opened() {
        return this[state$1] && this[state$1].opened;
      }
      set opened(opened) {
        const parsed = booleanAttributeValue("opened", opened);
        this[setState$1]({ closeResult: undefined });
        this.toggle(parsed);
      }

      [rendered$1](/** @type {ChangedFlags} */ changed) {
        if (super[rendered$1]) {
          super[rendered$1](changed);
        }

        if (changed.opened && this[raiseChangeEvents$1]) {
          /**
           * Raised when the opened/closed state of the component changes.
           *
           * @event opened-changed
           */
          const openedChangedEvent = new CustomEvent("opened-changed", {
            detail: {
              closeResult: this[state$1].closeResult,
              opened: this[state$1].opened
            }
          });
          this.dispatchEvent(openedChangedEvent);

          if (this[state$1].opened) {
            /**
             * Raised when the component opens.
             *
             * @event opened
             */
            const openedEvent = new CustomEvent("opened");
            this.dispatchEvent(openedEvent);
          } else {
            /**
             * Raised when the component closes.
             *
             * @event closed
             */
            const closedEvent = new CustomEvent("closed", {
              detail: {
                closeResult: this[state$1].closeResult
              }
            });
            this.dispatchEvent(closedEvent);
          }
        }

        // If someone's waiting for the component to close, and it's completely
        // finished closing, then resolve the close promise.
        const closeResolve = this[closeResolveKey];
        if (this.closeFinished && closeResolve) {
          this[closeResolveKey] = null;
          this[closePromiseKey] = null;
          closeResolve(this[state$1].closeResult);
        }
      }

      /**
       * Toggle the open/close state of the element.
       *
       * @param {boolean} [opened] - true if the element should be opened, false
       * if closed.
       */
      async toggle(opened = !this.opened) {
        if (super.toggle) {
          await super.toggle(opened);
        }
        const changed = opened !== this[state$1].opened;
        if (changed) {
          /** @type {PlainObject} */ const changes = { opened };
          if (this[state$1].openCloseEffects) {
            changes.effect = opened ? "open" : "close";
            if (this[state$1].effectPhase === "after") {
              changes.effectPhase = "before";
            }
          }
          await this[setState$1](changes);
        }
      }

      /**
       * This method can be used as an alternative to listening to the
       * "opened-changed" event, particularly in situations where you want to only
       * handle the next time the component is closed.
       *
       * @returns {Promise} A promise that resolves when the element has
       * completely closed, including the completion of any asynchronous opening
       * effect.
       */
      whenClosed() {
        if (!this[closePromiseKey]) {
          this[closePromiseKey] = new Promise(resolve => {
            this[closeResolveKey] = resolve;
          });
        }
        return this[closePromiseKey];
      }
    }

    return OpenClose;
  }

  const Base$3 = AriaRoleMixin(ReactiveElement);

  /**
   * Background element shown behind an overlay's primary content
   *
   * The backdrop is transparent by default, suggesting to the user that the
   * overlay is modeless, and they can click through it to reach the background
   * elements. For a modal variant, see [ModalBackdrop](ModalBackdrop).
   *
   * @inherits ReactiveElement
   * @mixes AriaRoleMixin
   */
  class Backdrop extends Base$3 {
    get [defaultState$1]() {
      return Object.assign(super[defaultState$1], {
        role: "none"
      });
    }

    get [template$1]() {
      return html$1`
      <style>
        :host {
          height: 100%;
          left: 0;
          position: fixed;
          top: 0;
          touch-action: manipulation;
          width: 100%;
        }
      </style>
      <slot></slot>
    `;
    }
  }

  /**
   * A simple frame for overlay content.
   *
   * The default appearance of `OverlayFrame` uses a simple drop-shadow to let the
   * user see the framed content as being on top of the background page content.
   *
   * @inherits ReactiveElement
   */
  class OverlayFrame extends ReactiveElement {
    get [template$1]() {
      return html$1`
      <style>
        :host {
          position: relative;
        }
      </style>
      <slot></slot>
    `;
    }
  }

  /** @type {any} */
  const appendedToDocumentKey = Symbol("appendedToDocument");
  /** @type {any} */
  const defaultZIndexKey = Symbol("assignedZIndex");
  /** @type {any} */
  const restoreFocusToElementKey = Symbol("restoreFocusToElement");

  /**
   * Displays an opened element on top of other page elements.
   *
   * This mixin handles showing and hiding an overlay element. It, together with
   * [OpenCloseMixin](OpenCloseMixin), form the core behavior for [Overlay](Overlay),
   * which in turn forms the basis of Elix's overlay components.
   *
   * @module OverlayMixin
   * @param {Constructor<ReactiveElement>} Base
   */
  function OverlayMixin(Base) {
    // The class prototype added by the mixin.
    class Overlay extends Base {
      // TODO: Document
      get autoFocus() {
        return this[state$1].autoFocus;
      }
      set autoFocus(autoFocus) {
        this[setState$1]({ autoFocus });
      }

      get [defaultState$1]() {
        return Object.assign(super[defaultState$1], {
          autoFocus: true,
          persistent: false
        });
      }

      async open() {
        if (!this[state$1].persistent && !this.isConnected) {
          // Overlay isn't in document yet.
          this[appendedToDocumentKey] = true;
          document.body.append(this);
        }
        if (super.open) {
          await super.open();
        }
      }

      [render$1](/** @type {ChangedFlags} */ changed) {
        if (super[render$1]) {
          super[render$1](changed);
        }

        if (this[firstRender$1]) {
          this.addEventListener("blur", event => {
            // What has the focus now?
            const newFocusedElement =
              event.relatedTarget || document.activeElement;
            /** @type {any} */
            const node = this;
            if (newFocusedElement instanceof HTMLElement) {
              const focusInside = deepContains(node, newFocusedElement);
              if (!focusInside) {
                if (this.opened) {
                  // The user has most likely clicked on something in the background
                  // of a modeless overlay. Remember that element, and restore focus
                  // to it when the overlay finishes closing.
                  this[restoreFocusToElementKey] = newFocusedElement;
                } else {
                  // A blur event fired, but the overlay closed itself before the blur
                  // event could be processed. In closing, we may have already
                  // restored the focus to the element that originally invoked the
                  // overlay. Since the user has clicked somewhere else to close the
                  // overlay, put the focus where they wanted it.
                  newFocusedElement.focus();
                  this[restoreFocusToElementKey] = null;
                }
              }
            }
          });
        }

        if (changed.effectPhase || changed.opened || changed.persistent) {
          if (!this[state$1].persistent) {
            // Temporary overlay
            const closed =
              typeof this.closeFinished === "undefined"
                ? this.closed
                : this.closeFinished;

            // We'd like to just use the `hidden` attribute, but a side-effect of
            // styling with the hidden attribute is that naive styling of the
            // component from the outside (to change to display: flex, say) will
            // override the display: none implied by hidden. To work around both
            // these problems, we use display: none when the overlay is closed.
            this.style.display = closed ? "none" : "";

            if (closed) {
              if (this[defaultZIndexKey]) {
                // Remove default z-index.
                this.style.zIndex = "";
                this[defaultZIndexKey] = null;
              }
            } else if (this[defaultZIndexKey]) {
              this.style.zIndex = this[defaultZIndexKey];
            } else {
              if (!hasZIndex(this)) {
                bringToFront(this);
              }
            }
          }
        }
      }

      [rendered$1](/** @type {ChangedFlags} */ changed) {
        if (super[rendered$1]) {
          super[rendered$1](changed);
        }

        if (this[firstRender$1]) {
          // Perform one-time check to see if component needs a default z-index.
          if (this[state$1].persistent && !hasZIndex(this)) {
            bringToFront(this);
          }
        }

        if (changed.opened) {
          if (this[state$1].autoFocus) {
            if (this[state$1].opened) {
              // Opened
              if (
                !this[restoreFocusToElementKey] &&
                document.activeElement !== document.body
              ) {
                // Remember which element had the focus before we were opened.
                this[restoreFocusToElementKey] = document.activeElement;
              }
              // Focus on the element itself (if it's focusable), or the first focusable
              // element inside it.
              // TODO: We'd prefer to require that overlays (like the Overlay base
              // class) make use of delegatesFocus via DelegateFocusMixin, which would
              // let us drop the need for this mixin here to do anything special with
              // focus. However, an initial trial of this revealed an issue in
              // MenuButton, where invoking the menu did not put the focus on the first
              // menu item as expected. Needs more investigation.
              const focusElement = firstFocusableElement(this);
              if (focusElement) {
                focusElement.focus();
              }
            } else {
              // Closed
              if (this[restoreFocusToElementKey]) {
                // Restore focus to the element that had the focus before the overlay was
                // opened.
                this[restoreFocusToElementKey].focus();
                this[restoreFocusToElementKey] = null;
              }
            }
          }
        }

        // If we're finished closing an overlay that was automatically added to the
        // document, remove it now. Note: we only do this when the component
        // updates, not when it mounts, because we don't want an automatically-added
        // element to be immediately removed during its connectedCallback.
        if (
          !this[firstRender$1] &&
          !this[state$1].persistent &&
          this.closeFinished &&
          this[appendedToDocumentKey]
        ) {
          this[appendedToDocumentKey] = false;
          if (this.parentNode) {
            this.parentNode.removeChild(this);
          }
        }
      }
    }

    return Overlay;
  }

  // Pick a default z-index, remember it, and apply it.
  function bringToFront(element) {
    const defaultZIndex = maxZIndexInUse() + 1;
    element[defaultZIndexKey] = defaultZIndex;
    element.style.zIndex = defaultZIndex.toString();
  }

  /**
   * If the element has or inherits an explicit numeric z-index, return true.
   * Otherwise, return false.
   *
   * @private
   * @param {HTMLElement} element
   * @returns {boolean}
   */
  function hasZIndex(element) {
    const computedZIndex = getComputedStyle(element).zIndex;
    const explicitZIndex = element.style.zIndex;
    const isExplicitZIndexNumeric = !isNaN(parseInt(explicitZIndex));
    if (computedZIndex === "auto") {
      return isExplicitZIndexNumeric;
    }
    if (computedZIndex === "0" && !isExplicitZIndexNumeric) {
      // Might be on Safari, which reports a computed z-index of zero even in
      // cases where no z-index has been inherited but the element creates a
      // stacking context. Inspect the composed tree parent to infer whether the
      // element is really inheriting a z-index.
      const parent =
        element.assignedSlot ||
        (element instanceof ShadowRoot ? element.host : element.parentNode);
      if (!(parent instanceof HTMLElement)) {
        // Theoretical edge case, assume zero z-index is real.
        return true;
      }
      if (!hasZIndex(parent)) {
        // The parent doesn't have a numeric z-index, and the element itself
        // doesn't have a numeric z-index, so the "0" value for the computed
        // z-index is simulated, not a real assigned numeric z-index.
        return false;
      }
    }
    // Element has a non-zero numeric z-index.
    return true;
  }

  /*
   * Return the highest z-index currently in use in the document's light DOM.
   *
   * This calculation looks at all light DOM elements, so is theoretically
   * expensive. That said, it only runs when an overlay is opening, and is only used
   * if an overlay doesn't have a z-index already. In cases where performance is
   * an issue, this calculation can be completely circumvented by manually
   * applying a z-index to an overlay.
   */
  function maxZIndexInUse() {
    const elements = document.body.querySelectorAll("*");
    const zIndices = Array.from(elements, element => {
      const style = getComputedStyle(element);
      let zIndex = 0;
      if (style.position !== "static" && style.zIndex !== "auto") {
        const parsed = style.zIndex ? parseInt(style.zIndex) : 0;
        zIndex = !isNaN(parsed) ? parsed : 0;
      }
      return zIndex;
    });
    return Math.max(...zIndices);
  }

  // TODO: We'd like to use DelegateFocusMixin in this component, but see the note
  // at OverlayMixin's openedChanged function.
  const Base$4 = OpenCloseMixin(OverlayMixin(SlotContentMixin(ReactiveElement)));

  /**
   * An element that appears over other page elements
   *
   * The main overlay content is presented within a frame on top of an optional
   * backdrop.
   *
   * The overlay logic is provided by [OverlayMixin](OverlayMixin). `Overlay` adds
   * the definition of customizable element tags: [frameTag](#frameTag) for the
   * frame around the overlay content, and [backdropTag](#backdropTag) (if
   * defined) for the optional element covering the page elements behind the
   * overlay.
   *
   * As a convenience, the `open` method of `Overlay` will automatically add the
   * overlay to the end of the document body if the overlay isn't already in the
   * document. If the overlay is automatically attached in this way, then when it
   * closes, it will automatically be removed.
   *
   * See [Dialog](Dialog) and [Popup](Popup) for modal and modeless subclasses,
   * respectively.
   *
   * @inherits ReactiveElement
   * @mixes OpenCloseMixin
   * @mixes OverlayMixin
   * @mixes SlotContentMixin
   * @part {Backdrop} backdrop - the backdrop behind the overlay
   * @part {OverlayFrame} frame - the frame around the overlay
   */
  class Overlay extends Base$4 {
    get backdrop() {
      return this[ids$1] && this[ids$1].backdrop;
    }

    /**
     * The class or tag used for the `backdrop` part - the optional
     * element shown behind the overlay.
     *
     * This can help focus the user's attention on the overlay content.
     * Additionally, a backdrop can be used to absorb clicks on background page
     * elements. For example, [Dialog](Dialog) uses [ModalBackdrop](ModalBackdrop)
     * as an overlay backdrop in such a way.
     *
     * @type {PartDescriptor}
     * @default Backdrop
     */
    get backdropPartType() {
      return this[state$1].backdropPartType;
    }
    set backdropPartType(backdropPartType) {
      this[setState$1]({ backdropPartType });
    }

    get [defaultState$1]() {
      return Object.assign(super[defaultState$1], {
        backdropPartType: Backdrop,
        framePartType: OverlayFrame
      });
    }

    get frame() {
      return this[ids$1].frame;
    }

    /**
     * The class or tag used to create the `frame` part – the overlay's
     * primary content.
     *
     * The frame element can be used to provide a border around the overlay
     * content, and to provide visual effects such as a drop-shadow to help
     * distinguish overlay content from background page elements.
     *
     * @type {PartDescriptor}
     * @default OverlayFrame
     */
    get framePartType() {
      return this[state$1].framePartType;
    }
    set framePartType(framePartType) {
      this[setState$1]({ framePartType });
    }

    [render$1](/** @type {ChangedFlags} */ changed) {
      super[render$1](changed);
      renderParts(this[shadowRoot$1], this[state$1], changed);
    }

    [rendered$1](/** @type {ChangedFlags} */ changed) {
      super[rendered$1](changed);

      if (changed.opened && this[state$1].content) {
        // If contents know how to size themselves, ask them to check their size.
        this[state$1].content.forEach(element => {
          if (element[checkSize]) {
            element[checkSize]();
          }
        });
      }
    }

    get [template$1]() {
      // TODO: Consider moving frameContent div to Drawer.
      const result = html$1`
      <style>
        :host {
          align-items: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          max-height: 100vh;
          max-width: 100vw;
          outline: none;
          position: fixed;
          -webkit-tap-highlight-color: transparent;
        }

        [part~="frame"] {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          max-height: 100%;
          max-width: 100%;
          overscroll-behavior: contain;
          pointer-events: initial;
          position: relative;
        }

        #frameContent {
          display: flex;
          flex: 1;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
          width: 100%;
        }
      </style>
      <div id="backdrop" part="backdrop" tabindex="-1"></div>
      <div id="frame" part="frame" role="none">
        <div id="frameContent">
          <slot></slot>
        </div>
      </div>
    `;

      renderParts(result.content, this[state$1]);

      return result;
    }
  }

  /**
   * Render parts for the template or an instance.
   *
   * @private
   * @param {DocumentFragment} root
   * @param {PlainObject} state
   * @param {ChangedFlags} [changed]
   */
  function renderParts(root, state, changed) {
    if (!changed || changed.backdropPartType) {
      const { backdropPartType } = state;
      const backdrop = root.getElementById("backdrop");
      if (backdrop) {
        transmute(backdrop, backdropPartType);
      }
    }
    if (!changed || changed.framePartType) {
      const { framePartType } = state;
      const frame = root.getElementById("frame");
      if (frame) {
        transmute(frame, framePartType);
      }
    }
  }

  /** @type {any} */
  const implicitCloseListenerKey = Symbol("implicitCloseListener");

  /**
   * Gives an overlay lightweight popup-style behavior.
   *
   * This mixin expects the component to provide:
   *
   * * An open/close API compatible with `OpenCloseMixin`.
   *
   * The mixin provides these features to the component:
   *
   * * Event handlers that close the element presses the Esc key, moves the focus
   *   outside the element, scrolls the document, resizes the document, or
   *   switches focus away from the document.
   * * A default ARIA role of `alert`.
   *
   * For modal overlays, use `DialogModalityMixin` instead. See the documentation
   * of that mixin for a comparison of modality behaviors.
   *
   * @module PopupModalityMixin
   * @param {Constructor<ReactiveElement>} Base
   */
  function PopupModalityMixin(Base) {
    // The class prototype added by the mixin.
    class PopupModality extends Base {
      constructor() {
        // @ts-ignore
        super();

        // If we lose focus, and the new focus isn't inside us, then close.
        this.addEventListener("blur", blurHandler.bind(this));
      }

      /**
       * True if the popup should close if the user resizes the window.
       *
       * @type {boolean}
       * @default true
       */
      get closeOnWindowResize() {
        return this[state$1].closeOnWindowResize;
      }
      set closeOnWindowResize(closeOnWindowResize) {
        this[setState$1]({ closeOnWindowResize });
      }

      get [defaultState$1]() {
        return Object.assign(super[defaultState$1], {
          closeOnWindowResize: true,
          role: "alert"
        });
      }

      // Close on Esc key.
      [keydown](/** @type {KeyboardEvent} */ event) {
        let handled = false;

        switch (event.key) {
          case "Escape":
            this.close({
              canceled: "Escape"
            });
            handled = true;
            break;
        }

        // Prefer mixin result if it's defined, otherwise use base result.
        return handled || (super.keydown && super.keydown(event)) || false;
      }

      [render$1](/** @type {ChangedFlags} */ changed) {
        if (super[render$1]) {
          super[render$1](changed);
        }
        if (changed.role) {
          // Apply top-level role.
          const { role } = this[state$1];
          this.setAttribute("role", role);
        }
      }

      [rendered$1](/** @type {ChangedFlags} */ changed) {
        if (super[rendered$1]) {
          super[rendered$1](changed);
        }

        if (changed.opened) {
          if (this.opened) {
            // Wait before wiring up events – if the popup was opened because the
            // user clicked something, that opening click event may still be
            // bubbling up, and we only want to start listening after it's been
            // processed. Alternatively, if the popup caused the page to scroll, we
            // don't want to immediately close because the page scrolled (only if
            // the user scrolls).
            const callback =
              "requestIdleCallback" in window
                ? window["requestIdleCallback"]
                : setTimeout;
            callback(() => {
              // It's conceivable the popup was closed before the timeout completed,
              // so double-check that it's still opened before listening to events.
              if (this.opened) {
                addEventListeners(this);
              }
            });
          } else {
            removeEventListeners(this);
          }
        }
      }

      // Setting the standard role attribute will invoke this property setter,
      // which will allow us to update our state.
      get role() {
        return super.role;
      }
      set role(role) {
        super.role = role;
        if (!this[rendering$1]) {
          this[setState$1]({ role });
        }
      }
    }

    return PopupModality;
  }

  function addEventListeners(/** @type {ReactiveElement} */ element) {
    // Close handlers for window events.
    element[implicitCloseListenerKey] = closeHandler.bind(element);

    // Window blur event tracks loss of focus of *window*, not just element.
    window.addEventListener("blur", element[implicitCloseListenerKey]);
    window.addEventListener("resize", element[implicitCloseListenerKey]);
    window.addEventListener("scroll", element[implicitCloseListenerKey]);
  }

  function removeEventListeners(/** @type {ReactiveElement} */ element) {
    if (element[implicitCloseListenerKey]) {
      window.removeEventListener("blur", element[implicitCloseListenerKey]);
      window.removeEventListener("resize", element[implicitCloseListenerKey]);
      window.removeEventListener("scroll", element[implicitCloseListenerKey]);
      element[implicitCloseListenerKey] = null;
    }
  }

  async function blurHandler(/** @type {Event} */ event) {
    // @ts-ignore
    /** @type {any} */ const element = this;
    // What has the focus now?
    const newFocusedElement =
      /** @type {any} */ (event).relatedTarget || document.activeElement;
    /** @type {any} */
    if (
      newFocusedElement instanceof Element &&
      !deepContains(element, newFocusedElement)
    ) {
      element[raiseChangeEvents$1] = true;
      await element.close();
      element[raiseChangeEvents$1] = false;
    }
  }

  async function closeHandler(/** @type {Event} */ event) {
    // @ts-ignore
    /** @type {any} */ const element = this;
    const handleEvent =
      event.type !== "resize" || element[state$1].closeOnWindowResize;
    if (!ownEvent(element, event) && handleEvent) {
      element[raiseChangeEvents$1] = true;
      await element.close();
      element[raiseChangeEvents$1] = false;
    }
  }

  const Base$5 = KeyboardMixin(PopupModalityMixin(Overlay));

  /**
   * Lightweight form of modeless overlay that can be easily dismissed
   *
   * When opened, the popup displays its children on top of other page elements.
   *
   * @inherits Overlay
   * @mixes KeyboardMixin
   * @mixes PopupModalityMixin
   */
  class Popup extends Base$5 {
    [render$1](/** @type {ChangedFlags} */ changed) {
      super[render$1](changed);
      if (changed.backdropPartType) {
        this[ids$1].backdrop.addEventListener(
          "mousedown",
          mousedownHandler.bind(this)
        );

        // Mobile Safari doesn't seem to generate a mousedown handler on the
        // backdrop in some cases that Mobile Chrome handles. For completeness, we
        // also listen to touchend.
        if (!("PointerEvent" in window)) {
          this[ids$1].backdrop.addEventListener(
            "touchend",
            mousedownHandler
          );
        }
      }
    }
  }

  /**
   * @private
   * @param {Event} event
   */
  async function mousedownHandler(event) {
    // @ts-ignore
    const element = this;
    element[raiseChangeEvents$1] = true;
    await element.close();
    element[raiseChangeEvents$1] = false;
    event.preventDefault();
    event.stopPropagation();
  }

  const resizeListenerKey = Symbol("resizeListener");

  const Base$6 = AriaRoleMixin(
    DisabledMixin(
      FocusVisibleMixin(LanguageDirectionMixin(OpenCloseMixin(ReactiveElement)))
    )
  );

  /**
   * Positions a popup with respect to a source element
   *
   * @inherits ReactiveElement
   * @mixes AriaRoleMixin
   * @mixes DisabledMixin
   * @mixes FocusVisibleMixin
   * @mixes KeyboardMixin
   * @mixes OpenCloseMixin
   * @part {Popup} popup - the popup element
   * @part {button} source - the element used as the reference point for positioning the popup, generally the element that invokes the popup
   */
  class PopupSource extends Base$6 {
    get [defaultState$1]() {
      return Object.assign(super[defaultState$1], {
        horizontalAlign: "start",
        popupHeight: null,
        popupMeasured: false,
        popupPosition: "below",
        popupPartType: Popup,
        popupWidth: null,
        role: "none",
        roomAbove: null,
        roomBelow: null,
        roomLeft: null,
        roomRight: null,
        sourcePartType: "div"
      });
    }

    get frame() {
      return /** @type {any} */ (this[ids$1].popup).frame;
    }

    /**
     * The alignment of the popup with respect to the source button.
     *
     * * `start`: popup and source are aligned on the leading edge according to
     *   the text direction
     * * `end`: popup and source are aligned on the trailing edge according to the
     *   text direction
     * * `left`: popup and source are left-aligned
     * * `right`: popup and source are right-aligned
     * * `stretch: both left and right edges are aligned
     *
     * @type {('start'|'end'|'left'|'right'|'stretch')}
     * @default 'start'
     */
    get horizontalAlign() {
      return this[state$1].horizontalAlign;
    }
    set horizontalAlign(horizontalAlign) {
      this[setState$1]({ horizontalAlign });
    }

    [render$1](/** @type {ChangedFlags} */ changed) {
      super[render$1](changed);

      renderParts$1(this[shadowRoot$1], this[state$1], changed);

      if (this[firstRender$1]) {
        this.setAttribute("aria-haspopup", "true");
      }

      if (changed.popupPartType) {
        // Popup's opened state becomes our own opened state.
        this[ids$1].popup.addEventListener("opened", () => {
          if (!this.opened) {
            this[raiseChangeEvents$1] = true;
            this.open();
            this[raiseChangeEvents$1] = false;
          }
        });

        // Popup's closed state becomes our own closed state.
        this[ids$1].popup.addEventListener("closed", event => {
          if (!this.closed) {
            this[raiseChangeEvents$1] = true;
            /** @type {any} */

            const cast = event;
            const closeResult = cast.detail.closeResult;
            this.close(closeResult);
            this[raiseChangeEvents$1] = false;
          }
        });
      }

      if (
        changed.horizontalAlign ||
        changed.popupMeasured ||
        changed.rightToLeft
      ) {
        const {
          horizontalAlign,
          popupHeight,
          popupMeasured,
          popupPosition,
          popupWidth,
          rightToLeft,
          roomAbove,
          roomBelow,
          roomLeft,
          roomRight
        } = this[state$1];

        const fitsAbove = popupHeight <= roomAbove;
        const fitsBelow = popupHeight <= roomBelow;
        const canLeftAlign = popupWidth <= roomRight;
        const canRightAlign = popupWidth <= roomLeft;

        const preferPositionBelow = popupPosition === "below";

        // We respect each position popup preference (above/below/right/right) if
        // there's room in that direction. Otherwise, we use the horizontal/vertical
        // position that maximizes the popup width/height.
        const positionBelow =
          (preferPositionBelow && (fitsBelow || roomBelow >= roomAbove)) ||
          (!preferPositionBelow && !fitsAbove && roomBelow >= roomAbove);
        const fitsVertically =
          (positionBelow && fitsBelow) || (!positionBelow && fitsAbove);
        const maxFrameHeight = fitsVertically
          ? null
          : positionBelow
          ? roomBelow
          : roomAbove;

        // Position popup.
        const bottom = positionBelow ? null : 0;

        let left;
        let right;
        let maxFrameWidth;
        if (horizontalAlign === "stretch") {
          left = 0;
          right = 0;
          maxFrameWidth = null;
        } else {
          const preferLeftAlign =
            horizontalAlign === "left" ||
            (rightToLeft
              ? horizontalAlign === "end"
              : horizontalAlign === "start");
          // The above/below preference rules also apply to left/right alignment.
          const alignLeft =
            (preferLeftAlign && (canLeftAlign || roomRight >= roomLeft)) ||
            (!preferLeftAlign && !canRightAlign && roomRight >= roomLeft);
          left = alignLeft ? 0 : null;
          right = !alignLeft ? 0 : null;

          const fitsHorizontally =
            (alignLeft && roomRight) || (!alignLeft && roomLeft);
          maxFrameWidth = fitsHorizontally
            ? null
            : alignLeft
            ? roomRight
            : roomLeft;
        }

        // Until we've measured the rendered position of the popup, render it in
        // fixed position (so it doesn't affect page layout or scrolling), and don't
        // make it visible yet. If we use `visibility: hidden` for this purpose, the
        // popup won't be able to receive the focus. Instead, we use zero opacity as
        // a way to make the popup temporarily invisible until we have checked where
        // it fits.
        const opacity = popupMeasured ? null : 0;
        const position = popupMeasured ? "absolute" : "fixed";

        const popup = this[ids$1].popup;
        Object.assign(popup.style, {
          bottom,
          left,
          opacity,
          position,
          right
        });
        const frame = /** @type {any} */ (popup).frame;
        Object.assign(frame.style, {
          maxHeight: maxFrameHeight ? `${maxFrameHeight}px` : null,
          maxWidth: maxFrameWidth ? `${maxFrameWidth}px` : null
        });
        this[ids$1].popupContainer.style.top = positionBelow ? "" : "0";
      }

      if (changed.opened) {
        const { opened } = this[state$1];
        /** @type {any} */ (this[ids$1].popup).opened = opened;
        this.setAttribute("aria-expanded", opened.toString());
      }

      if (changed.disabled) {
        if ("disabled" in this[ids$1].source) {
          const { disabled } = this[state$1];
          /** @type {any} */ (this[ids$1].source).disabled = disabled;
        }
      }
    }

    [rendered$1](/** @type {ChangedFlags} */ changed) {
      super[rendered$1](changed);
      if (changed.opened) {
        if (this.opened) {
          // Worth noting that's possible (but unusual) for a popup to render opened
          // on first render.
          waitThenRenderOpened(this);
        } else {
          removeEventListeners$1(this);
        }
      } else if (this.opened && !this[state$1].popupMeasured) {
        // Need to recalculate popup measurements.
        measurePopup(this);
      }
    }

    /**
     * The preferred direction for the popup.
     *
     * * `above`: popup should appear above the source
     * * `below`: popup should appear below the source
     *
     * @type {('above'|'below')}
     * @default 'below'
     */
    get popupPosition() {
      return this[state$1].popupPosition;
    }
    set popupPosition(popupPosition) {
      this[setState$1]({ popupPosition });
    }

    /**
     * The class or tag used to create the `popup` part – the element
     * responsible for displaying the popup and handling overlay behavior.
     *
     * @type {PartDescriptor}
     * @default Popup
     */
    get popupPartType() {
      return this[state$1].popupPartType;
    }
    set popupPartType(popupPartType) {
      this[setState$1]({ popupPartType });
    }

    /**
     * The class or tag used to create the `source` part - the button
     * (or other element) the user can tap/click to invoke the popup.
     *
     * @type {PartDescriptor}
     * @default 'button'
     */
    get sourcePartType() {
      return this[state$1].sourcePartType;
    }
    set sourcePartType(sourcePartType) {
      this[setState$1]({ sourcePartType });
    }

    [stateEffects$1](state, changed) {
      const effects = super[stateEffects$1](state, changed);

      // Closing popup resets our calculations of popup size and room.
      if (changed.opened && !state.opened) {
        Object.assign(effects, {
          popupHeight: null,
          popupMeasured: false,
          popupWidth: null,
          roomAbove: null,
          roomBelow: null,
          roomLeft: null,
          roomRight: null
        });
      }

      return effects;
    }

    get [template$1]() {
      const result = html$1`
      <style>
        :host {
          display: inline-block;
          position: relative;
        }

        [part~="source"] {
          height: 100%;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          width: 100%;
        }

        #popupContainer {
          height: 0;
          outline: none;
          position: absolute;
          width: 100%;
        }

        [part~="popup"] {
          align-items: initial;
          height: initial;
          justify-content: initial;
          left: initial;
          outline: none;
          position: absolute;
          top: initial;
          width: initial;
        }
      </style>
      <div id="source" part="source">
        <slot name="source"></slot>
      </div>
      <div id="popupContainer" role="none">
        <div id="popup" part="popup" exportparts="backdrop, frame" role="none">
          <slot></slot>
        </div>
      </div>
    `;

      renderParts$1(result.content, this[state$1]);

      return result;
    }
  }

  function addEventListeners$1(/** @type {PopupSource} */ element) {
    /** @type {any} */ const cast = element;
    cast[resizeListenerKey] = () => {
      measurePopup(element);
    };
    window.addEventListener("resize", cast[resizeListenerKey]);
  }

  /**
   * If we haven't already measured the popup since it was opened, measure its
   * dimensions and the relevant distances in which the popup might be opened.
   *
   * @private
   * @param {PopupSource} element
   */
  function measurePopup(element) {
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const popupRect = element[ids$1].popup.getBoundingClientRect();
    const sourceRect = element.getBoundingClientRect();
    element[setState$1]({
      popupHeight: popupRect.height,
      popupMeasured: true,
      popupWidth: popupRect.width,
      roomAbove: sourceRect.top,
      roomBelow: Math.ceil(windowHeight - sourceRect.bottom),
      roomLeft: sourceRect.right,
      roomRight: Math.ceil(windowWidth - sourceRect.left),
      windowHeight,
      windowWidth
    });
  }

  function removeEventListeners$1(/** @type {PopupSource} */ element) {
    /** @type {any} */ const cast = element;
    if (cast[resizeListenerKey]) {
      window.removeEventListener("resize", cast[resizeListenerKey]);
      cast[resizeListenerKey] = null;
    }
  }

  /**
   * Render parts for the template or an instance.
   *
   * @private
   * @param {DocumentFragment} root
   * @param {PlainObject} state
   * @param {ChangedFlags} [changed]
   */
  function renderParts$1(root, state, changed) {
    if (!changed || changed.popupPartType) {
      const { popupPartType } = state;
      const popup = root.getElementById("popup");
      if (popup) {
        transmute(popup, popupPartType);
      }
    }
    if (!changed || changed.sourcePartType) {
      const { sourcePartType } = state;
      const source = root.getElementById("source");
      if (source) {
        transmute(source, sourcePartType);
      }
    }
  }

  /**
   *
   * When a popup is first rendered, we let it render invisibly so that it doesn't
   * affect the page layout.
   *
   * We then wait, for two reasons:
   *
   * 1) We need to give the popup time to render invisibly. That lets us get the
   *    true size of the popup content.
   *
   * 2) Wire up events that can dismiss the popup. If the popup was opened because
   *    the user clicked something, that opening click event may still be bubbling
   *    up, and we only want to start listening after it's been processed.
   *    Along the same lines, if the popup caused the page to scroll, we don't
   *    want to immediately close because the page scrolled (only if the user
   *    scrolls).
   *
   * After waiting, we can take care of both of the above tasks.
   *
   * @private
   * @param {PopupSource} element
   */
  function waitThenRenderOpened(element) {
    // Wait a tick to let the newly-opened component actually render.
    setTimeout(() => {
      // It's conceivable the popup was closed before the timeout completed,
      // so double-check that it's still opened before listening to events.
      if (element.opened) {
        measurePopup(element);
        addEventListeners$1(element);
      }
    });
  }

  const Base$7 = KeyboardMixin(PopupSource);

  /**
   * A button that invokes an attached popup
   *
   * @inherits PopupSource
   * @mixes KeyboardMixin
   */
  class PopupButton extends Base$7 {
    get [defaultState$1]() {
      return Object.assign(super[defaultState$1], {
        role: "button",
        sourcePartType: "button"
      });
    }

    [keydown](/** @type {KeyboardEvent} */ event) {
      let handled;

      switch (event.key) {
        // Space or Up/Down arrow keys open the popup.
        case " ":
        case "ArrowDown":
        case "ArrowUp":
          if (this.closed) {
            this.open();
            handled = true;
          }
          break;
      }

      // Prefer mixin result if it's defined, otherwise use base result.
      return (
        handled || (super[keydown] && super[keydown](event))
      );
    }

    [render$1](/** @type {ChangedFlags} */ changed) {
      super[render$1](changed);

      if (this[firstRender$1]) {
        // If the top-level element gets the focus while the popup is open, the
        // most likely expanation is that the user hit Shift+Tab to back up out of
        // the popup. In that case, we should close.
        this.addEventListener("focus", async event => {
          const hostFocused = !ownEvent(this[ids$1].popup, event);
          // It's possible to get a focus event in the initial mousedown on the
          // source button before the popup is even rendered. We don't want to
          // close in that case, so we check to see if we've already measured the
          // popup dimensions (which will be true if the popup fully completed
          // rendering).
          const measured = this[state$1].popupHeight !== null;
          if (hostFocused && this.opened && measured) {
            this[raiseChangeEvents$1] = true;
            await this.close();
            this[raiseChangeEvents$1] = false;
          }
        });
      }

      if (changed.sourcePartType) {
        // Desktop popups generally open on mousedown, not click/mouseup. On mobile,
        // mousedown won't fire until the user releases their finger, so it behaves
        // like a click.
        const source = this[ids$1].source;
        source.addEventListener("mousedown", event => {
          // mousedown events fire even if button is disabled, so we need
          // to explicitly ignore those.
          if (this.disabled) {
            event.preventDefault();
            return;
          }
          // Only handle primary button mouse down to avoid interfering with
          // right-click behavior.
          /** @type {any} */
          const cast = event;
          if (cast.button && cast.button !== 0) {
            return;
          }
          // We give the default focus behavior time to run before opening the
          // popup. See note below.
          setTimeout(() => {
            if (!this.opened) {
              this[raiseChangeEvents$1] = true;
              this.open();
              this[raiseChangeEvents$1] = false;
            }
          });
          event.stopPropagation();
          // We don't prevent the default behavior for mousedown. Among other
          // things, it sets the focus to the element the user moused down on.
          // That's important for us, because OverlayMixin will remember that
          // focused element (i.e., this element) when opening, and restore focus to
          // it when the popup closes.
        });
        source.tabIndex = -1;
      }
    }

    get [template$1]() {
      const result = super[template$1];
      result.content.append(
        html`
        <style>
          [part~="source"] {
            cursor: default;
            outline: none;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
            -moz-user-select: none;
            -ms-user-select: none;
            -webkit-user-select: none;
            user-select: none;
          }
        </style>
      `
      );
      return result;
    }
  }

  /**
   * An element that can point up or down.
   *
   * @part down-icon - the icon shown in the toggle if the popup will open or close in the down direction
   * @part up-icon - the icon shown in the toggle if the popup will open or close in the up direction
   */
  class UpDownToggle extends ReactiveElement {
    get [defaultState$1]() {
      return Object.assign(super[defaultState$1], {
        direction: "down",
        disabled: false
      });
    }

    /**
     * Indicates which direction the element should point to.
     *
     * @type {'down'|'up'}
     * @default 'down'
     */
    get direction() {
      return this[state$1].direction;
    }
    set direction(direction) {
      this[setState$1]({ direction });
    }

    get disabled() {
      return this[state$1].disabled;
    }
    set disabled(disabled) {
      this[setState$1]({ disabled });
    }

    [render$1](/** @type {ChangedFlags} */ changed) {
      super[render$1](changed);

      if (changed.direction) {
        const { direction } = this[state$1];
        this[ids$1].downIcon.style.display =
          direction === "down" ? "block" : "none";
        this[ids$1].upIcon.style.display =
          direction === "up" ? "block" : "none";
      }

      if (changed.disabled) {
        const { disabled } = this[state$1];
        this.toggleAttribute("disabled", disabled);
      }
    }

    get [template$1]() {
      return html$1`
      <div id="downIcon" part="down-icon">
        <slot name="down-icon"></slot>
      </div>
      <div id="upIcon" part="up-icon">
        <slot name="up-icon"></slot>
      </div>
    `;
    }
  }

  const documentMouseupListenerKey = Symbol("documentMouseupListener");

  /**
   * A button that invokes a menu.
   *
   * @inherits PopupButtonBase
   * @part {Menu} menu - the menu shown in the popup
   * @part {UpDownToggle} popup-toggle - the element that lets the user know they can open the popup
   * @part down-icon - the icon shown in the toggle if the popup will open or close in the down direction
   * @part up-icon - the icon shown in the toggle if the popup will open or close in the up direction
   */
  class MenuButton extends PopupButton {
    connectedCallback() {
      super.connectedCallback();
      // Handle edge case where component is opened, removed, then added back.
      listenIfOpenAndConnected(this);
    }

    // The index that will be selected by default when the menu opens.
    get defaultMenuSelectedIndex() {
      return -1;
    }

    get [defaultState$1]() {
      return Object.assign(super[defaultState$1], {
        dragSelect: true,
        menuPartType: Menu,
        menuSelectedIndex: -1,
        selectedItem: null,
        popupTogglePartType: UpDownToggle,
        touchstartX: null,
        touchstartY: null
      });
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
      listenIfOpenAndConnected(this);
    }

    /**
     * Highlight the selected item (if one exists), then close the menu.
     */
    async highlightSelectedItemAndClose() {
      const raiseChangeEvents = this[raiseChangeEvents$1];
      const selectionDefined = this[state$1].menuSelectedIndex >= 0;
      const closeResult = selectionDefined
        ? this.items[this[state$1].menuSelectedIndex]
        : undefined;
      /** @type {any} */ const menu = this[ids$1].menu;
      if (selectionDefined && "highlightSelectedItem" in menu) {
        await menu.highlightSelectedItem();
      }
      const saveRaiseChangeEvents = this[raiseChangeEvents$1];
      this[raiseChangeEvents$1] = raiseChangeEvents;
      await this.close(closeResult);
      this[raiseChangeEvents$1] = saveRaiseChangeEvents;
    }

    get items() {
      /** @type {any} */
      const menu = this[ids$1] && this[ids$1].menu;
      return menu ? menu.items : null;
    }

    /**
     * Invoked when a new item is selected.
     *
     * @param {ListItemElement} item
     */
    itemSelected(item) {
      if (this[raiseChangeEvents$1]) {
        /**
         * Raised when the user has moved the selection to a new menu item. This
         * event is raised while the menu is still open. To check which item the
         * user selected from a menu, listen to the `closed` event and inspect the
         * event `details` object for its `closeResult` member.
         *
         * @event menu-item-selected
         */
        const event = new CustomEvent("menu-item-selected", {
          detail: {
            selectedItem: item
          }
        });
        this.dispatchEvent(event);
      }
    }

    [keydown](/** @type {KeyboardEvent} */ event) {
      switch (event.key) {
        // Enter toggles popup.
        case "Enter":
          if (this.opened) {
            this.highlightSelectedItemAndClose();
            return true;
          } else {
            this.open();
            return true;
          }
      }

      // Give superclass a chance to handle.
      const base = super[keydown] && super[keydown](event);
      if (base) {
        return true;
      }

      if (this.opened && !event.metaKey && !event.altKey) {
        // If they haven't already been handled, absorb keys that might cause the
        // page to scroll in the background, which would in turn cause the popup to
        // inadvertently close.
        switch (event.key) {
          case "ArrowDown":
          case "ArrowLeft":
          case "ArrowRight":
          case "ArrowUp":
          case "End":
          case "Home":
          case "PageDown":
          case "PageUp":
          case " ":
            return true;
        }
      }

      return false;
    }

    /**
     * The class or tag used to define the `menu` part – the element
     * presenting the menu items and handling navigation between them.
     *
     * @type {PartDescriptor}
     * @default Menu
     */
    get menuPartType() {
      return this[state$1].menuPartType;
    }
    set menuPartType(menuPartType) {
      this[setState$1]({ menuPartType });
    }

    /**
     * The class or tag used to create the `popup-toggle` part – the
     * element that lets the user know they can open the popup.
     *
     * @type {PartDescriptor}
     * @default UpDownToggle
     */
    get popupTogglePartType() {
      return this[state$1].popupTogglePartType;
    }
    set popupTogglePartType(popupTogglePartType) {
      this[setState$1]({ popupTogglePartType });
    }

    [render$1](/** @type {ChangedFlags} */ changed) {
      super[render$1](changed);

      renderParts$2(this[shadowRoot$1], this[state$1], changed);

      if (this[firstRender$1]) {
        // If the user hovers over an item, select it.
        this.addEventListener("mousemove", event => {
          const target = event.target;
          if (target && target instanceof Node) {
            const hoverIndex = indexOfItemContainingTarget(this.items, target);
            if (hoverIndex !== this[state$1].menuSelectedIndex) {
              this[raiseChangeEvents$1] = true;
              this[setState$1]({
                menuSelectedIndex: hoverIndex
              });
              this[raiseChangeEvents$1] = false;
            }
          }
        });
      }

      if (changed.popupPartType) {
        this[ids$1].popup.tabIndex = -1;
      }

      if (changed.menuPartType) {
        // Close the popup if menu loses focus.
        this[ids$1].menu.addEventListener("blur", async event => {
          /** @type {any} */
          const cast = event;
          const newFocusedElement = cast.relatedTarget || document.activeElement;
          if (
            this.opened &&
            !deepContains(this[ids$1].menu, newFocusedElement)
          ) {
            this[raiseChangeEvents$1] = true;
            await this.close();
            this[raiseChangeEvents$1] = false;
          }
        });

        // mousedown events on the menu will propagate up to the top-level element,
        // which will then steal the focus. We want to keep the focus on the menu,
        // both to permit keyboard use, and to avoid closing the menu on blur (see
        // separate blur handler). To keep the focus on the menu, we prevent the
        // default event behavior.
        this[ids$1].menu.addEventListener("mousedown", event => {
          // Only process events for the main (usually left) button.
          if (/** @type {MouseEvent} */ (event).button !== 0) {
            return;
          }
          if (this.opened) {
            event.stopPropagation();
            event.preventDefault();
          }
        });

        // If the user mouses up on a menu item, close the menu with that item as
        // the close result.
        this[ids$1].menu.addEventListener("mouseup", async event => {
          // If we're doing a drag-select (user moused down on button, dragged
          // mouse into menu, and released), we close. If we're not doing a
          // drag-select (the user opened the menu with a complete click), and
          // there's a selection, they clicked on an item, so also close.
          // Otherwise, the user clicked the menu open, then clicked on a menu
          // separator or menu padding; stay open.
          const menuSelectedIndex = this[state$1].menuSelectedIndex;
          if (this[state$1].dragSelect || menuSelectedIndex >= 0) {
            // We don't want the document mouseup handler to close
            // before we've asked the menu to highlight the selection.
            // We need to stop event propagation here, before we enter
            // any async code, to actually stop propagation.
            event.stopPropagation();
            this[raiseChangeEvents$1] = true;
            await this.highlightSelectedItemAndClose();
            this[raiseChangeEvents$1] = false;
          } else {
            event.stopPropagation();
          }
        });

        // Track changes in the menu's selection state.
        this[ids$1].menu.addEventListener(
          "selected-index-changed",
          event => {
            this[raiseChangeEvents$1] = true;
            /** @type {any} */
            const cast = event;
            this[setState$1]({
              menuSelectedIndex: cast.detail.selectedIndex
            });
            this[raiseChangeEvents$1] = false;
          }
        );
      }

      // Tell the toggle which direction it should point to depending on which
      // direction the popup will open.
      if (changed.popupPosition || changed.popupTogglePartType) {
        const { popupPosition } = this[state$1];
        const direction = popupPosition === "below" ? "down" : "up";
        /** @type {any} */ const popupToggle = this[ids$1].popupToggle;
        if ("direction" in popupToggle) {
          popupToggle.direction = direction;
        }
      }

      if (changed.disabled) {
        const { disabled } = this[state$1];
        /** @type {any} */ (this[ids$1].popupToggle).disabled = disabled;
      }

      if (changed.menuSelectedIndex) {
        const menu = /** @type {any} */ (this[ids$1].menu);
        if ("selectedIndex" in menu) {
          menu.selectedIndex = this[state$1].menuSelectedIndex;
        }
      }
    }

    [rendered$1](/** @type {ChangedFlags} */ changed) {
      super[rendered$1](changed);

      if (changed.menuSelectedIndex) {
        const selectedItem =
          this[state$1].menuSelectedIndex >= 0
            ? this.items[this[state$1].menuSelectedIndex]
            : null;
        this.itemSelected(selectedItem);
      }

      if (changed.opened) {
        listenIfOpenAndConnected(this);
      }
    }

    [stateEffects$1](state, changed) {
      const effects = super[stateEffects$1](state, changed);

      // Set things when opening, or reset things when closing.
      if (changed.opened) {
        if (state.opened) {
          // Opening
          Object.assign(effects, {
            // Until we get a mouseup, we're doing a drag-select.
            dragSelect: true,

            // Select the default item in the menu.
            menuSelectedIndex: this.defaultMenuSelectedIndex,

            // Clear any previously selected item.
            selectedItem: null,

            // Clear previous touchstart point.
            touchStartX: null,
            touchStartY: null
          });
        } else {
          // Closing
          Object.assign(effects, {
            // Clear menu selection.
            menuSelectedIndex: -1
          });
        }
      }

      return effects;
    }

    get [template$1]() {
      const result = super[template$1];

      // Wrap default slot with a menu.
      const defaultSlot = result.content.querySelector("slot:not([name])");
      if (defaultSlot) {
        defaultSlot.replaceWith(html`
        <div id="menu" part="menu">
          <slot></slot>
        </div>
      `);
      }

      // Inject a toggle button into the source slot.
      const sourceSlot = result.content.querySelector('slot[name="source"]');
      if (sourceSlot) {
        sourceSlot.append(html`
        <div
          id="popupToggle"
          part="popup-toggle"
          exportparts="down-icon up-icon"
          tabindex="-1"
        >
          <slot name="toggle-icon"></slot>
        </div>
      `);
      }

      renderParts$2(result.content, this[state$1]);

      result.content.append(html`
      <style>
        [part~="menu"] {
          max-height: 100%;
        }

        [part~="source"] {
          align-items: center;
          display: flex;
        }
      </style>
    `);

      return result;
    }
  }

  async function handleMouseup(/** @type {MouseEvent} */ event) {
    // @ts-ignore
    const element = this;
    const hitTargets = element[shadowRoot$1].elementsFromPoint(
      event.clientX,
      event.clientY
    );
    const overSource = hitTargets.indexOf(element[ids$1].source) >= 0;
    if (element.opened) {
      if (overSource) {
        // User released the mouse over the source button (behind the
        // backdrop), so we're no longer doing a drag-select.
        if (element[state$1].dragSelect) {
          element[raiseChangeEvents$1] = true;
          element[setState$1]({
            dragSelect: false
          });
          element[raiseChangeEvents$1] = false;
        }
      } else {
        // If we get to this point, the user released over the backdrop with
        // the popup open, so close.
        element[raiseChangeEvents$1] = true;
        await element.close();
        element[raiseChangeEvents$1] = false;
      }
    }
  }

  function listenIfOpenAndConnected(element) {
    if (element[state$1].opened && element.isConnected) {
      // If the popup is open and user releases the mouse over the backdrop, close
      // the popup. We need to listen to mouseup on the document, not this
      // element. If the user mouses down on the source, then moves the mouse off
      // the document before releasing the mouse, the element itself won't get the
      // mouseup. The document will, however, so it's a more reliable source of
      // mouse state.
      //
      // Coincidentally, we *also* need to listen to mouseup on the document to
      // tell whether the user released the mouse over the source button. When the
      // user mouses down, the backdrop will appear and cover the source, so from
      // that point on the source won't receive a mouseup event. Again, we can
      // listen to mouseup on the document and do our own hit-testing to see if
      // the user released the mouse over the source.
      if (!element[documentMouseupListenerKey]) {
        // Not listening yet; start.
        element[documentMouseupListenerKey] = handleMouseup.bind(element);
        document.addEventListener("mouseup", element[documentMouseupListenerKey]);
      }
    } else if (element[documentMouseupListenerKey]) {
      // Currently listening; stop.
      document.removeEventListener(
        "mouseup",
        element[documentMouseupListenerKey]
      );
      element[documentMouseupListenerKey] = null;
    }
  }

  /**
   * Render parts for the template or an instance.
   *
   * @private
   * @param {DocumentFragment} root
   * @param {PlainObject} state
   * @param {ChangedFlags} [changed]
   */
  function renderParts$2(root, state, changed) {
    if (!changed || changed.menuPartType) {
      const { menuPartType } = state;
      const menu = root.getElementById("menu");
      if (menu) {
        transmute(menu, menuPartType);
      }
    }
    if (!changed || changed.popupTogglePartType) {
      const { popupTogglePartType } = state;
      const popupToggle = root.getElementById("popupToggle");
      if (popupToggle) {
        transmute(popupToggle, popupTogglePartType);
      }
    }
  }

  /**
   * Menu component in the Plain reference design system
   *
   * @inherits Menu
   */
  class PlainMenu extends Menu {
    get [template$1]() {
      const result = super[template$1];
      result.content.append(
        html`
        <style>
          :host ::slotted(*) {
            padding: 0.25em;
          }
          :host ::slotted([selected]) {
            background: highlight;
            color: highlighttext;
          }

          @media (pointer: coarse) {
            ::slotted(*) {
              padding: 1em;
            }
          }
        </style>
      `
      );
      return result;
    }
  }

  /**
   * OpenCloseToggle component in the Plain reference design system
   *
   * @inherits OpenCloseToggle
   */
  class PlainOpenCloseToggle extends UpDownToggle {
    get [template$1]() {
      const result = super[template$1];

      // Replace the icons with our up/down glyphs.
      const downIcon = result.content.getElementById("downIcon");
      const downIconGlyph = html`
      <svg
        id="downIcon"
        part="toggle-icon down-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 10 5"
      >
        <path d="M 0 0 l5 5 5 -5 z" />
      </svg>
    `.firstElementChild;
      if (downIcon && downIconGlyph) {
        replace(downIcon, downIconGlyph);
      }
      const upIcon = result.content.getElementById("upIcon");
      const upIconGlyph = html`
      <svg
        id="upIcon"
        part="toggle-icon up-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 10 5"
      >
        <path d="M 0 5 l5 -5 5 5 z" />
      </svg>
    `.firstElementChild;
      if (upIcon && upIconGlyph) {
        replace(upIcon, upIconGlyph);
      }

      result.content.append(
        html`
        <style>
          :host([disabled]) {
            opacity: 0.5;
          }

          :host(:not([disabled])):hover {
            background: #eee;
          }

          [part~="toggle-icon"] {
            fill: currentColor;
            height: 10px;
            margin: 0.25em;
            width: 10px;
          }
        </style>
      `
      );
      return result;
    }
  }

  /**
   * Backdrop component in the Plain reference design system
   *
   * @inherits Backdrop
   */
  class PlainBackdrop extends Backdrop {}

  /**
   * OverlayFrame component in the Plain reference design system
   *
   * The default appearance of `OverlayFrame` uses a simple drop-shadow to let the
   * user see the framed content as being on top of the background page content.
   *
   * @inherits OverlayFrame
   */
  class PlainOverlayFrame extends OverlayFrame {
    get [template$1]() {
      const result = super[template$1];
      result.content.append(
        html`
        <style>
          :host {
            background: white;
            border: 1px solid rgba(0, 0, 0, 0.2);
            box-shadow: 0 0px 10px rgba(0, 0, 0, 0.5);
          }
        </style>
      `
      );
      return result;
    }
  }

  /**
   * Popup component in the Plain reference design system
   *
   * @inherits Popup
   * @part {PlainBackdrop} backdrop
   * @part {PlainOverlayFrame} frame
   */
  class PlainPopup extends Popup {
    get [defaultState$1]() {
      return Object.assign(super[defaultState$1], {
        backdropPartType: PlainBackdrop,
        framePartType: PlainOverlayFrame
      });
    }
  }

  /**
   * MenuButton component in the Plain reference design system
   *
   * @inherits MenuButton
   * @part {PlainMenu} menu
   * @part {PlainPopup} popup
   * @part {PlainOpenCloseToggle} popup-toggle
   * @part {PlainBorderButton} source
   */
  class PlainMenuButton extends MenuButton {
    get [defaultState$1]() {
      return Object.assign(super[defaultState$1], {
        menuPartType: PlainMenu,
        popupPartType: PlainPopup,
        popupTogglePartType: PlainOpenCloseToggle,
        sourcePartType: PlainBorderButton
      });
    }

    get [template$1]() {
      const result = super[template$1];
      result.content.append(
        html`
        <style>
          [part~="menu"] {
            background: window;
            border: none;
            padding: 0.5em 0;
          }
        </style>
      `
      );
      return result;
    }
  }

  class ElixMenuButton extends PlainMenuButton {}
  customElements.define("elix-menu-button", ElixMenuButton);

  /**
   * Allows a component to participate in HTML form submission.
   *
   * The mixin expects the component to define a `value` property.
   *
   * @module FormElementMixin
   * @param {Constructor<ReactiveElement>} Base
   */
  function FormElementMixin(Base) {
    // The class prototype added by the mixin.
    class FormElement extends Base {
      constructor() {
        super();
        /** @type {any} */ const cast = this;
        if (!this[nativeInternals$1] && cast.attachInternals) {
          this[nativeInternals$1] = cast.attachInternals();
        }
      }

      checkValidity() {
        return this[nativeInternals$1].checkValidity();
      }

      get [defaultState$1]() {
        return Object.assign(super[defaultState$1], {
          validationMessage: "",
          valid: true
        });
      }

      // Uncomment for debugging only
      get internals() {
        return this[nativeInternals$1];
      }

      static get formAssociated() {
        return true;
      }

      /**
       * The ID of the `form` element with which this element is associated,
       * or `null` if the element is not associated with any form. This is provided
       * for consistency with the native HTML
       * [form](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#form)
       * property.
       *
       * @type {string}
       */
      get form() {
        return this[nativeInternals$1].form;
      }

      /**
       * The name of the form field that will be filled with this element's
       * `value`. This is an analogue of the standard HTML
       * [name](https://developer.mozilla.org/en-US/docs/Web/API/Element/name)
       * property.
       *
       * @type {string}
       */
      get name() {
        return this[state$1].name;
      }
      set name(name) {
        if ("name" in Base.prototype) {
          super.name = name;
        }
        this[setState$1]({ name });
      }

      [render$1](/** @type {ChangedFlags} */ changed) {
        if (super[render$1]) {
          super[render$1](changed);
        }

        // Reflect name property to attribute so form will pick it up.
        if (changed.name) {
          this.setAttribute("name", this[state$1].name);
        }

        if (this[nativeInternals$1]) {
          // Reflect validity state to internals.
          if (changed.valid || changed.validationMessage) {
            const { valid, validationMessage } = this[state$1];
            if (valid) {
              this[nativeInternals$1].setValidity({});
            } else {
              this[nativeInternals$1].setValidity(
                {
                  customError: true
                },
                validationMessage
              );
            }
          }
        }
      }

      [rendered$1](/** @type {ChangedFlags} */ changed) {
        if (super[rendered$1]) {
          super[rendered$1](changed);
        }
        if (changed.value) {
          if (this[nativeInternals$1]) {
            this[nativeInternals$1].setFormValue(
              this[state$1].value,
              this[state$1]
            );
          }
        }
      }

      reportValidity() {
        return this[nativeInternals$1].reportValidity();
      }

      /**
       * The "type" of the form field, provided for consistency with the
       * native HTML
       * [type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type)
       * property. The value of this property will be the same as the HTML tag
       * name registered for the custom element.
       *
       * @type {string}
       */
      get type() {
        return this.localName;
      }

      get validationMessage() {
        return this[state$1].validationMessage;
      }

      get validity() {
        return this[nativeInternals$1].validity;
      }

      get willValidate() {
        return this[nativeInternals$1].willValidate;
      }
    }

    return FormElement;
  }

  const Base$8 = FormElementMixin(
    SelectedItemTextValueMixin(SingleSelectionMixin(SlotItemsMixin(MenuButton)))
  );

  /**
   * Shows a single choice made from a pop-up list of choices
   *
   * @inherits MenuButton
   * @mixes FormElementMixin
   * @mixes SelectedItemTextValueMixin
   * @mixes SingleSelectionMixin
   * @mixes SlotItemsMixin
   * @part {div} value - region inside the toggle button showing the value of the current selection
   */
  class DropdownList extends Base$8 {
    // By default, opening the menu re-selects the component item that's currently
    // selected.
    get defaultMenuSelectedIndex() {
      return this[state$1].selectedIndex;
    }

    get [defaultState$1]() {
      return Object.assign(super[defaultState$1], {
        itemRole: "menuitemradio",
        selectionRequired: true,
        valuePartType: "div"
      });
    }

    [render$1](/** @type {ChangedFlags} */ changed) {
      super[render$1](changed);

      renderParts$3(this[shadowRoot$1], this[state$1], changed);

      if (changed.itemRole) {
        if ("itemRole" in this[ids$1].menu) {
          /** @type {any} */ (this[ids$1].menu).itemRole = this[
            state$1
          ].itemRole;
        }
      }

      if (changed.selectedIndex) {
        const items = this[state$1].items || [];
        const selectedItem = items[this[state$1].selectedIndex];
        const clone = selectedItem ? selectedItem.cloneNode(true) : null;
        const childNodes = clone ? clone.childNodes : [];
        updateChildNodes(this[ids$1].value, childNodes);
      }
    }

    [stateEffects$1](state, changed) {
      const effects = super[stateEffects$1](state, changed);

      // When the menu closes, update our selection from the menu selection.
      if (changed.opened) {
        const { closeResult, items, opened } = state;
        if (!opened && items && closeResult !== undefined) {
          const selectedIndex = items.indexOf(closeResult);
          Object.assign(effects, { selectedIndex });
        }
      }

      return effects;
    }

    get [template$1]() {
      const result = super[template$1];

      // Replace the source slot with an element to show the value.
      const sourceSlot = result.content.querySelector('slot[name="source"]');
      if (sourceSlot) {
        replace(
          sourceSlot,
          html`
          <div id="value" part="value"></div>
        `
        );
      }

      renderParts$3(result.content, this[state$1]);

      return result;
    }

    /**
     * The class or tag used to create the `value` part - the region
     * showing the dropdown list's current value.
     *
     * @type {PartDescriptor}
     * @default 'div'
     */
    get valuePartType() {
      return this[state$1].valuePartType;
    }
    set valuePartType(valuePartType) {
      this[setState$1]({ valuePartType });
    }
  }

  /**
   * Render parts for the template or an instance.
   *
   * @private
   * @param {DocumentFragment} root
   * @param {PlainObject} state
   * @param {ChangedFlags} [changed]
   */
  function renderParts$3(root, state, changed) {
    if (!changed || changed.valuePartType) {
      const { valuePartType } = state;
      const value = root.getElementById("value");
      if (value) {
        transmute(value, valuePartType);
      }
    }
  }

  /**
   * DropdownList component in the Plain reference design system
   *
   * @inherits DropdownList
   * @part {PlainMenu} menu
   * @part {PlainPopup} popup
   * @part {PlainBorderButton} source
   * @part {PlainOpenCloseToggle} popup-toggle
   */
  class PlainDropdownList extends DropdownList {
    get [defaultState$1]() {
      return Object.assign(super[defaultState$1], {
        menuPartType: PlainMenu,
        popupPartType: PlainPopup,
        sourcePartType: PlainBorderButton,
        popupTogglePartType: PlainOpenCloseToggle
      });
    }
  }

  class ElixDropdownList extends PlainDropdownList {}
  customElements.define("elix-dropdown-list", ElixDropdownList);

  class ThemeProvider extends ReactiveElement {
    get system() {
      return this[state$1].system;
    }
    set system(system) {
      this[setState$1]({ system });
    }

    get theme() {
      return this[state$1].theme;
    }
    set theme(theme) {
      this[setState$1]({ theme });
    }

    [render$1](changed) {
      super[render$1](changed);

      if (changed.system && !changed.theme) {
        console.log(this[state$1].system);
        const style = createElement("style");
        style.textContent = `
				@import url("../themes/${this[state$1].system}/themeProvider.css");
			`;
        replace(this[ids$1].import, style);
      }

      if (changed.system && changed.theme) {
        console.log(this[state$1].theme);
        const style = createElement("style");
        style.textContent = `
      @import url("../themes/${this[state$1].system}/themeProvider.css");
      @import url("../themes/${this[state$1].theme}/themeProvider.css");
			`;
        replace(this[ids$1].import, style);
      }
    }

    get [template$1]() {
      return html$1`
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

  const Base$9 = ReactiveElement;

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

  class VStack extends Base$9 {
    get [defaultState$1]() {
      return Object.assign(super[defaultState$1], {
        sourcePartType: "article",
        headerPartType: "header",
        contentPartType: "div",
        footerPartType: "footer"
      });
    }

    get sourcePartType() {
      return this[state$1].sourcePartType;
    }
    set sourcePartType(sourcePartType) {
      this[setState$1]({ sourcePartType });
    }

    get headerPartType() {
      return this[state$1].headerPartType;
    }
    set headerPartType(headerPartType) {
      this[setState$1]({ headerPartType });
    }

    get contentPartType() {
      return this[state$1].contentPartType;
    }
    set contentPartType(contentPartType) {
      this[setState$1]({ contentPartType });
    }

    get footerPartType() {
      return this[state$1].footerPartType;
    }
    set footerPartType(footerPartType) {
      this[setState$1]({ footerPartType });
    }

    [render$1](changed) {
      super[render$1](changed);

      if (changed.sourcePartType) {
        transmute(
          this[ids$1].source,
          this[state$1].sourcePartType
        );
      }

      if (changed.headerPartType) {
        transmute(
          this[ids$1].header,
          this[state$1].headerPartType
        );
      }

      if (changed.contentPartType) {
        transmute(
          this[ids$1].content,
          this[state$1].contentPartType
        );
      }

      if (changed.footerPartType) {
        transmute(
          this[ids$1].footer,
          this[state$1].footerPartType
        );
      }
    }

    get [template$1]() {
      return html$1`
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

  const header = title => {
    return html$1`
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
    return html$1`
		<footer class="lwc-card__footer">
      <slot name="footer"></slot>
		</footer>
	`;
  };

  class SdsCard extends VStack {
    get [defaultState$1]() {
      return Object.assign(super[defaultState$1], {
        headerPartType: header("Card Title"),
        titlePartType: "h2",
        footerPartType: footer(),
      });
    }

    get title() {
      return this[state$1].title;
    }
    set title(title) {
      this[setState$1]({ title });
    }

    get iconPartType() {
      return this[state$1].iconPartType;
    }
    set iconPartType(iconPartType) {
      this[setState$1]({ iconPartType });
    }

    get actionsPartType() {
      return this[state$1].actionsPartType;
    }
    set actionsPartType(actionsPartType) {
      this[setState$1]({ actionsPartType });
    }

    [render$1](changed) {
      super[render$1](changed);

      if (changed.title) {
        this[ids$1].headerTitle.textContent = this[state$1].title;
      }

      if (changed.iconPartType) {
        transmute(
          this[ids$1].headerIcon,
          this[state$1].iconPartType
        );
      }

      if (changed.actionsPartType) {
        transmute(
          this[ids$1].headerActions,
          this[state$1].actionsPartType
        );
      }
    }

    get [template$1]() {
      const result = super[template$1];

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

  class SdsIcon extends ReactiveElement {
    get [defaultState$1]() {
      return Object.assign(super[defaultState$1], {
        set: "utility",
        symbol: "add"
      });
    }

    get size() {
      return this[state$1].size;
    }
    set size(size) {
      this[setState$1]({ size });
    }

    get boundarysize() {
      return this[state$1].boundarysize;
    }
    set boundarysize(boundarysize) {
      this[setState$1]({ boundarysize });
    }

    get set() {
      return this[state$1].set;
    }
    set set(set) {
      this[setState$1]({ set });
    }

    get symbol() {
      return this[state$1].symbol;
    }
    set symbol(symbol) {
      this[setState$1]({ symbol });
    }

    [render$1](changed) {
      super[render$1](changed);

      if (changed.size) {
        const computedSizeClassName = `lwc-icon_${this[state$1].size}`;
        this[ids$1].icon.classList.add(computedSizeClassName);
      }

      if (changed.boundarysize) {
        const computedSizeClassName = `lwc-icon-boundary_${
        this[state$1].boundarysize
      }`;
        this[ids$1].boundary.classList.add(computedSizeClassName);
      }

      if (changed.set || changed.symbol) {
        const computedSizeClassName = `lwc-icon-${this[state$1].set}-${
        this[state$1].symbol
      }`;
        this[ids$1].icon.classList.add(computedSizeClassName);
        const path = `/public/icons/${this[state$1].set}/symbols.svg#${
        this[state$1].symbol
      }`;
        const useEl = this[ids$1].icon.querySelector("use");
        useEl.setAttribute("xlink:href", path);
      }
    }

    get [template$1]() {
      return html$1`
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

  customElements.define("sds-icon", SdsIcon);

  /**
   * SLDS variation of an Elix [Button](https://component.kitchen/elix/Button).
   */
  class SdsButton extends Button {
    [componentDidMount$1]() {
      this[ids$1].inner.classList.add("lwc-button");
    }

    get variant() {
      return this[state$1].variant;
    }
    set variant(variant) {
      this[setState$1]({ variant });
    }

    [render$1](changed) {
      super[render$1](changed);

      if (changed.variant) {
        const computedClassName = `lwc-button_${this[state$1].variant}`;
        this[ids$1].inner.classList.add(computedClassName);
      }
    }

    get [template$1]() {
      const result = super[template$1];
      result.content.append(
        html`
        <style>
          @import url("/src/sds/common/index.css");
          @import url("/src/sds/button/index.css");
        </style>
      `
      );
      return result;
    }
  }

  customElements.define("sds-button", SdsButton);

  /**
   * SLDS variation of an Elix [Button](https://component.kitchen/elix/Button).
   */
  class SdsButtonIcon extends Button {
    [componentDidMount$1]() {
      this[ids$1].inner.classList.add("lwc-button-icon");
    }
    get [defaultState$1]() {
      return Object.assign(super[defaultState$1], {
        variant: "bare",
        symbol: "chevrondown",
        size: "medium"
      });
    }

    get variant() {
      return this[state$1].variant;
    }
    set variant(variant) {
      this[setState$1]({ variant });
    }

    get size() {
      return this[state$1].size;
    }
    set size(size) {
      this[setState$1]({ size });
    }

    get symbol() {
      return this[state$1].symbol;
    }
    set symbol(symbol) {
      this[setState$1]({ symbol });
    }

    [render$1](changed) {
      super[render$1](changed);

      if (changed.variant) {
        const computedSizeClassName = `lwc-button-icon_${
        this[state$1].variant
      }`;
        this[ids$1].inner.classList.add(computedSizeClassName);
      }

      if (changed.symbol) {
        const icon = this[ids$1].icon;
        icon.symbol = this[state$1].symbol;
      }

      if (changed.size) {
        const icon = this[ids$1].icon;
        icon.boundarysize = this[state$1].size;
      }
    }

    get [template$1]() {
      const result = super[template$1];

      const slot = result.content.querySelector("slot:not([name])");
      replace(
        slot,
        html`
        <sds-icon id="icon"></sds-icon>
      `
      );

      result.content.append(
        html`
        <style>
          @import url("/src/sds/common/index.css");
          @import url("/src/sds/buttonIcon/index.css");
        </style>
      `
      );

      return result;
    }
  }

  customElements.define("sds-button-icon", SdsButtonIcon);

  /**
   * SLDS variation of an Elix [Menu](https://component.kitchen/elix/Menu).
   */
  class SdsMenu extends Menu {
    [render$1](changed) {
      super[render$1](changed);
      const items = this[state$1].items;
      // console.log(this[internal.state].items);
      // if (items) {
      //   items.forEach((item, index) => {
      //     item.setAttribute("class", "lwc-menuitem");
      //   });
      // }
    }

    get [template$1]() {
      const result = super[template$1];
      const wrapper = result.content.getElementById("content");
      wrapper.setAttribute("class", "lwc-menu");
      result.content.append(
        html`
        <style>
          :host {
            font-size: var(--lwc-c-menu-font-size, inherit);
          }
        </style>
      `
      );
      return result;
    }
  }

  customElements.define("sds-menu", SdsMenu);

  /**
   * SLDS variation of an Elix [OverlayFrame](https://component.kitchen/elix/OverlayFrame).
   *
   * In SLDS, this isn't offered as a standalone component, but doing so here means that
   * we can easily add the SLDS overlay style to anything with a popup.
   */
  class SldsOverlayFrame extends OverlayFrame {
    get [template$1]() {
      const result = super[template$1];
      const slot = result.content.querySelector("slot:not([name])");
      const wrapper = html`
      <div class="lwc-dropdown-container">
        <slot></slot>
      </div>
    `;
      replace(slot, wrapper);

      result.content.append(
        html`
        <style>
          @import url("/src/sds/common/index.css");
          @import url("/src/sds/overlayFrame/index.css");
        </style>
      `
      );
      return result;
    }
  }

  customElements.define("slds-overlay-frame", SldsOverlayFrame);

  /**
   * SLDS variation of an Elix [Popup](https://component.kitchen/elix/Popup).
   */
  class SdsPopup extends Popup {
    get [defaultState$1]() {
      return Object.assign(super[defaultState$1], {
        framePartType: SldsOverlayFrame,
      });
    }
  }

  customElements.define("sds-popup", SdsPopup);

  /**
   * SLDS variation of an Elix [MenuButton](https://component.kitchen/elix/MenuButton).
   *
   * Note: SLDS calls this a "button menu"; Elix calls this a "menu button".
   * They're the same thing.
   */
  class SdsButtonMenu extends MenuButton {
    get [defaultState$1]() {
      return Object.assign(super[defaultState$1], {
        menuPartType: SdsMenu,
        popupPartType: SdsPopup,
        popupTogglePartType: null,
        sourcePartType: SdsButtonIcon,
        variant: "neutral",
        symbol: "chevrondown",
      });
    }

    get variant() {
      return this[state$1].variant;
    }
    set variant(variant) {
      this[setState$1]({ variant });
    }

    get size() {
      return this[state$1].size;
    }
    set size(size) {
      this[setState$1]({ size });
    }

    get symbol() {
      return this[state$1].symbol;
    }
    set symbol(symbol) {
      this[setState$1]({ symbol });
    }

    [render$1](changed) {
      super[render$1](changed);

      if (changed.variant) {
        const shadow = this.shadowRoot.getElementById("source");
        shadow.variant = this[state$1].variant;
      }

      if (changed.symbol) {
        const shadow = this.shadowRoot.getElementById("source");
        const iconPart = shadow.shadowRoot.getElementById("icon");
        iconPart.symbol = this[state$1].symbol;
      }
    }
  }

  customElements.define("sds-button-menu", SdsButtonMenu);

  /**
   * SLDS variation of an Elix [DropdownList](https://component.kitchen/elix/DropdownList).
   */
  class SdsDropdownList extends DropdownList {
    get [defaultState$1]() {
      return Object.assign(super[defaultState$1], {
        horizontalAlign: "stretch",
        menuPartType: SdsMenu,
        popupPartType: SdsPopup,
        popupTogglePartType: SdsIcon,
        sourcePartType: SdsButton
      });
    }

    get variant() {
      return this[state$1].variant;
    }
    set variant(variant) {
      this[setState$1]({ variant });
    }

    [render$1](changed) {
      super[render$1](changed);

      if (changed.variant) {
        this[ids$1].source.setAttribute(
          "variant",
          this[state$1].variant
        );
      }
      if (changed.popupTogglePartType) {
        this[ids$1].popupToggle.setAttribute("symbol", "chevrondown");
      }
    }

    get [template$1]() {
      const result = super[template$1];
      // console.log(result);
      // const icon = result.content.getElementById('source');
      // console.log(icon)
      // if (icon) {
      // const parent = template.createElement('div');
      // console.log(parent)
      // parent.innerHTML = icon;
      // }
      // const iconSlot = result.content.querySelector('slot[name="toggle-icon"]');
      // if (iconSlot) {
      // 	const iconTemplate = template.html`
      // 		<svg class="lwc-svg" aria-hidden="true" viewBox="0 0 24 24">
      // 			<path
      // 				d="M22 8.2l-9.5 9.6c-.3.2-.7.2-1 0L2 8.2c-.2-.3-.2-.7 0-1l1-1c.3-.3.8-.3 1.1 0l7.4 7.5c.3.3.7.3 1 0l7.4-7.5c.3-.2.8-.2 1.1 0l1 1c.2.3.2.7 0 1z"
      // 			></path>
      // 		</svg>
      // 	`;
      // 	template.transmute(iconSlot, iconTemplate);
      // }
      return result;
    }
  }

  customElements.define("sds-picklist", SdsDropdownList);

  class SdsMenuItem extends ReactiveElement {
    get [template$1]() {
      return html$1`
      <style>
        @import url("/src/sds/common/index.css");
        @import url("/src/sds/menu/index.css");

        :host {
          display: inline-block;
        }
      </style>
      <div class="lwc-menuitem">
        <span class="lwc-menuitem__content">
          <slot></slot>
        </span>
      </div>
    `;
    }
  }

  customElements.define("sds-menu-item", SdsMenuItem);

  /**
   * Lazy attempt to accept new HTML for footer
   */
  const footer$1 = () => {
    return html$1`
		<footer class="lwc-card__footer">
      <a class="lwc-card__footer-action" href="javascript:void(0);">
        <slot name="footer">View All</slot>
      </a>
		</footer>
	`;
  };

  class SldsCard extends SdsCard {
    get [defaultState$1]() {
      return Object.assign(super[defaultState$1], {
        titlePartType: "h3",
        iconPartType: SdsIcon,
        footerPartType: footer$1()
      });
    }

    [render$1](changed) {
      super[render$1](changed);

      if (changed.iconPartType) {
        // Pass attributes to SldsIcon component
        this[ids$1].headerIcon.set = "standard";
        this[ids$1].headerIcon.symbol = "account";
      }
    }

    get [template$1]() {
      const result = super[template$1];

      result.content.append(
        html`
        <style>
          [part="inner"] {
            padding: var(--slds-c-card-body-padding);
          }
          ::slotted(img) {
            width: 100%;
          }
        </style>
      `
      );
      return result;
    }
  }

  customElements.define("slds-card", SldsCard);

  class TrailheadButtonIcon extends SdsButtonIcon {
    /**
     * Default state for Trailhead button icons is always neutral theme
     */
    get [defaultState$1]() {
      return Object.assign(super[defaultState$1], {
        variant: "neutral"
      });
    }

    get [template$1]() {
      const result = super[template$1];
      /**
       * Trailhead design system has a reduced number of buttonIcon
       * variations. The size seems to be consistent throughout the system at 38x38px.
       * I'm using this extension point to expose the Styling API class
       * to accept a new token that will be applied to all Trailhead Button Icons.
       */
      result.content.append(
        html`
        <style>
          ::part(icon-source) {
            width: var(--th-c-button-icon-size, 2.375rem);
            height: var(--th-c-button-icon-size, 2.375rem);
          }
        </style>
      `
      );
      return result;
    }
  }

  customElements.define("th-button-icon", TrailheadButtonIcon);

  class SomeRandomComponent extends ReactiveElement {
    get [template$1]() {
      return html$1`
      <div part="source">
        <slot></slot>
      </div>
    `;
    }
  }

  customElements.define("some-random-component", SomeRandomComponent);

  class TrailheadImageCard extends SdsCard {
    /**
     * Using SomeRandomComponent in an exposed part type
     * showcases a customization scenario where my component
     * is using a 3rd party Class/Component
     *
     * If component has part exposed, can style nodes within
     */
    get [defaultState$1]() {
      return Object.assign(super[defaultState$1], {
        titlePartType: "h3",
        contentPartType: SomeRandomComponent
      });
    }

    get [template$1]() {
      const result = super[template$1];

      // Want to keep header from SdsCard but need to move it below the image
      const headerPart = result.content.getElementById("header");
      const contentPart = result.content.querySelector("slot:not([name])");
      contentPart.insertAdjacentElement("beforebegin", headerPart);

      /**
       * 0. Demo Styles
       * 1. Target exposed ::part in 3rd party component
       * 2. Selector match part attribute in light DOM to expose DS specific styling API
       * 3. Custom CSS that is unique to this version of the Card
       * 4. Custom CSS to handle footer
       */
      result.content.append(
        html`
        <style>
          :host {
            margin-bottom: 1rem;
          }
          ::part(source) {
            padding: 0;
          }
          [part="inner"] {
            padding: var(--th-c-card-content-padding);
          }
          slot[name="above-content"]::slotted(img) {
            border-top-left-radius: var(--lwc-c-card-radius);
            border-top-right-radius: var(--lwc-c-card-radius);
            width: 100%;
          }
          slot[name="footer"]::slotted(div) {
            display: inline-flex;
            --lwc-c-button-icon-spacing-horizontal-end: 0.25rem;
          }
        </style>
      `
      );
      return result;
    }
  }

  customElements.define("th-image-card", TrailheadImageCard);

  /**
   * Lazy attempt to accept new HTML for image
   */
  const trailImage = () => {
    return html$1`
    <div class="trail-image">
      <img src="/public/images/trail.png" alt="" width="90" />
    </div>
  `;
  };

  class TrailheadTrailCard extends SdsCard {
    get [defaultState$1]() {
      return Object.assign(super[defaultState$1], {
        imagePartType: trailImage()
      });
    }

    get image() {
      return this[state$1].image;
    }
    set image(image) {
      this[setState$1]({ image });
    }

    [render$1](changed) {
      super[render$1](changed);
      if (changed.image) {
        console.log("image changed");
      }

      if (changed.imagePartType) {
        transmute(
          this[ids$1].trailImage,
          this[state$1].imagePartType
        );
      }
    }

    get [template$1]() {
      const result = super[template$1];

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

  class CodeScienceCard extends SdsCard {
    get [template$1]() {
      const result = super[template$1];

      // Want to keep header from SdsCard but need to move it below the image
      const headerPart = result.content.getElementById("header");
      const contentPart = result.content.querySelector("slot:not([name])");
      contentPart.insertAdjacentElement("beforebegin", headerPart);

      result.content.append(
        html`
        <style>
          [part="inner"] {
            padding: 1.5rem;
          }
          slot[name="above-content"]::slotted(img) {
            border-top-left-radius: var(--lwc-c-card-radius);
            border-top-right-radius: var(--lwc-c-card-radius);
            width: 100%;
          }
          slot[name="footer"]::slotted(div) {
            display: inline-flex;
            --lwc-c-button-spacing-horizontal-end: 1rem;
          }
        </style>
      `
      );
      return result;
    }
  }

  customElements.define("cs-card", CodeScienceCard);

})));
