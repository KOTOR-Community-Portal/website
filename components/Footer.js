function Footer() {
  return html`
    ${Socials()}
    <div class="corner">
      <button
        id="back-to-top"
        data-bs-toggle="tooltip"
        data-bs-title="Back to Top"
        data-bs-custom-class="bubble"
        aria-label="Back to top"
      >
        <span class="mask-arrow-top"></span> 
      </button>
      <div class="portrait">
        <div></div>
        <img src="/images/ui/portrait.png" alt="KOTOR-style character portrait of wide Geralt" />
        <div></div>
      </div>
    </div>
  `
}