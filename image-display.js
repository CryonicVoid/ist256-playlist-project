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
 * @element image-display
 */
export class ImgDisplay extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "image-display";
  }

  constructor() {
    super();
    this.currentIndex = 0;  // default, will be updated from parent
    this.totalSlides = 1;   // default
   
  }

  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      currentIndex: { type: Number }, // from slideshow parent
      totalSlides: { type: Number },  // from slideshow parent
      imageUrl: { type: String }      // reactive, automatically updates render
    };
  }

static get styles() {
  return css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    .container {
      width: 100%;
      height: 100%;
      overflow: hidden; /* prevent image overflow */
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px; /* optional, match your mainbg */
    }
    img {
      max-width: 100%;   /* scale down if wider than container */
      max-height: 100%;  /* scale down if taller than container */
      object-fit: contain; /* preserves aspect ratio, fits inside container */
      border-radius: 8px;  /* optional, matches container corners */
      display: block;
    }
  `;
}

render() {
  return html`
    <div class="container">
      ${this.imageUrl
        ? html`<img src="${this.imageUrl}" loading="lazy" />`
        : html`<p>Loading image...</p>`}
    </div>
  `;
}
}

globalThis.customElements.define(ImgDisplay.tag, ImgDisplay);