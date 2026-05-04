function Header() {
  return html`
    ${Branding()}
    <div class="navbar">${HamburgerButton()}${Breadcrumbs() || Blurb()}${PrimaryNavigation()}</div>
  `;
}
