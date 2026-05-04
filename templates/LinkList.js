function LinkList() {
  const htmlUtils = utils.html;
  const { page } = ctx;
  const MAX_PROMOTIONS = 3;
  return Layout({
    main: () => ({
      content: htmlUtils.parse(Markdown(page.tokens.main, { ids: true }), (parent) => {
        const headings = htmlUtils.query.heading.split(", ");
        // List
        [...parent.querySelectorAll("ul:not(.callout ul)")].forEach((ul) => ul.classList.add("icons"));
        // Paragraphs
        [...parent.querySelectorAll("p > img:only-child")].map((img) => {
          const group = [];
          let el = img.parentElement;
          while (el && !headings.includes(el.localName)) {
            // p -> span
            if (el.localName === "p") {
              el = htmlUtils.replace(el, "span");
            }
            group.push(el);
            el = el.nextElementSibling;
          };
          // Add space between spans
          for (let i = 1; i < group.length - 1; ++i) {
            htmlUtils.appendTextNode(group[i], " ");
          }
          return group;
        }).forEach((x) => htmlUtils.wrap(x, html`<p class="icons"></p>`));
        // Place promotions
        const prom = Promotion("mobileBnr");
        const groups = [...htmlUtils.divide(parent.children, "h2")];
        if (groups.length < MAX_PROMOTIONS) {
          const hasSummary = groups[0] && groups[0].list;
          for (let i = hasSummary ? 1 : 0; i < groups.length; ++i) {
            const { list } = groups[i];
            const slot = list && list[list.length - 1];
            if (slot) slot.insert(htmlUtils.adjacentPosition.afterend, prom);
          }
        }
        else {
          const group = groups[groups.length - 1];
          const slot = group && group.list && group.list[group.list.length - 1];
          if (slot) slot.insert(htmlUtils.adjacentPosition.afterend, prom);
        }
        return parent.innerHtml;
      })
    }),
    aside: () => ({
      content: Markdown(page.tokens.aside)
    }),
    footer: () => ({
      content: Footer()
    })
  });
}
