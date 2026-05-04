const breakpoint = {
  width: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536,
    u: 2000,
  },
};

function checkDay(date, condition) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if (Number.isInteger(condition.day))
    return month === condition.month && day === condition.day;
  if (Number.isInteger(condition.weekday) && Number.isInteger(condition.n))
    return (
      month === condition.month &&
      day === getWeekdayInMonth(date, condition.weekday, condition.n).getDate()
    );
  return false;
}

function checkMonth(date, condition) {
  const month = date.getMonth() + 1;
  return Number.isInteger(condition.month) && condition.month == month;
}

function checkWeek(date, condition) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if (
    Number.isInteger(condition.start_day) &&
    Number.isInteger(condition.end_day)
  )
    return (
      month === condition.month &&
      day >= condition.start_day &&
      day <= condition.end_day
    );
  if (condition.week === "first")
    return (
      month === condition.month &&
      isWithinWeek(date, getWeekdayInMonth(date, 1, 1))
    );
  if (condition.week === "last")
    return (
      month === condition.month &&
      isWithinWeek(date, getStartOfLastWeekInMonth(date))
    );
  if (Number.isInteger(condition.week))
    return (
      month === condition.month &&
      isWithinWeek(date, getWeekdayInMonth(date, 1, condition.week))
    );
  return false;
}

function createThemePreview(parent) {
  if (!parent) return;

  const iframe = parent.appendChild(document.createElement("iframe"));
  Object.defineProperty(iframe, "setTheme", {
    value: (value) => {
      const el = iframe.contentWindow.document.documentElement;
      if (el) el.className = value;
      iframe.parentElement.className = value;
    }
  });

  iframe.tabIndex = -1;
  iframe.ariaHidden = true;
  iframe.title = "Theme preview";

  const head = document.head?.outerHTML ?? "";
  const body = document.querySelector("div")?.outerHTML ?? "";
  const html = `<!doctype html><html><head>${head}</head><body>${body}</body></html>`;
  iframe.srcdoc = html;

  const onChange = (e) => iframe.setTheme(e.target.value);
  document.querySelectorAll("input[name='theme']")
    .forEach(x => x.addEventListener("change", onChange));

  return iframe;
}

function determineDay(date, conditions) {
  for (const key in conditions.days)
    if (checkDay(date, conditions.days[key])) return key;
  for (const key in conditions.weeks)
    if (checkWeek(date, conditions.weeks[key])) return key;
  for (const key in conditions.months)
    if (checkMonth(date, conditions.months[key])) return key;
}

function formatDimensionQuery(dim, min, max) {
  return [
    min !== undefined && `(min-${dim}: ${min}px)`,
    max !== undefined && `(max-${dim}: ${max}px)`,
  ]
    .filter(Boolean)
    .join(" and ");
}

function getFocusableElements(parent) {
  parent ??= document.body;
  return $(parent).find(
    `a,
     button,
     input,
     textarea,
     select,
     details,
     iframe,
     embed,
     object,
     summary,
     dialog,
     audio[controls],
     video[controls],
     [contenteditable],
     [tabindex]
    `
  )
    .filter((_, e) => !e.hasAttribute("disabled") && !e.hasAttribute("hidden"))
    .filter(":visible");
}

function getLocalOrSession(key) {
  return typeof window.localStorage != "undefined"
    ? localStorage[key]
    : sessionStorage[key];
}

function getStartOfLastWeekInMonth(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  var endOfMonth = new Date(date.getTime());
  endOfMonth.setMonth(month + 1);
  endOfMonth.setDate(0);
  const day = endOfMonth.getDate() - 6 - endOfMonth.getDay();
  return new Date(year, month, day);
}

function getTheme() {
  return getLocalOrSession("theme");
}

async function getToday(url) {
  const params = new URLSearchParams(window.location.search);
  const date = parseISODateInLocalTime(params.get("date")) ?? new Date();
  const json = await fetch(url).then((result) => result.json());
  const { conditions, data } = json;
  const day = determineDay(date, conditions);
  return { date, data: day ? data[day] : data.standard };
}

function getWeekdayInMonth(date, weekday, n) {
  var d = new Date(date.getFullYear(), date.getMonth(), 1);
  d.setDate(1 + ((weekday - d.getDay() + 7) % 7) + (n - 1) * 7);
  return d;
}

