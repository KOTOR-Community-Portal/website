function Socials() {
  const htmlUtils = utils.html;
  const count = 6;
  const socials = [
      { label: "Discord", url: "https://discord.gg/kotor#rules", img: "/images/logos/discord.svg" },
      { label: "Deadly Stream", url: "https://deadlystream.com", img: "/images/logos/deadly-stream.png" },
      { label: "GitHub", url: "https://github.com/KOTOR-Community-Portal", img: "/images/logos/github.svg" }
  ];
  const filler = [...Array(count - socials.length)];
  const id = htmlUtils.id("soc");
  return html`
    <div id="${id}" class="soc">
      <ul>
        ${socials.map((x) => {
          const { label, url, img } = x;
          return html`
            <li
              data-bs-toggle="tooltip"
              data-bs-title="${label}"
              data-bs-custom-class="label"
            >
            <a
              href="${url}"
              aria-label="${label}"
            >
              <img src="${img}" alt="${label} logo" />
            </a>
          </li>`;
        })}
        ${filler.map((_) => {
          return html`<li aria-hidden="true"><span></span></li>`;
        })}
      </ul>
    </div>
  `;
}
