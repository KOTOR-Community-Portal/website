function Collapse(id, labelId, content, opts) {
  const htmlUtils = utils.html;
  const { collapsed, direction } = opts || {};
  const cls = htmlUtils.formatClass(
    direction === "horizontal" ? "collapse-horizontal" : "collapse",
    collapsed ? "" : "show"
  );
  return html`
    <div id="${id}" class="${cls}" role="region" aria-labelledby="${labelId}">
      ${content}
    </div>
  `;
}

function CollapseTrigger(targetId, labelId, content, opts) {
  const { collapsed, hasSetting } = opts || {};
  const htmlUtils = utils.html;
  return htmlUtils.parse(content, (parent) => {
    const e = parent.firstElementChild;
    e.innerHtml = html`
      <span id="${labelId}">${e.innerHtml}</span>
      <button
        data-bs-toggle="collapse"
        data-bs-target="#${targetId}"
        aria-labelledby="${labelId}"
        aria-controls="${targetId}"
        aria-expanded="${collapsed ? "false" : "true"}"
      ></button>
    `;
    if (hasSetting) e.querySelector("button").setAttribute("data-setting", "");
    return e.outerHtml;
  });
}
