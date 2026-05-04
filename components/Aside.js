function Aside(id, content) {
  const htmlUtils = utils.html;
  return htmlUtils.parse(content, (parent) => {
    htmlUtils.minHeadings(parent, 2);
    const collapseId = htmlUtils.id(id + "-collapse");
    const labelId = htmlUtils.id(id + "-label");
    const [heading, ...rest] = parent.children;
    const scroll = htmlUtils.wrap(rest, html`<div class="scroll"></div>`);
    const box = htmlUtils.wrap([scroll], html`<div class="box"></div>`);
    return (
      CollapseTrigger(collapseId, labelId, heading.outerHtml) +
      Collapse(collapseId, labelId, box.outerHtml)
    );
  });
}
