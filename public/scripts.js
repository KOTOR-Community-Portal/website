const BREAKPOINT_XS  = 0,
	  BREAKPOINT_SM  = 576,
	  BREAKPOINT_MD  = 768,
	  BREAKPOINT_LG  = 992,
	  BREAKPOINT_XL  = 1200,
	  BREAKPOINT_XXL = 1400;

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
	if( !mql.matches )
		expand();
	mql.addEventListener("change", e => { if( e.matches ) collapse(); else expand(); });
}

function getBanner(day) {
	switch( day ) {
	case "Zero Discrimination Day":
		return "flag-progress";
	case "International Women's Day":
		return "alignment-venus";
	case "Trans Day of Visibility":
		return "flag-trans";
	case "International Asexuality Day":
		return "flag-ace";
	case "International Day of Pink":
		return "flag-pink";
	case "Lesbian Visibility Day":
		return "flag-lesbian";
	case "IDAHOBIT":
		return "flag-progress";
	case "Pansexual and Panromantic Awareness & Visibility Day":
		return "flag-pan";
	case "Pride Month":
		return "flag-progress";
	case "Non-Binary People's Day":
		return "flag-non-binary";
	case "Bi Visibility Day":
		return "flag-bi";
	case "International Lesbian Day":
		return "flag-lesbian";
	case "National Coming Out Day":
		return "flag-rainbow";
	case "Genderfluid Visibility Week":
		return "flag-genderfluid";
	case "Ace Week":
		return "flag-ace";
	case "Intersex Awareness Day":
		return "flag-intersex";
	case "Barlo":
		return "flag-barlo";
	default:
		return "alignment";
	}
}

function getBlurbHtml(day) {
	switch( day ) {
	case "Zero Discrimination Day":
		return String.raw`Today is <a href="https://www.unaids.org/en/zero-discrimination-day">Zero Discrimination Day</a>`;
	case "International Women's Day":
		return String.raw`Today is <a href="https://www.internationalwomensday.com/">International Women's Day</a>`;
	case "Trans Day of Visibility":
		return String.raw`Today is <a href="https://www.manygendersonevoice.org/tdov.html">Trans Day of Visibility</a>`;
	case "International Asexuality Day":
		return String.raw`Today is <a href="https://internationalasexualityday.org/en">International Asexuality Day</a>`;
	case "International Day of Pink":
		return String.raw`Today is <a href="https://www.dayofpink.org/">International Day of Pink</a>`;
	case "Lesbian Visibility Day":
		return String.raw`Today is <a href="https://www.lesbianvisibilityweek.com">Lesbian Visibility Day</a>`;
	case "IDAHOBIT":
		return String.raw`Today is <a href="https://may17.org">IDAHOBIT</a></span>`;
	case "Pansexual and Panromantic Awareness & Visibility Day":
		return String.raw`Today is <a href="https://genderedintelligence.co.uk/panvisibilityday">Pansexual and Panromantic Visibility Day</a>`;
	case "Pride Month":
		return String.raw`Celebrating <a href="https://www.loc.gov/lgbt-pride-month/about/">Pride Month</a>`;
	case "Non-Binary People's Day":
		return String.raw`Today is <a href="https://www.manygendersonevoice.org/non-binary-peoples-day.html">Non-Binary People's Day</a>`;
	case "Bi Visibility Day":
		return String.raw`Today is <a href="https://bivisibilityday.com/about">Bi Visibility Day</a>`;
	case "International Lesbian Day":
		return String.raw`Today is <a href="https://www.lgbtiqhealth.org.au/international_lesbian_day2">International Lesbian Day</a>`;
	case "National Coming Out Day":
		return String.raw`Today is <a href="https://www.hrc.org/resources/national-coming-out-day">National Coming Out Day</a>`;
	case "Genderfluid Visibility Week":
		return String.raw`Today is the start of <a href="https://www.grlgbtqhealthcareconsortium.org/significantdates/genderfluid-visibility-week">Genderfluid Visibility Week</a>`;
	case "Ace Week":
		return String.raw`Today is the start of <a href="https://www.grlgbtqhealthcareconsortium.org/significantdates/ace-week">Ace Week</a>`;
	case "Intersex Awareness Day":
		return String.raw`Today is <a href="https://interactadvocates.org/intersex-awareness-day">Intersex Awareness Day</a>`;
	case "Barlo":
		return String.raw`<div title="KAAAAAAAAAAANNN" style="font-variant: normal;">(*^ω^*)</div>`;
	default:
		return String.raw`Your gateway to <em>Star Wars: Knights of the Old Republic</em>`;
	}
}

