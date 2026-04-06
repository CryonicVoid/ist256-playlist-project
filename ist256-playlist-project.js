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
import { ImageCard } from "./image-card";
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
    this.url = window.location.href;
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      currentIndex: { type: Number },
      totalSlides: { type: Number },
      slides: { type: Array },
      url: { type: String },
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

      .wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: clamp(280px, 35vw, 520px);
        margin: 0 auto;
        padding: var(--ddd-spacing-4);
        gap: var(--ddd-spacing-2);
      }

      .mainbg {
        background-color: var(--ddd-theme-default-skyBlue);
        width: 100%;
        height: 75vh;
        border-radius: var(--ddd-spacing-4);
        position: relative;
        overflow: hidden;
      }

      /* Row that holds left arrow + control bar + right arrow */
      .bottom-bar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        gap: var(--ddd-spacing-2);
      }

      .nav-btn {
        flex-shrink: 0;
        background: rgba(255,255,255,0.85);
        border: none;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        font-size: 1.2rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        transition: background 0.15s, transform 0.15s;
      }

      .nav-btn:hover:not(:disabled) {
        background: rgba(255,255,255,1);
        transform: scale(1.08);
      }

      .nav-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      control-bar {
        flex: 1;
        min-width: 0;
      }

      @media (max-width: 600px) {
        .wrapper {
          width: 95vw;
          padding: var(--ddd-spacing-2);
        }
        .mainbg {
          height: 70vh;
        }
      }
    `,
  ];
}

  
  toggleLikes(id) {
    const likes = JSON.parse(localStorage.getItem("likes") || "{}");
    likes[id] = !likes[id];
    console.log(likes);
    localStorage.setItem("likes", JSON.stringify(likes));
  }

  async loadPosts() {
    const resp = await fetch("/api/posts");
    this.slides = await resp.json();
    console.log("API RETURNED:", this.slides);
    this.totalSlides = this.slides.length;
  }

  _getFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const i = Number(params.get("activeIndex"));
    if (!isNaN(i)) this.currentIndex = i;
  }
  _updateUrl() {
    const params = new URLSearchParams(window.location.search);
    params.set("activeIndex", this.currentIndex);
    window.history.replaceState({}, "", `?${params.toString()}`);
  }
  updated(changedProperties) {
    if (changedProperties.has("imageUrl")) {
      console.log("imageUrl updated:", this.imageUrl);
    }
    if (changedProperties.has("slides")) {
    this.totalSlides = this.slides.length;
  }
  }

  async firstUpdated() {
    this._getFromUrl();
    await this.loadPosts();
    this._updateUrl();
  }
  _updateSlides() {
    // activate the correct slide
    this.slides.forEach((slide, i) => (slide.active = i === this.currentIndex));

    // dispatch event for control bar
    const indexChange = new CustomEvent("play-list-index-changed", {
      composed: true,
      bubbles: true,
      detail: {
        index: this.currentIndex,
      },
    });
    this.dispatchEvent(indexChange);
  }

  nextSlide() {
    if (this.currentIndex < this.totalSlides - 1) {
      this.currentIndex++;
    }
    this._updateUrl();
    this._updateSlides();
  }

  previousSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
    this._updateUrl();
    this._updateSlides();
  }

  handleEvent(e) {
    this.currentIndex = e.detail.index;
    this._updateUrl();
    this._updateSlides();
  }
  // Lit render the HTML
 render() {
  const slide = this.slides[this.currentIndex];

  return html`
    <div class="wrapper">
      <div class="mainbg">
        <image-card
          .imageUrl=${slide?.full ?? ""}
          .title=${slide?.title ?? ""}
          .description=${slide?.description ?? ""}
          .author=${slide?.author ?? {}}
          .dateTaken=${slide?.dateTaken ?? ""}
          .id=${slide?.id ?? 0}
        ></image-card>
      </div>

      <div class="bottom-bar">
        <button
          class="nav-btn"
          ?disabled=${this.currentIndex === 0}
          @click="${this.previousSlide}"
        >&#8249;</button>

        <control-bar
          @play-list-index-changed="${this.handleEvent}"
          .currentIndex=${this.currentIndex}
          .totalSlides=${this.totalSlides}
          .slides=${this.slides}
        ></control-bar>

        <button
          class="nav-btn"
          ?disabled=${this.currentIndex === this.totalSlides - 1}
          @click="${this.nextSlide}"
        >&#8250;</button>
      </div>
    </div>
  `;
}
}

globalThis.customElements.define(
  Ist256PlaylistProject.tag,
  Ist256PlaylistProject,
);
