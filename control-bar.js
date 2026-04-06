/**
 * Copyright 2026 CryonicVoid
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, svg } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

export class ControlBar extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() { return "control-bar"; }

  constructor() {
    super();
    this.currentIndex = 0;
    this.totalSlides  = 0;
    this.slides       = [];
    this._animating   = false;
    this._imgErrors   = {};
  }

  static get properties() {
    return {
      ...super.properties,
      currentIndex: { type: Number },
      totalSlides:  { type: Number },
      slides:       { type: Array  },
      _animating:   { type: Boolean, state: true },
      _imgErrors:   { type: Object,  state: true },
    };
  }

  updated(changedProps) {
    if (changedProps.has("currentIndex")) {
      const prev = changedProps.get("currentIndex");
      if (prev !== undefined && prev !== this.currentIndex) {
        this._triggerAnimation();
      }
    }
    if (changedProps.has("slides") && this.slides?.length) {
      this._preloadThumbnails();
    }
  }

  _triggerAnimation() {
    this._animating = true;
    setTimeout(() => { this._animating = false; }, 350);
  }

  _preloadThumbnails() {
    this._getVisibleIndices().forEach((i) => {
      const url = this.slides[i]?.thumbnail ?? this.slides[i]?.full ?? "";
      if (!url || this._imgErrors[i]) return;
      const img = new Image();
      img.onerror = () => { this._imgErrors = { ...this._imgErrors, [i]: true }; };
      img.src = url;
    });
  }

  _getVisibleIndices() {
    const total = this.slides?.length ?? 0;
    if (total === 0) return [];
    const count = Math.min(5, total);
    let start = this.currentIndex - Math.floor(count / 2);
    start = Math.max(0, Math.min(start, total - count));
    return Array.from({ length: count }, (_, i) => start + i);
  }

  /**
   * Arc math: bottom half of an ellipse (180°→360°) whose center
   * sits BELOW the SVG canvas, so only the upward-curving top portion
   * is visible inside the bar. All points guaranteed within the viewBox.
   *
   * SVG canvas: 220 × 80
   * Ellipse center: (110, 100)  — 20px below the bottom edge
   * rx = 84, ry = 76
   * Angles sweep 180°→360° left-to-right
   */
  _arcPosition(pos, count) {
  const t        = count > 1 ? pos / (count - 1) : 0.5;
  const angleDeg = 180 + t * 180;
  const angleRad = (angleDeg * Math.PI) / 180;
  const cx = 110, cy = 130;   // was 100 — push center further down
  const rx = 84,  ry = 105;   // was 76  — taller ry = shallower curve = sits higher
  const x  = cx + rx * Math.cos(angleRad);
  const y  = cy + ry * Math.sin(angleRad);
  const distFromCenter = Math.abs(pos - (count - 1) / 2);
  const scale = 1 - distFromCenter * 0.07;
  return { x, y, scale };
}

  _handleDotClick(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.dispatchEvent(new CustomEvent("play-list-index-changed", {
      composed: true, bubbles: true, detail: { index },
    }));
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host { display: block; }

        .dots {
          width: 100%;
          height: 80px;
          background-color: var(--ddd-theme-default-skyMaxLight, #e8f4fb);
          border-radius: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          /* overflow visible so the top of the arc (tallest thumb)
             can poke above the bar if needed — but with this math it won't */
          overflow: visible;
          box-sizing: border-box;
          position: relative;
        }

        .arc-svg {
          display: block;
          /* overflow visible so clip-paths on edge thumbs aren't cut */
          overflow: visible;
        }

        .arc-svg.animating {
          animation: arc-pop 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes arc-pop {
          0%   { transform: scaleX(0.93) scaleY(0.9);  opacity: 0.6; }
          60%  { transform: scaleX(1.03) scaleY(1.02); opacity: 1;   }
          100% { transform: scaleX(1)    scaleY(1);    opacity: 1;   }
        }

        .thumb-group { cursor: pointer; }
        .thumb-group:hover { opacity: 0.75; }
      `,
    ];
  }

  render() {
    const visible    = this._getVisibleIndices();
    const windowSize = visible.length;

    if (windowSize === 0) {
      return html`
        <div class="dots">
          <span style="opacity:0.4;font-size:0.75rem;">Loading…</span>
        </div>`;
    }

    const thumbs = visible.map((slideIndex, posInWindow) => {
      const { x, y, scale } = this._arcPosition(posInWindow, windowSize);
      const isActive  = slideIndex === this.currentIndex;
      const slide     = this.slides[slideIndex];
      const thumbUrl  = slide?.thumbnail ?? slide?.full ?? "";
      const imgFailed = this._imgErrors[slideIndex] || !thumbUrl;
      const r         = 22 * scale;
      const clipId    = `clip-thumb-${slideIndex}`;

      return svg`
        <defs>
          <clipPath id="${clipId}">
            <circle cx="${x}" cy="${y}" r="${r}"></circle>
          </clipPath>
        </defs>

        <g
          class="thumb-group"
          data-index="${slideIndex}"
          @click="${this._handleDotClick}"
        >
          ${imgFailed ? svg`
            <circle
              cx="${x}" cy="${y}" r="${r * 0.5}"
              fill="${isActive
                ? "var(--ddd-theme-default-skyBlue, #1a73e8)"
                : "var(--ddd-theme-default-limestoneGray, #aaa)"}"
            ></circle>
          ` : svg`
            <image
              href="${thumbUrl}"
              x="${x - r}" y="${y - r}"
              width="${r * 2}" height="${r * 2}"
              clip-path="url(#${clipId})"
              preserveAspectRatio="xMidYMid slice"
            ></image>
          `}

          ${isActive ? svg`
            <circle
              cx="${x}" cy="${y}" r="${r + 3}"
              fill="none"
              stroke="var(--ddd-theme-default-skyBlue, #1a73e8)"
              stroke-width="2.5"
            ></circle>
          ` : svg``}
        </g>
      `;
    });

    return html`
      <div class="dots">
        <svg
          class="arc-svg ${this._animating ? "animating" : ""}"
          viewBox="0 0 220 80"
          width="220"
          height="80"
        >
          ${thumbs}
        </svg>
      </div>
    `;
  }

  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

globalThis.customElements.define(ControlBar.tag, ControlBar);