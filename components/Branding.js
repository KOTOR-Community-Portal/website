function Branding() {
  const htmlUtils = utils.html;
  const siteUtils = utils.site;
  const { page } = ctx;
  const home = siteUtils.home;
  const id = htmlUtils.id("brand");
  const current = page.path === home.path ? "page" : "false";
  return html`
    <a
      id="${id}"
      href="${home.path}"
      class="brand alignment"
      aria-label="${home.title}"
      aria-current="${current}"
    >
      <img alt="" class="logo" />
      <div class="overlay"></div>
    </a>
  `;
}
