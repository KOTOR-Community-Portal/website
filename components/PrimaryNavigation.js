function PrimaryNavigation() {
  const siteUtils = utils.site;
  const { page, site } = ctx;
  const ancestorPaths = siteUtils.getAncestors(page).map((x) => x.path);
  const pages = Object.values(site.pages).filter((x) =>
    Number.isInteger(parseInt(x.tokens.nav || ""))
  );
  pages.sort((a, b) => parseInt(a.tokens.nav) - parseInt(b.tokens.nav));
  const current = (path) => {
    if (path === page.path) return "page";
    if (ancestorPaths.includes(path)) return "true";
    return "false";
  };
  return html`
    <nav class="nav" aria-label="Primary">
      <ul>
        ${pages.map((x) => {
          const { path, title, tokens } = x;
          return html`<li
              data-bs-toggle="tooltip"
              data-bs-title="${title}"
              data-bs-custom-class="bubble"
            >
            <a
              href="${path}"
              aria-label="${title}"
              aria-current="${current(path)}"
            >
              <span class="${tokens.mask}"></span>
            </a>
          </li>`;
        })}
      </ul>
    </nav>
  `;
}
