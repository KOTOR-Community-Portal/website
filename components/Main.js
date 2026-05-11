function Main(content, asideContent) {
  const MAX_PROMOTIONS = 15;
  const MIN_PROMOTION_GAP = 5;
  const MIN_TEXT_LENGTH = 600;
  const MIN_LINE_COUNT = 5;

  const htmlUtils = utils.html;
  const { page } = ctx;

  return htmlUtils.parse(content, (parent) => {
    const ids = htmlUtils.ids(["aside"]);
    const [first, ...rest] = htmlUtils.divide(parent.children, "h1, h2").map((x) => {
      const { element, list } = x;
      if (list) {
        const box = htmlUtils.wrap(list, html`<div class="box"></div>`);
        htmlUtils.group(box.children, "h3").forEach((x) => {
          htmlUtils.wrap(x, html`<div></div>`);
        });
        return box;
      }
      return element;
    });

    // Place promotions
    const prom = Promotion("mdRect");
    const slots = rest.map((x) => [...x.children]).flat();
    const openIndices = slots
      .flatMap((x, i) =>
        !x.querySelector("img, table, hr, .callout") &&
          (x.textContent.length >= MIN_TEXT_LENGTH ||
            [...x.querySelectorAll("p")].length >= MIN_LINE_COUNT)
          ? [i] : []
      );
    const gap = Math.max(slots.length / MAX_PROMOTIONS, MIN_PROMOTION_GAP); 
    const promIndices = [];
    let i = 0;
    while (i < openIndices.length) {
      const pi = openIndices[i];
      promIndices.push(pi);
      while (i < openIndices.length && pi + gap > openIndices[i]) ++i;
    }
    promIndices.forEach((i) => slots[i].insert(htmlUtils.adjacentPosition.beforebegin, prom));
    
    // h1s behave like h2s on pages with multiple articles
    const hasArticles = [...parent.querySelectorAll("h1")].length > 1;
    const h = hasArticles ? "h1" : "h2";

    const metadata = Metadata(page.tokens.main, page.tokens.meta);
    const modified = metadata && (metadata.modified_on || new Date().toISOString());

    const heading = first.outerHtml;
    const body = htmlUtils.group(rest, h).map((x) => {
      const [f, ...r] = x;
      if (f && r && f.localName === h) {
        const ids = htmlUtils.ids(["collapse", "label"].map((x) => [x, `${f.id}-${x}`]));
        const text = r.map((y) => y.outerHtml).join("");
        return CollapseTrigger(ids.collapse, ids.label, f.outerHtml) +
          Collapse(ids.collapse, ids.label, text);
      }
      return x.map((y) => y.outerHtml);
    });
    return html`
      <div class="col">
        ${heading}
        ${modified && LastModified(modified)}
        ${asideContent && html`
        <div id="${ids.aside}" class="aside">
          <div>
            ${Aside(ids.aside, asideContent)}
          </div>
        </div>
        `}
        <div class="copy">
          ${hasArticles ? body.map((x) => html`<article>${x}</article>`) : body}
        </div>
      </div>
    `
  });
}
