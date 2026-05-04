function Body(sections) {
  const { header, main, right, toc, featured, footer, modal } = sections;
  const htmlUtils = utils.html;
  const ids = htmlUtils.ids(["loading", "lyt"]);
  return html`
    <body>
      <div id="${ids.lyt}" class="lyt">
        <header class="${header.class}">${header.content}</header>
        <main id="${main.id}" class="${main.class}">
          ${main.content}
        </main>
        ${toc && html`
          <nav id="${toc.id}" class="${toc.class}" aria-labelledby="${toc.ids.label}">
            <div class="col">${toc.content}</div>
          </nav>`
        }
        ${featured && html`
          <section id="${featured.id}" class="${featured.class}" aria-labelledby="${featured.ids.label}">
            <div class="col">${featured.content}</div>
          </section>`
        }
        <section class="${right.class}"></section>
        <footer id="${footer.id}" class="${footer.class}">${footer.content}</footer>
      </div>
      <section
        id=${modal.id} class="${modal.class}" tabindex="-1" role="dialog" aria-label="Menu" aria-hidden="true"
      >
        ${modal.content}
        </section>
      <div id="${ids.loading}"></div>
      <script>
        onLoad();
      </script>
    </body>
  `;
}
