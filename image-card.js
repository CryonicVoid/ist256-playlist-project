import { LitElement, html, css } from "lit";

export class ImageCard extends LitElement {
  static get tag() {
    return "image-card";
  }

  static get properties() {
    return {
      imageUrl:    { type: String },
      title:       { type: String },
      description: { type: String },
      author:      { type: Object },
      dateTaken:   { type: String },
      id:          { type: Number },
      liked:       { type: Boolean },
      iconLike:    { type: String },
      iconLiked:   { type: String },
      iconShare:   { type: String },
      iconSave:    { type: String },
    };
  }

  constructor() {
    super();
    this.imageUrl    = "";
    this.title       = "";
    this.description = "";
    this.author      = { name: "", image: "", since: "", channel: "" };
    this.dateTaken   = "";
    this.id          = 0;
    this.liked       = false;
    this.iconLike    = "https://www.freeiconspng.com/uploads/like-icon-0.png";
    this.iconLiked   = "https://www.freeiconspng.com/uploads/like-icon-0.png";
    this.iconShare   = "https://www.freeiconspng.com/uploads/share-sharing-icon-29.png";
    this.iconSave    = "https://www.iconpacks.net/icons/2/free-favourite-icon-2765-thumb.png";
  }

  updated(changedProps) {
    if (changedProps.has("id")) {
      const likes = JSON.parse(localStorage.getItem("likes") || "{}");
      this.liked = !!likes[this.id];
    }
  }

  toggleLike() {
    this.liked = !this.liked;
    const likes = JSON.parse(localStorage.getItem("likes") || "{}");
    likes[this.id] = this.liked;
    localStorage.setItem("likes", JSON.stringify(likes));
  }

