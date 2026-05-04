function SubpageMenu() {
  const { page, site } = ctx;
  return Layout({
    main: () => ({
      class: "subpages",
      content: html`
        <h1>${page.title}</h1>
        <nav aria-label="Subpages">
          <ul>
            ${JSON.parse(page.tokens.subpages).map(x => {
              const subpage = site.pages[x];
              const href = x;
              const title = subpage.tokens.longTitle || subpage.title;
              const src = subpage.tokens.flat;
              return html`
                <li>
                  <a href="/${href}">
                    <span><img src="${src}" alt="${title}"></span>
                    <span>${title}</span>
                  </a>
                </li>
              `;
            })}
          </ul>
        </nav>
        ${Promotion("mobileBnr")}
      `
    }),
    aside: () => ({ content: Markdown(page.tokens.aside) })
  });
}
