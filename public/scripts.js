const BREAKPOINT_XS  = 0,
	  BREAKPOINT_SM  = 576,
	  BREAKPOINT_MD  = 768,
	  BREAKPOINT_LG  = 992,
	  BREAKPOINT_XL  = 1200,
	  BREAKPOINT_XXL = 1400;

function checkDay(date, condition) {
	const month = date.getMonth() + 1;
	const day = date.getDate();
	if (Number.isInteger(condition.day))
		return month === condition.month && day === condition.day;
	if (Number.isInteger(condition.weekday) && Number.isInteger(condition.n))
		return month === condition.month && day === getWeekdayInMonth(date, condition.weekday, condition.n).getDate();
	return false;
}

function checkMonth(date, condition) {
	const month = date.getMonth() + 1;
	return Number.isInteger(condition.month)
		&& condition.month == month;
}

function checkWeek(date, condition) {
	const month = date.getMonth() + 1;
	const day = date.getDate();
	if (Number.isInteger(condition.start_day) && Number.isInteger(condition.end_day))
		return month === condition.month && day >= condition.start_day && day <= condition.end_day;
	if (condition.week === "first")
		return month === condition.month && isWithinWeek(date, getWeekdayInMonth(date, 1, 1));
	if (condition.week === "last")
		return month === condition.month && isWithinWeek(date, getStartOfLastWeekInMonth(date));
	if (Number.isInteger(condition.week))
		return month === condition.month && isWithinWeek(date, getWeekdayInMonth(date, 1, condition.week));
	return false;
}

function collapseMaxWidth(collapsibleSelector, triggerSelector, maxWidth) {
	const mql = window.matchMedia("(max-width: " + maxWidth + "px)");
	const collapsible = document.querySelector(collapsibleSelector);
	const trigger = document.querySelector(triggerSelector);
	function collapse() {
		let collapseInstance =  new bootstrap.Collapse(collapsible, {});
		collapsible.classList.remove("show");
		trigger.setAttribute("data-bs-toggle", "collapse");
		trigger.setAttribute("type", "button");
	}
	function expand() {
		collapsible.classList.add("show");
		trigger.removeAttribute("data-bs-toggle");
		trigger.removeAttribute("type");
	}
	if (!mql.matches)
		expand();
	mql.addEventListener("change", e => { if (e.matches) collapse(); else expand(); });
}

function determineDay(date, conditions) {
	let matches = [];
	for (const key in conditions.days)
		if (checkDay(date, conditions.days[key]))
			return key;
	for (const key in conditions.weeks)
		if (checkWeek(date, conditions.weeks[key]))
			return key;
	for (const key in conditions.months)
		if (checkMonth(date, conditions.months[key]))
			return key;
	return undefined;
}

function getLocalOrSession(key) {
	if (typeof(window.localStorage) != "undefined")
		return localStorage[key];
	else
		return sessionStorage[key];
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

function getWeekdayInMonth(date, weekday, n) {
	var d = new Date(date.getFullYear(), date.getMonth(), 1);
	d.setDate(1 + (weekday - d.getDay() + 7) % 7 + (n - 1) * 7);
	return d;
}

async function getToday() {
	const params = new URLSearchParams(window.location.search);
	const date = parseISODateInLocalTime(params.get("date")) ?? new Date();
	const json = await fetch("/days.json").then(result => result.json());
	const { conditions, data } = json;
	const day = determineDay(date, conditions);
	return day ? data[day] : data.standard;
}

function isWithinWeek(date, startOfWeek) {
	const endOfWeek = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 6);
	return date >= startOfWeek && date <= endOfWeek;
}

function loadBanner() {
	getToday()
		.then(day => {
			var banner = $("#banner");
			if (banner) {
				const currentBanner = "alignment";
				const replacementBanner = day.banner;
				banner.find("*").each(function() {
					if ($(this).hasClass(currentBanner)) {
						$(this).removeClass(currentBanner);
						$(this).addClass(replacementBanner);
					}
				});
			
			}
		});
}

function loadBlurb() {
	getToday()
		.then(day => {
			var blurb = $("#blurb");
			if (blurb)
				$(blurb).html(day.blurb)
		});
}

function loadNavigation() {
	collapseMaxWidth("#nav-collapse", "#nav-button", BREAKPOINT_MD);
}

function loadTheme() {
	var theme = getLocalOrSession("theme");
	setTheme(theme ? theme : "kotor2");
}

function loadTooltips() {
	const tooltipTriggerList = document.querySelectorAll("[data-bs-toggle='tooltip']");
	const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

function parseISODateInLocalTime(s) {
	if (!s)
		return undefined;
	const res = s.match(/(\d{4})-([0][1-9]|1[0-2])-([0][1-9]|[1-2]\d|3[01])/);
	if (!res)
		return undefined;
	const [_, year, month, day] = res;
	return new Date(year, month - 1, day);
}

function setTheme(theme) {
	var oldTheme = document.documentElement.className;
	document.documentElement.className = theme;
	$("#" + "theme-" + oldTheme).attr("aria-selected", "false");
	$("#" + "theme-" + theme).attr("aria-selected", "true");
	setLocalOrSession("theme", theme);
}

function setLocalOrSession(key, value) {
	if (typeof(window.localStorage) != "undefined")
		localStorage[key] = value;
	else
		sessionStorage[key]
}

function spoiler(e) {
	if (!(e instanceof KeyboardEvent) || e.key == "Enter") {
		const btn = e.CurrentTarget;
		const content = $(e.currentTarget).children(":first");
		if ($(content).attr("aria-hidden") == "true") {
			$(content).attr("aria-hidden", "false");
			$(btn).attr("title", "Show spoiler");
		}
		else {
			$(content).attr("aria-hidden", "true");
			$(btn).attr("title", "Hide spoiler");
		}
	}
}