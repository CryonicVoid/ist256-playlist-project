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
          position: relative;
        }
      `,
    ];
  }

  async getPost() {
    try {
      const resp = await fetch("./posts.json");
      if (!resp.ok) throw new Error("Network response was not ok");

      const data = await resp.json();
      const urlParams = new URLSearchParams(window.location.search);

      console.log(urlParams);
      const posts = urlParams.get("posts");
      if (posts) {
        console.log("there is posts params.");
      } else {
        console.log("errerrerr");
      }
    } catch (e) {
      console.error("Failed to fetch fox:", e);
      this.foxImage = "fallback.png"; // optional
    }
  }
  toggleLikes(id) {
    const likes = JSON.parse(localStorage.getItem("likes") || "{}");
    likes[id] = !likes[id];
    console.log(likes)
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
  }

  async firstUpdated() {
    await this.loadPosts();
    this._getFromUrl();
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
  //  if (!this.slides.length) {
    //  return html`<p>Loading posts...</p>`;
   // }

    const slide = this.slides[this.currentIndex];
    const imageUrl = slide ? slide.full : "";
    console.log("CURRENT SLIDE:", slide);
    return html` <div class="wrapper">
      <div class="mainbg">
        <image-card
          .imageUrl=${this.slides[this.currentIndex]?.full}
          .title=${this.slides[this.currentIndex]?.title}
          .description=${this.slides[this.currentIndex]?.description}
          .author=${this.slides[this.currentIndex]?.author}
          .id=${this.slides[this.currentIndex]?.id}
        ></image-card>
        <nav-arrow
          .currentIndex=${this.currentIndex}
          .totalSlides=${this.totalSlides}
          @previous-slide="${this.previousSlide}"
          @next-slide="${this.nextSlide}"
        >
        </nav-arrow>
      </div>
      <control-bar
        @play-list-index-changed="${this.handleEvent}"
        .currentIndex=${this.currentIndex}
        .totalSlides=${this.totalSlides}
      >
      </control-bar>
    </div>`;
  }
}

globalThis.customElements.define(
  Ist256PlaylistProject.tag,
  Ist256PlaylistProject,
);
