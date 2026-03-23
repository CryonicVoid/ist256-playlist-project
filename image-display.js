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
    this.foxImage = "";     // reactive property to store the current fox
  }

  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      currentIndex: { type: Number }, // from slideshow parent
      totalSlides: { type: Number },  // from slideshow parent
      foxImage: { type: String }      // reactive, automatically updates render
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

  // Fetch a random fox and update `foxImage`
async getFox() {
  try {
    const resp = await fetch("https://randomfox.ca/floof/");
    if (!resp.ok) throw new Error("Network response was not ok");

    const data = await resp.json();
    if (data?.image) {
      this.foxImage = data.image;
    } else {
      console.error("Invalid data from fox API:", data);
      this.foxImage = "fallback.png"; // optional
    }
  } catch (e) {
    console.error("Failed to fetch fox:", e);
    this.foxImage = "fallback.png"; // optional
  }
}

  // Called whenever slide changes
  updateForSlide(index) {
    this.currentIndex = index;
    // Optionally, use currentIndex to "seed" randomness differently if desired
    this.getFox();
  }
render() {
  return html`
    <div class="container">
      ${this.foxImage
        ? html`<img src="${this.foxImage}" alt="Random fox" />`
        : html`<p>Loading fox...</p>`}
    </div>
  `;
}
}

globalThis.customElements.define(ImgDisplay.tag, ImgDisplay);