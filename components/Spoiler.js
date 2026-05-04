function Spoiler(id, text) {
  return html`
    <button type="button" aria-expanded="false" aria-controls="${id}">
        <span class="mask-show"></span><span class="sr-only" aria-hidden="false">Reveal spoiler</span><span class="mask-hide"></span><span class="sr-only" aria-hidden="true">Hide spoiler</span>
    </button>
    <span id="${id}" inert>${text}</span>
  </span>
  `;
}
