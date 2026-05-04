function Settings() {
  const htmlUtils = utils.html;
  const ids = htmlUtils.ids(["theme", "preview"]);
  const themes = ["KOTOR 1", "KOTOR 2"]
    .map((label) => {
      const value = label.replace(" ", "").toLowerCase();
      const id = htmlUtils.id("theme-" + value);
      return { id, label, value };
    });
  return html`
    <fieldset id="${ids.theme}">
      <legend>Theme</legend>
      <div>
        ${themes.map(
          (x) => html`
          <div class="field">
            <input type="radio" id=${x.id} name="theme" value="${x.value}" />
            <label for="${x.id}">${x.label}</label>
          </div>
          `
        )}
      </div>
      <div id="${ids.preview}"></div>
    </fieldset>
  `;
}
