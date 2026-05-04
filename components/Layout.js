function Layout(fns) {
  const htmlUtils = utils.html;
  const ids = htmlUtils.ids(["main", "toc", "feat", "footer", "menu"]);
  const { page } = ctx;

  const collapseIds = (id) => htmlUtils.ids(["collapse", "label"].map((x) => [x, `${id}-${x}`]));
  const computeClass = (name, ...args) => {
    const key = "class" + name.charAt(0).toUpperCase() + name.substring(1);
    return htmlUtils.formatClass(name, page.tokens[key], ...args);
  };

  const header = { class: computeClass("header"), content: Header() };

  const main = fns.main && fns.main();
  const mainContent = main && main.content;
  const asideContent = fns.aside && fns.aside().content;
  if (main) {
    main.id = ids.main;
    main.class = computeClass("main", main.class),
    main.content = Main(mainContent, asideContent);
  }

  const tocIds = collapseIds(ids.toc);
  const toc = page.tokens.sidebar === "toc" && {
    id: ids.toc,
    ids: tocIds,
    class: computeClass("sidebar", "first"),
    content: TableOfContents(tocIds, mainContent)
  };
  const featuredIds = collapseIds(ids.feat);
  const featured = !toc && {
    id: ids.feat,
    class: computeClass("sidebar"),
    ids: featuredIds,
    content: Featured(featuredIds)
  };

  const footer = { id: ids.footer, class: computeClass("footer"), content: Footer() };

  const modal = { id: ids.menu, class: "modal fade", content: HamburgerMenu() };

  const right = {};

  return Head() + Body({ header, main, toc, featured, footer, right, modal });
}
