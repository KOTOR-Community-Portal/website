function HamburgerMenu() {
  const htmlUtils = utils.html;
  const saveId = htmlUtils.id("menu-save");
  return html`
    <div class="modal-dialog modal-fullscreen" role="document">
      <div class="modal-content">
        <div class="comp box">
          <div class="scroll">
            <div class="mdl-header">
              <div>
                <h2>Settings</h2>
              </div>
            </div>
            <div class="mdl-body">
              <div>
                <div class="box">
                  <div class="scroll">
                    ${Settings()}
                  </div>
                </div>
              </div>
            </div>
            <div class="mdl-footer">
              <button
                type="button"
                data-bs-dismiss="modal"
              >
                <span class="mask-cancel" aria-hidden="true"></span><span>Cancel</span><span aria-hidden="true"></span>
              </button>
              <button
                id="${saveId}"
                type="button"
              >
                <span aria-hidden="true"></span><span>Save</span><span class="mask-check" aria-hidden="true"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
