function Head() {
  return html`
    <head>
		${CommonMeta()}
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js" crossorigin="anonymous"></script>
		<link href="https://fonts.googleapis.com" rel="preconnect" crossorigin="anonymous">
		<link href="https://fonts.gstatic.com" rel="preconnect" crossorigin="anonymous">
		<link href="https://fonts.googleapis.com/css2?family=Michroma&display=swap" rel="stylesheet" crossorigin="anonymous">
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
		<link href="/bootstrap.css" rel="stylesheet" type="text/css" crossorigin="anonymous">
		<link href="/styles.css" rel="stylesheet" type="text/css" crossorigin="anonymous">
		<link href="/flags.css" rel="stylesheet" type="text/css" crossorigin="anonymous">
		<script src="/scripts.js" crossorigin="anonymous"></script>
	</head>`
}