function isWithinWeek(date, startOfWeek) {
  const endOfWeek = new Date(
    startOfWeek.getFullYear(),
    startOfWeek.getMonth(),
    startOfWeek.getDate() + 6
  );
  return date >= startOfWeek && date <= endOfWeek;
}

function loadBreadcrumbs() {
  const get = () => {
    const group = Array.from(document.querySelectorAll(".crumbs li > *"));
    if (group.length === 0) return [undefined, []];
    const [solo] = group.splice(group.length > 1 ? group.length - 2 : 0, 1);
    return [solo, group];
  };
  const doSolo = (e, event) => {
    if (event.matches) e.parentElement.classList.remove("solo");
    else e.parentElement.classList.add("solo");
  };
  const doActive = (e, event) => {
    if (event.matches) {
      e.parentElement.classList.remove("sr-only");
      e.inert = false;
    } else {
      e.parentElement.classList.add("sr-only");
      e.inert = true;
    }
  };
  const fns = {
    "xl-": (event) => {
      const [solo, rest] = get();
      if (solo) doSolo(solo, event);
      rest.forEach((e) => doActive(e, event));
    },
    "md-": (event) => {
      const [solo, _] = get();
      if (solo) doActive(solo, event);
    },
  };
  for (let key in fns) {
    const [min, max] = parseBreakpoint(breakpoint.width, key);
    const mql = window.matchMedia(formatDimensionQuery("width", min, max));
    const fn = fns[key];
    mql.addEventListener("change", fn);
    fn(mql);
  }
}

function loadCollapseBreakpoints() {
  const ranges = {
    ".sidebar *": "-md",
    ".aside *": "-u",
  };
  const doChange = (e, event) => {
    if (event.matches) {
      e.style.display = "";
    } else {
      e.style.display = "none";
      if (e.getAttribute("aria-expanded") === "false") {
        document
          .querySelectorAll(e.getAttribute("data-bs-target"))
          .forEach((target) => {
            bootstrap.Collapse.getInstance(target).toggle();
          });
      }
    }
  };
  for (let key in ranges) {
    const [min, max] = parseBreakpoint(breakpoint.width, ranges[key]);
    const mql = window.matchMedia(formatDimensionQuery("width", min, max));
    const onChange = (event) =>
      document
        .querySelectorAll(`${key}[data-bs-toggle='collapse']`)
        .forEach((e) => doChange(e, event));
    mql.addEventListener("change", onChange);
    onChange(mql);
  }
}

function loadCollapseScrolling() {
  const minDelta = 2;
  const scroll = {
    behavior: "smooth",
    block: "center",
    container: "nearest",
  };
  const rects = new Map();
  const onShow = (event) => {
    setTimeout(() => {
      const target = event.target;
      rects.set(target, target.getBoundingClientRect());
    }, 1);
  };
  const onShown = (event) => {
    const target = event.target;
    if (!rects.has(target)) return;
    const rect0 = rects.get(target);
    rects.delete(target);
    const rect = target.getBoundingClientRect();
    const delta = Math.abs(
      target.classList.contains("collapse-horizontal")
        ? rect0.x - rect.x
        : rect0.y - rect.y
    );
    if (delta < minDelta) return;
    target.scrollIntoView(scroll);
  };
  $(".collapse").each(function () {
    $(this).on("show.bs.collapse", onShow);
    $(this).on("shown.bs.collapse", onShown);
  });
}

async function loadEggs() {
  const { data } = await getToday("/eggs.json");
  if (!data) return;

  const ul = document.querySelector("#soc ul");
  if (!ul || !ul.lastElementChild) return;

  const li = ul.lastElementChild;
  li.removeChild(li.firstElementChild);

  li.removeAttribute("aria-hidden");
  li.setAttribute("data-bs-toggle", "tooltip");
  li.setAttribute("data-bs-title", data.label);
  li.setAttribute("data-bs-custom-class", "label");

  const a = li.appendChild(document.createElement("a"));
  a.href = data.url;
  a.ariaLabel = data.label;
  a.rel = "external nofollow";

  const img = a.appendChild(document.createElement("img"));
  img.src = data.img;
  img.alt = data.alt;
}

