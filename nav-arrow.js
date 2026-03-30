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
  position: absolute;   /* absolute inside .image-wrapper */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* let clicks pass to wrapper except buttons */
}
        .wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .left-arrow,
.right-arrow {
  pointer-events: auto; /* enable clicking buttons */
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background-color: var(--ddd-theme-default-white);
  border-radius: var(--ddd-radius-circle);
  font-size: var(--ddd-font-size-xs);
  padding: var(--ddd-spacing-1) var(--ddd-spacing-3);
  cursor: pointer;
}

.left-arrow {
  left: 10px;
}

.right-arrow {
  right: 10px;
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