function LastModified(iso) {
  const htmlUtils = utils.html;

  const img = "/images/icons/calendar.png";
  const locale = "en-US";
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const id = htmlUtils.id("last-modified");
  const labelId = htmlUtils.id(id + "-label");
  const localeDate = new Date(iso).toLocaleDateString(locale, options);
  const date = localeDate.substring(localeDate.indexOf(" ") + 1);
  
  return html`
    <div id=${id} class="modified" role="note" aria-labelledby=${labelId}>
      <img src="${img}" alt="" />
      <strong id=${labelId}>Last Modified</strong>
      <time datetime="${iso}">${date}</time>
    </div>
`;
}