function TableOfContents(ids, content) {
  const htmlUtils = utils.html;
  const { page, site } = ctx;
  return htmlUtils.parse(content, (node) => {
    const isTopLevel = !page.parent || page.parent === "index.html";
    const title = isTopLevel ? page.title : site.pages[page.parent].title;
    const query = isTopLevel ? htmlUtils.query.heading.substring(htmlUtils.query.heading.indexOf(" ") + 1) : htmlUtils.query.heading;
    let previousLevel = isTopLevel ? 2 : 1;
    const toc = html`
      <ol>
        ${[...node.querySelectorAll(query)].map((x) => {
          const currentLevel = Number.parseInt(x.tagName.charAt(1));
          const href = `#${x.getAttribute("id")}`;
          const s =
            "<li><ol>".repeat(Math.max(currentLevel - previousLevel, 0)) +
            "</ol></li>".repeat(Math.max(previousLevel - currentLevel, 0)) +
            html`<li><a href=${href}>${x.innerHtml}</a></li>`;
          previousLevel = currentLevel;
          return s;
        })}
      </ol>
    `;
    const heading = html`<h2>Contents</h2>`;
    const box = html`
      <div class="box toc">
        <div class="frame-top">
          <strong>${title}</strong>
        </div>
        <div class="scroll">${toc}</div>
        <div class="frame-bottom"></div>
      </div>
    `;
    return CollapseTrigger(ids.collapse, ids.label, heading, { hasSetting: true }) +
      Collapse(ids.collapse, ids.label, box);
  });
}
