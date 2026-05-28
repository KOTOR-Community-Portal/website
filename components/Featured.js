function Featured(ids) {
  const { page, site } = ctx;
  const items = Object.values(site.pages).filter((x) =>
    Number.isInteger(parseInt(x.tokens.featured || ""))
  );
  items.sort(
    (a, b) => parseInt(a.tokens.featured) - parseInt(b.tokens.featured)
  );
  const defaultIcon = "images/icons/datapad.png";
  const heading = html`<h2>Featured</h2>`;
  const box = html`
    <div class="box feat">
      <ul class="scroll">
        ${items.map((x) => {
          const { path, title, tokens } = x;
          const current = path === page.path ? "page" : "false";
          return html`<li>
            <a href="${path}" aria-current="${current}">
              <img src="${tokens.icon || defaultIcon}" alt="" />
              <span>${title}</span>
            </a>
          </li>`;
        })}
      </ul>
    </div>
  `;
  return CollapseTrigger(ids.collapse, ids.label, heading, { hasSetting: true }) +
    Collapse(ids.collapse, ids.label, box);
}