  _formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day:   "numeric",
      year:  "numeric",
    });
  }

  static get styles() {
    return css`
      /* ── Host fills whatever .mainbg gives it ── */
      :host {
        display: block;
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        border-radius: inherit;
        overflow: hidden;
      }

      /* ── Image fills host completely ── */
      .bg-image {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        border-radius: inherit;
        display: block;
      }

      .scrim {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background:
          linear-gradient(to top,  rgba(0,0,0,0.70) 0%, transparent 50%),
          linear-gradient(to bottom, rgba(0,0,0,0.40) 0%, transparent 35%);
        pointer-events: none;
      }

      /* ── Author pill — top-left ── */
      .author-pill {
        position: absolute;
        top: 12px;
        left: 12px;
        display: flex;
        align-items: center;
        background: rgba(255,255,255,0.92);
        border-radius: 999px;
        padding: 3px 10px 3px 3px;
        backdrop-filter: blur(4px);
        box-shadow: 0 2px 8px rgba(0,0,0,0.18);
        max-width: 60%;
        z-index: 2;
      }

      .author-avatar {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
        border: 2px solid #fff;
        background: #ddd;
      }

      .author-text {
        display: flex;
        flex-direction: column;
        margin-left: 7px;
        overflow: hidden;
      }

      .author-name {
        font-size: 0.78rem;
        font-weight: 700;
        color: #222;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.2;
      }

      .author-meta {
        font-size: 0.62rem;
        color: #666;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.2;
      }

      /* ── Action strip — anchored to actual corner ── */
      .actions {
        position: absolute;
        right: 12px;
        bottom: 80px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 18px;
        z-index: 2;
      }

      .action-wrap {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255,255,255,0.18);
        border: none;
        border-radius: 50%;
        /* Fixed size so it never collapses */
        width: 44px;
        height: 44px;
        cursor: pointer;
        transition: background 0.18s, transform 0.15s;
        backdrop-filter: blur(4px);
        padding: 10px;
        box-sizing: border-box;
      }

      .action-btn:hover {
        background: rgba(255,255,255,0.32);
        transform: scale(1.1);
      }

      .action-btn.liked {
        background: rgba(255,59,92,0.25);
      }

      .action-btn.liked:hover {
        background: rgba(255,59,92,0.38);
      }

      .action-icon {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
        filter: brightness(0) invert(1);
        pointer-events: none;
      }

      .action-btn.liked .action-icon {
        filter: brightness(0) saturate(100%)
                invert(27%) sepia(90%) saturate(700%)
                hue-rotate(320deg) brightness(110%);
      }

      .action-label {
        margin-top: 4px;
        font-size: 0.6rem;
        font-weight: var(--ddd-font-size-bold);
        color: #fff;
        text-shadow: 0 1px 3px rgba(0,0,0,0.6);
        white-space: nowrap;
        text-align: center;
      }

      /* ── Description — bottom-left ── */
      .description-block {
        position: absolute;
        bottom: 14px;
        left: 12px;
        /* stop well before the action buttons */
        right: 68px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        z-index: 2;
      }

      .title-row {
        display: flex;
        align-items: baseline;
        gap: 8px;
        overflow: hidden;
      }

      .post-title {
        font-size: 0.9rem;
        font-weight: 700;
        color: #fff;
        text-shadow: 0 1px 4px rgba(0,0,0,0.6);
        margin: 0;
        line-height: 1.2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
        flex: 1 1 auto;
      }

      .post-date {
        font-size: 0.62rem;
        font-weight: 500;
        color: rgba(255,255,255,0.72);
        text-shadow: 0 1px 3px rgba(0,0,0,0.5);
        white-space: nowrap;
        flex-shrink: 0;
      }

      .post-description {
        font-size: 0.72rem;
        color: rgba(255,255,255,0.88);
        text-shadow: 0 1px 3px rgba(0,0,0,0.55);
        margin: 0;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      @media (prefers-color-scheme: dark) {
        .author-pill {
          background: rgba(30,30,30,0.92);
        }
        .author-name { color: #eee; }
        .author-meta { color: #aaa; }
      }
    `;
  }

  render() {
    const authorImg     = this.author?.image   ?? "";
    const authorName    = this.author?.name    ?? "";
    const authorSince   = this.author?.since   ?? "";
    const authorChannel = this.author?.channel ?? "";
    const dateLabel     = this._formatDate(this.dateTaken);

    const metaParts = [];
    if (authorChannel) metaParts.push(authorChannel);
    if (authorSince)   metaParts.push(`since ${authorSince}`);
    const authorMetaLine = metaParts.join(" · ");

    return html`
      <img
        class="bg-image"
        src="${this.imageUrl}"
        alt="${this.title}"
        loading="lazy"
      />

      <div class="scrim"></div>

      <div class="author-pill">
        <img
          class="author-avatar"
          src="${authorImg}"
          alt="${authorName}"
          @error="${(e) => { e.target.style.display = "none"; }}"
        />
        <div class="author-text">
          <span class="author-name">${authorName}</span>
          ${authorMetaLine
            ? html`<span class="author-meta">${authorMetaLine}</span>`
            : ""}
        </div>
      </div>

      <div class="actions">
        <div class="action-wrap">
          <button
            class="action-btn ${this.liked ? "liked" : ""}"
            @click="${this.toggleLike}"
            title="${this.liked ? "Unlike" : "Like"}"
          >
            <img
              class="action-icon"
              src="${this.liked ? this.iconLiked : this.iconLike}"
              alt="${this.liked ? "Unlike" : "Like"}"
            />
          </button>
          <span class="action-label">${this.liked ? "Liked" : "Like"}</span>
        </div>

        <div class="action-wrap">
          <button
            class="action-btn"
            @click="${() => console.log("share")}"
            title="Share"
          >
            <img class="action-icon" src="${this.iconShare}" alt="Share" />
          </button>
          <span class="action-label">Share</span>
        </div>

        <div class="action-wrap">
          <button
            class="action-btn"
            @click="${() => console.log("favorite")}"
            title="Save"
          >
            <img class="action-icon" src="${this.iconSave}" alt="Save" />
          </button>
          <span class="action-label">Save</span>
        </div>
      </div>

      <div class="description-block">
        <div class="title-row">
          <p class="post-title">${this.title}</p>
          ${dateLabel ? html`<span class="post-date">${dateLabel}</span>` : ""}
        </div>
        <p class="post-description">${this.description}</p>
      </div>
    `;
  }
}

customElements.define(ImageCard.tag, ImageCard);