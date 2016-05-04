var Ajax = function(url, success, failed) {

	$.ajax({
		url: "source/feed.php",
		method: "GET",
		type: "json",
		data: {url: url},
		success: success,
		failed: failed
	});

}