function getLocalOrSession(key) {
	if( typeof(window.localStorage) != "undefined" )
		return localStorage[key];
	else
		return sessionStorage[key];
}

function getWeekdayInMonth(weekday, date, n) {
	var d = new Date(date.getFullYear(), date.getMonth(), 1);
	d.setDate(1 + (weekday - d.getDay() + 7) % 7 + (n - 1) * 7);
	return d;
}

function getToday() {
	const date = new Date();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	
	console.log(date);
	if( month == 3 && day == 1 )
		return "Zero Discrimination Day";
	else if( month == 3 && day == 8 )
		return "International Women's Day"
	else if( month == 3 && day == 31 )
		return "Trans Day of Visibility";
	else if( month == 4 && day == 6 )
		return "International Asexuality Day";
	else if( month == 4 && day == getWeekdayInMonth(3, date, 2).getDate() )
		return "International Day of Pink";
	else if( month == 4 && day == 26 )
		return "Lesbian Visibility Day";
	else if( month == 5 && day == 17 )
		return "IDAHOBIT";          
	else if( month == 5 && day == 25 )
		return "Pansexual and Panromantic Awareness & Visibility Day";
	else if( month == 6 )
		return "Pride Month";
	else if( month == 7 && day == 14 )
		return "Non-Binary People's Day";
	else if( month == 9 && day == 23 )
		return "Bi Visibility Day";
	else if( month == 10 && day == 8 )
		return "International Lesbian Day";
	else if( month == 10 && day == 11 )
		return "National Coming Out Day";
	else if( month == 10 && day == 17 )
		return "Genderfluid Visibility Week";
	else if( month == 10 && day == 24 )
		return "Ace Week";
	else if( month == 10 && day == 26 )
		return "Intersex Awareness Day";
	else if( month == 11 && day == 2 )
		return "Barlo";
	else
		return "";
}

function loadBanner() {
	const day = getToday();
	var banner = $("#banner");
	if( banner ) {
		const currentBanner = "alignment";
		const replacementBanner = getBanner(day);
		banner.find("*").each(function() {
			if( $(this).hasClass(currentBanner) ) {
				$(this).removeClass(currentBanner);
				$(this).addClass(replacementBanner);
			}
		});
	}
}

function loadBlurb() {
	const day = getToday();
	var blurb = $("#blurb");
	if( blurb )
		$(blurb).html(getBlurbHtml(day));
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

function setTheme(theme) {
	var oldTheme = document.documentElement.className;
	document.documentElement.className = theme;
	$("#" + "theme-" + oldTheme).attr("aria-selected", "false");
	$("#" + "theme-" + theme).attr("aria-selected", "true");
	setLocalOrSession("theme", theme);
}

function setLocalOrSession(key, value) {
	if( typeof(window.localStorage) != "undefined" )
		localStorage[key] = value;
	else
		sessionStorage[key]
}

function spoiler(e) {
	if( !(e instanceof KeyboardEvent) || e.key == "Enter" ) {
		const btn = e.CurrentTarget;
		const content = $(e.currentTarget).children(":first");
		if( $(content).attr("aria-hidden") == "true" ) {
			$(content).attr("aria-hidden", "false");
			$(btn).attr("title", "Show spoiler");
		}
		else {
			$(content).attr("aria-hidden", "true");
			$(btn).attr("title", "Hide spoiler");
		}
	}
}