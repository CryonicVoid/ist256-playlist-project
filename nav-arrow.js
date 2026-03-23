/**
 * Copyright 2026 CryonicVoid
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { DDDAllStyles } from "@haxtheweb/d-d-d/lib/DDDStyles";

/**
 * `nav-arrow`
 * 
 * @demo index.html
 * @element nav-arrow
 */
export class NavArrow extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "nav-arrow";
  }

  constructor() {
    super();
    
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
          currentIndex: {type: Number},
      totalSlide: {type: Number}
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
        .wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

        .left-arrow, .right-arrow {
        background-color: var(--ddd-theme-default-white);
        color: var(--ddd-theme-default-link);
        border: var(--ddd-border-md);
        border-color: var(--ddd-theme-default-link);
        padding: var(--ddd-spacing-1) var(--ddd-spacing-3);
        margin: 0 -15px;
        border-radius: var(--ddd-radius-circle);
        font-size: var(--ddd-font-size-xs);
        cursor: pointer;
        }

        .left-arrow:hover, .right-arrow:hover {
            opacity: 0.7;
        }

        .left-arrow:disabled, .right-arrow:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
<div class="wrapper">
 <button class="left-arrow" @click=${() => this.dispatchEvent(new CustomEvent("previous-slide", {composed: true, bubbles: true}))} ?disabled=${this.currentIndex === 0}><strong>‹</strong></button>
  <button class="right-arrow" @click=${() => this.dispatchEvent(new CustomEvent("next-slide", {composed: true, bubbles: true}))} ?disabled=${this.currentIndex === this.totalSlides - 1}><strong>›</strong></button>
</div>`;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(NavArrow.tag, NavArrow);