/**
 * Copyright 2026 CryonicVoid
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { ControlBar } from "./control-bar";
import { ImgDisplay } from "./image-display";
import { NavArrow } from "./nav-arrow";
/**
 * `ist256-playlist-project`
 *
 * @demo index.html
 * @element ist256-playlist-project
 */
export class Ist256PlaylistProject extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "ist256-playlist-project";
  }
  constructor() {
    super();
    this.currentIndex = 0;
    this.totalSlides = 0;
    this.slides = [];
    this.title = "";
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      currentIndex: {type: Number},
      totalSlides: {type: Number},
      slides: {type: Array}
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
          position: relative;
          
        }
        // This Controls the size for the bar and the main background :))
        .wrapper { 
          margin: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-4);
          position: flex;
          flex: auto;
          align-content: center;
          flex-direction: column;
          width: 35vw; // here. it uses viewport width.
        }
        .mainbg {
          background-color: var(--ddd-theme-default-skyBlue);
          width: 100%;
          height: 75vh;
          border-radius: var(--ddd-spacing-4);
        }
      `,
    ];
  }




firstUpdated() {
  this._updateSlides();

  // fetch fox for first slide
  const imageDisplay = this.renderRoot.querySelector('image-display');
  if (imageDisplay) {
    imageDisplay.updateForSlide(this.currentIndex);
  }
}
_updateSlides() {
  // activate the correct slide
  this.slides.forEach((slide, i) => slide.active = (i === this.currentIndex));

  // dispatch event for control bar
  const indexChange = new CustomEvent("play-list-index-changed", {
    composed: true,
    bubbles: true,
    detail: {
      index: this.currentIndex
    },
  });
  this.dispatchEvent(indexChange);

  // --- ADD THIS: tell image-display to update ---
  const imageDisplay = this.renderRoot.querySelector('image-display');
  if (imageDisplay) {
    imageDisplay.updateForSlide(this.currentIndex);
  }
}

  nextSlide() {
    if (this.currentIndex < this.totalSlides - 1) {
      this.currentIndex ++;
    }
    this._updateSlides();
  }

  previousSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
    this._updateSlides();
  }

  handleEvent(e) {
    this.currentIndex = e.detail.index;
    this._updateSlides();
  }
  // Lit render the HTML
  render() {
    return html` <div class="wrapper">
      <div class="mainbg">
        <image-display   
        .currentIndex=${this.currentIndex}
  .totalSlides=${this.totalSlides}></image-display>
        <nav-arrow     .currentIndex=${this.currentIndex}
        .totalSlides=${this.totalSlides}
        @previous-slide="${this.previousSlide}"   
        @next-slide="${this.nextSlide}"> </nav-arrow>
      </div>
  <control-bar
  @play-list-index-changed="${this.handleEvent}"
  .currentIndex=${this.currentIndex}
  .totalSlides=${this.totalSlides}>
</control-bar>
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

globalThis.customElements.define(
  Ist256PlaylistProject.tag,
  Ist256PlaylistProject,
);