function loadFooter() {
  const backToTop = document.getElementById("back-to-top");
  backToTop?.addEventListener("click", (_) => {
    const lyt = document.getElementById("lyt");
    if (lyt) lyt.scrollTop = 0;
    const els = getFocusableElements();
    if (els.length > 0) els[0].focus();
  });
}

async function loadHeader() {
  const { date, data } = await getToday("/days.json");
  const blurb = document.getElementById("blurb");
  if (blurb) {
    $(blurb).html(data.blurb);
    
    const [min, max] = parseBreakpoint(breakpoint.width, "xl-");
    const mql = window.matchMedia(formatDimensionQuery("width", min, max));
    const fn = (event) => {
      const e = document.getElementById("blurb");
      if (!e) return;
      if (event.matches) {
        e.classList.remove("sr-only");
        e.inert = false;
      } else {
        e.classList.add("sr-only");
        e.inert = true;
      }
    };
    mql.addEventListener("change", fn);
    fn(mql);
  }
  const brand = document.getElementById("brand");
  if (brand) {
    const $brand = $(brand);
    const current = "alignment";
    const replacements = data.brand.split(" ");
    $brand.removeClass(current);
    replacements.forEach((x) => $brand.addClass(x));
  }
  if (date.getMonth() === 6 && date.getDate() === 4) {
    const button = document.querySelector("#menu-open");
    const span = button?.firstElementChild;
    if (span) {
      span.classList.remove("mask-tribar");
      const img = span.appendChild(document.createElement("img"));
      img.src = "/images/icons/burger.png";
      img.alt = "";
      const hov = span.appendChild(document.createElement("img"));
      hov.src = "/images/icons/burger-usa.png";
      hov.alt = "";
    }
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = src;
  });
}

function loadImages() {
  const urls = [
    "/images/masks/cancel.svg",
    "/images/masks/check.svg",
    "/images/masks/hide.svg",
    "/images/masks/show.svg",
    "/images/ui/comp-bg.svg",
  ];
  return Promise.all(urls.map(x => loadImage(x)));
}

function loadModals() {
  const modal_onShown = (e) => {
    const els = getFocusableElements(e.target);
    if (els.length > 0) els[0].focus();
  };
  const menu_onShow = (e) => {
    const theme = getTheme();
    e.target.querySelectorAll("input[name='theme']")
      .forEach((x) => {
        x.checked = x.value === theme;
      });
    document.querySelector("#preview iframe")?.setTheme(theme);
  }
  const menu_onSave = (_) => {
    const [input] = [...document.querySelectorAll("input[name='theme']:checked")];
    if (input) {
      setTheme(input.value);
    }
    $("#menu").modal("toggle");
  };

  $(".modal").each((_, e) => $(e).on('shown.bs.modal', modal_onShown));
  $("#menu").on('show.bs.modal', menu_onShow);
  document.querySelector("#menu-save")?.addEventListener("click", (e) => menu_onSave(e));
}

function loadTheme() {
  setTheme(getLocalOrSession("theme") || "kotor2");
}

function loadTooltips() {
  if (!window.matchMedia("hover: hover")) return;
  document
    .querySelectorAll("[data-bs-toggle='tooltip']")
    .forEach((x) => new bootstrap.Tooltip(x));
}

function onLoad() {
  Promise.all([
    loadHeader(),
    loadFooter(),
    loadTheme(),
    loadBreadcrumbs(),
    loadCollapseBreakpoints(),
    loadCollapseScrolling(),
    loadEggs(),
  ])
    .then((_) => {
      createThemePreview(document.querySelector("#preview"));
      Promise.all([
        loadModals(),
        loadScrolling(),
        loadTooltips(),
        loadSpoilers(),
        loadProm(),
        loadImages(),
      ])
      .then((_) => {
        document.getElementById("loading").style.display = "none";
      });
    });
}

function parseISODateInLocalTime(s) {
  if (!s) return;
  const res = /(\d+)-([0][1-9]|1[0-2])-([0][1-9]|[1-2]\d|3[01])/.exec(s);
  if (!res) return;
  const [_, year, month, day] = res;
  return new Date(year, month - 1, day);
}

