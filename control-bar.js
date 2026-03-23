/**
 * Copyright 2026 CryonicVoid
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `control-bar`
 *
 * @demo index.html
 * @element control-bar
 */
export class ControlBar extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "control-bar";
  }

  constructor() {
    super();
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      currentIndex: { type: Number },
      totalSlides: { type: Number }
    };
  }

  // Lit scoped styles
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          color: var(--ddd-theme-primary);
          background-color: var(--ddd-theme-accent);
          font-family: var(--ddd-font-navigation);
        }
.dots {
  margin: var(--ddd-spacing-2) 0;
  width: 100%;
  height: 10vh;
  background-color: var(--ddd-theme-default-skyMaxLight);
  border-radius: var(--ddd-spacing-4);

  display: flex;              /* add this */
  justify-content: center;    /* horizontal center */
  align-items: center;        /* vertical center */
  gap: 8px;                   /* space between dots */
}
        .dot.active {
          color: var(--ddd-theme-default-skyBlue);
          cursor: not-allowed;
        }

        .dot {
          color: var(--ddd-theme-default-limestoneGray);
          padding: var(--ddd-spacing-1);
          font-size: var(--ddd-font-size-s);
          cursor: pointer;
        }

        .dot:not(.active):hover {
          opacity: 0.7;
        }
      `,
    ];
  }

  // Lit render the HTML
  render() {
    let dots = [];
    for (let i = 0; i < this.totalSlides; i++) {
      dots.push(
        html` <span
          @click="${this._handleDotClick}"
          data-index="${i}"
          class="dot ${i === this.currentIndex ? "active" : ""}"
        >
          ●
        </span>`,
      );
    }
    return html` <div class="dots">${dots}</div> `;
  }

  _handleDotClick(e) {
    const indexChange = new CustomEvent("play-list-index-changed", {
      composed: true,
      bubbles: true,
      detail: {
        index: parseInt(e.currentTarget.dataset.index),
      },
    });
    this.dispatchEvent(indexChange);
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(ControlBar.tag, ControlBar);
