import { LitElement, html, css } from "lit";

export class ImageCard extends LitElement {
  static get tag() { return "image-card"; }

  static get properties() {
    return {
      imageUrl: { type: String },
      title: { type: String },
      description: { type: String },
      author: { type: Object }, // { name, image, since, channel }
      id: { type: Number },
      liked: { type: Boolean } // reactive property
    };
  }

  constructor() {
    super();
    this.imageUrl = "";
    this.title = "";
    this.description = "";
    this.author = { name: "", image: "", since: "", channel: "" };
    this.id = 0;
    this.liked = JSON.parse(localStorage.getItem("likes") || "{}")[this.id] || false;
  }

  // Save like state
  toggleLike() {
    this.liked = !this.liked;
    const likes = JSON.parse(localStorage.getItem("likes") || "{}");
    likes[this.id] = this.liked;
    localStorage.setItem("likes", JSON.stringify(likes));
  }

  // Dummy buttons
  dislike() {
    console.log("Dislike clicked, no storage needed");
  }
  favorite() {
    console.log("Favorite clicked, no storage needed");
  }

  static get styles() {
    return css`
      :host {
        display: block;
        position: relative;
        width: 100%;
        max-width: 400px;
        margin: 1rem auto;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      }
      img {
        width: 100%;
        height: auto;
        display: block;
      }
      .overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background: rgba(0,0,0,0.6);
        color: white;
        padding: 0.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .metadata {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .author {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .author img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }
      .buttons {
        display: flex;
        gap: 0.5rem;
      }
      button {
        background: rgba(255,255,255,0.2);
        border: none;
        padding: 0.3rem 0.5rem;
        color: white;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        transition: 0.2s;
      }
      button:hover {
        background: rgba(255,255,255,0.4);
      }
      button.liked {
        background: red;
      }
    `;
  }

  render() {
    return html`
      <img src="${this.imageUrl}" alt="${this.title}" loading="lazy" />
      <div class="overlay">
        <div class="metadata">
          <div class="author">
            <img src="${this.author.image}" alt="${this.author.name}" />
            <span>${this.author.name}</span>
          </div>
          <span>${this.title}</span>
        </div>
        <div class="description">
          ${this.description}
        </div>
        <div class="buttons">
          <button 
            class=${this.liked ? "liked" : ""} 
            @click="${this.toggleLike}"
          >
            👍 Like
          </button>
          <button @click="${this.dislike}">👎 Dislike</button>
          <button @click="${this.favorite}">⭐ Favorite</button>
        </div>
      </div>
    `;
  }
}

customElements.define(ImageCard.tag, ImageCard);