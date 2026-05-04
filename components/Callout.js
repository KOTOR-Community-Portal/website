function Callout(content, opts) {
  const htmlUtils = utils.html;

  const defaultOpts = { className: "note" };
  const defaultIcons = Object.fromEntries(["info", "success", "note", "warning", "error"]
    .map((k) => [k, `/images/callouts/${k}.svg`])
  );

  const className = opts.className || defaultOpts.className;
  const type = className.substring(className.indexOf(' '));
  const id = htmlUtils.id(`callout-${type}`, { index: true });
  const labelId = htmlUtils.id(id + "-label");
  const title = opts.title || (type.charAt(0).toUpperCase() + type.substring(1));
  const icon = opts.icon === true ? defaultIcons[type] : opts.icon;
  
  return html`
    <div id=${id} class="${htmlUtils.formatClass("callout", className)}" role="note" aria-labelledby=${labelId}>
      ${icon && html`<img src=${icon} alt="" />`}
      <strong id=${labelId}>${title}</strong>
      <div>${content}</div>
    </div>
`;
}