function Article() {
  const { page } = ctx;
  return Layout({
    main: () => ({ content: Markdown(page.tokens.main, { ids: true }) }),
    aside: () => ({ content: Markdown(page.tokens.aside) }),
    footer: () => ({ content: Footer() })
  });
}
