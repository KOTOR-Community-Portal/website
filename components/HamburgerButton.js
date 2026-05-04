function HamburgerButton() {
    return html`
        <div class="burger">
            <button id="menu-open" type="button" data-bs-toggle="modal" data-bs-target="#menu" aria-label="Open menu">
                <span class="mask-tribar"></span>    
            </button>
        </div>
    `;
}
