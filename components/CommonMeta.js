function CommonMeta() {
  const { page } = ctx;
  return html`
    <title>${page.title} - KOTOR Community Portal</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
  `;
}
