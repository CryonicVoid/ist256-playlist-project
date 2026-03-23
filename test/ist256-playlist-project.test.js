import { html, fixture, expect } from '@open-wc/testing';
import "../ist256-playlist-project.js";

describe("Ist256PlaylistProject test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <ist256-playlist-project
        title="title"
      ></ist256-playlist-project>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