function parseBreakpoint(pts, s) {
  if (!pts || !s) return [];
  const res = /^\s*([A-Za-z]*)\s*-\s*([A-Za-z]*)\s*$/.exec(s);
  if (!res) return [];
  const a = pts[res[1]];
  const b = pts[res[2]];
  return [a === undefined ? undefined : a + 1, b === undefined ? undefined : b];
}

function setTheme(theme) {
  document.documentElement.className = theme;
  setLocalOrSession("theme", theme);
}

function setLocalOrSession(key, value) {
  if (typeof window.localStorage != "undefined") localStorage[key] = value;
  else sessionStorage[key];
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

async function loadProm() {
  const prom = await fetch("/prom.json").then((result) => result.json());
  shuffle(prom.mdRect);
  shuffle(prom.mobileBnr);
  const doChange = (e, i) => {
    const rect = e.getBoundingClientRect();
    const k = rect.height > 50 ? "mdRect" : "mobileBnr";
    const srcs = prom[k];
    e.src = srcs[i % srcs.length];
  };
  const onChange = (_) => {
    document.querySelectorAll(".prom > img").forEach((e, i) => doChange(e, i));
  }
  const h = "height";
  const w = "width";
  [
    { dim: h, max: 450 },
    { dim: h, max: 600 },
    { dim: h, max: 768 },
    { dim: w, min: 769 },
    { dim: w, min: 1281 },
  ].forEach((x) => {
    const { dim, min, max } = x;
    window
      .matchMedia(formatDimensionQuery(dim, min, max))
      .addEventListener("change", onChange);
  });
  onChange();
}

function loadScrolling() {
  const lyt = document.getElementById("lyt");
  const btn = document.getElementById("back-to-top");
  const measureScrollbar = () => {
    const container = document.body.appendChild(document.createElement('div'));
    container.style.cssText = `
      width: 100px;
      height: 100px;
      overflow: scroll;
      position: absolute;
      top: -9999px;
      left: -9999px;
      margin: 0;
      padding: 0;
      border: 0;
    `;
    const child = container.appendChild(document.createElement('div'));
    child.style.width = "200px";
    child.style.height = "200px";
    const width = container.offsetWidth - container.clientWidth;
    const height = container.offsetHeight - container.clientHeight;
    document.body.removeChild(container);
    return { width, height };
  };

  if (!lyt || !btn) return;
  const fn = () => {
    const min = 300;
    const visible = document.activeElement === btn || lyt.scrollTop >= min;
    if (visible) btn.classList.remove("sr-only");
    else btn.classList.add("sr-only");
  };
  window.addEventListener("resize", fn);
  lyt.addEventListener("scroll", fn);
  btn.addEventListener("focus", fn); 
  btn.addEventListener("focusout", fn);
  fn();
  const { width, height } = measureScrollbar();
  lyt.style.setProperty("--scrollbar-w", `${width}px`);
  lyt.style.setProperty("--scrollbar-h", `${height}px`);
}

function loadSpoilers() {
  const toggleSpoiler = (button, value) => {
    if (!button) return;
    const hidden = value !== true && (value === false || button.getAttribute("aria-expanded") !== "false");
    const [showLabel, hideLabel] = button.querySelectorAll("span.sr-only");
    if (hidden) {
      button.setAttribute("aria-expanded", "false");
      button.parentElement.setAttribute("data-hidden", "");
      showLabel?.removeAttribute("aria-hidden")
      hideLabel?.setAttribute("aria-hidden", "true");
    }
    else {
      button.setAttribute("aria-expanded", "true");
      button.parentElement.removeAttribute("data-hidden");
      showLabel?.setAttribute("aria-hidden", "true")
      hideLabel?.removeAttribute("aria-hidden");
    }
    const text = document.getElementById(button.getAttribute("aria-controls"));
    if (text) {
      text.inert = hidden;
    }
  };
  const button_onClick = (e) => toggleSpoiler(e.target);
  const container_onClick = (e) => {
    const button = e.target.querySelector("button");
    if (button && button.getAttribute("aria-expanded") === "false") {
      toggleSpoiler(button, true);
    }
  }
  document.querySelectorAll(".spoiler").forEach((e) => {
    e.dataset.hidden = "true";
    e.querySelector("button")?.addEventListener("click", button_onClick);
    e.addEventListener("click", container_onClick);
  });
}
