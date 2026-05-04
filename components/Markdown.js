function Markdown(path, opts) {
  const htmlUtils = utils.html;
  const md = utils.fs.readFile(path);
  const content = htmlUtils.fromMarkdown(md);
  return opts && opts.ids
    ? htmlUtils.parse(content, (parent) => {
        // Assign IDs to heading elements
        [...parent.querySelectorAll(htmlUtils.query.heading)].forEach((x) =>
          htmlUtils.giveId(x)
        );
        // Insert spoiler components
        [...parent.querySelectorAll(".spoiler")].forEach((x) => {
          const id = htmlUtils.id("spoiler");
          x.innerHtml = Spoiler(id, x.innerHtml);
          x.setAttribute("role", "group");
          x.setAttribute("aria-label", "Spoiler");
          x.setAttribute("data-hidden", "");
          // Remove trailing whitespace if next text does not start with a word character
          if (x.nextSibling
            && /^[^\w]/.test(x.nextSibling.textContent)
            && /^\s*$/.test(x.lastChild.textContent)) {
            x.removeChild(x.lastChild);
          }
        });
        // Replace callouts with semantic HTML
        [...parent.querySelectorAll(".note, .warning")].forEach((x) => {
          const callouts = [...x.querySelectorAll("dl")].map((dl) => {
            return htmlUtils.group(dl.children, "dt").map((group) => {
              const [first, ...rest] = group;
              const [title, content] = first.localName === "dt"
                ? [first.innerHtml, rest.map((y) => y.innerHtml)]
                : [null, group.map((y) => y.innerHtml)];
              return Callout(content, { className: x.className, title, icon: null });
            });
          }).flat();
          callouts.forEach((c) => x.insert(htmlUtils.adjacentPosition.beforebegin, c));
          x.remove();
        });
        return parent.innerHtml;
      })
    : content;
}
