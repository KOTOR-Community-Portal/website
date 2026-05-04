function Promotion(size) {
  const img = html`<img src="/images/clear.png" alt="" />`
  return size
    ? html`<div class="prom" data-size="${size}">${img}</div>`
    : html`<div class="prom">${img}</div>`
}
