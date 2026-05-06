function ArticleFeed() {
  const htmlUtils = utils.html;
  const { page } = ctx;
  return Layout({
    main: () => {
      const articles = [...utils.fs.readdir(page.tokens.feed, false)]
        .sort((a, b) => a < b)
        .map((x) => htmlUtils.parse(Markdown(x, { ids: true }), (parent) => {
            const h1 = parent.querySelector("h1");
            const name = /(?:.*[/\\])?(.*)\.[^.]*/.exec(x)[1];
            const time = html`<time value="${name}">${name}</time>`;
            h1.insert(htmlUtils.adjacentPosition.afterbegin, time);
            return parent.innerHtml;
        }))
      const content = html`<h1>News</h1>${articles}`;
      return { content };
    },
    aside: () => ({ content: Markdown(page.tokens.aside) }),
    footer: () => ({ content: Footer() })
  });
}
