function Breadcrumb(page, current) {
  const { path, title } = page;
  return html`<a href="${path}" aria-current="${current}">${title}</a>`;
}

function Breadcrumbs() {
  const siteUtils = utils.site;
  const { page } = ctx;
  const ancestors = siteUtils.getAncestors(page);
  if (ancestors.length <= 1) {
    return;
  }
  ancestors.reverse();
  return html`
    <nav class="crumbs" aria-label="Breadcrumbs">
      <ol>
        ${ancestors.map((x) => html`<li>${Breadcrumb(x, "false")}</li>`)}
        <li>${Breadcrumb(page, "page")}</li>
      </ol>
    </nav>
  `;
}
