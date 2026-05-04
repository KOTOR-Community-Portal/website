function Redirect() {
  const { page } = ctx;
  const url = `"${page.tokens.url || "/"}"`;
  return html`
    <head>
      ${CommonMeta()}
    </head>
    <body>
      <script>document.location.replace(${url});</script>
    </body>
  `;
}
