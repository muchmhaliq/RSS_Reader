var feeds = [];
var cached = {};
var currentFeed;


var add = function(title, url) {
	var feed = {
		title: title,
		link: url,
		lastUpdated: 0,
		failed: false,
		autoUpdate: true,
		interval: 15*60*1000
	};

	feeds.push(feed);

	var id = feeds.length-1;

	currentFeed = id;

	sync(id);

	feed.updater = setInterval(function() {
		sync(id);
	}, feed.interval);

	return id;
}

var updateInterval = function(id, int) {
	if(typeof feeds[id] != "undefined") {
		toggleAutoUpdate(id, true);

		feeds[id].interval = int;
		feeds[id].autoUpdate = true;

		feeds[id].updater = setInterval(function() {
			sync(id);
		}, feeds[id].interval);
	}
}

var toggleAutoUpdate = function(id, flag) {
	if(typeof feeds[id] != "undefined") {
		if(feeds[id].autoUpdate || (typeof flag != "undefined" && flag)) {
			feeds[id].autoUpdate = false;
			clearInterval(feeds[id].updater);
			return true;
		} else {
			updateInterval(id, feeds[id].interval);
			return false;
		}
	}
}

var remove = function(id) {
	if(typeof feeds[id] != "undefined") {
		delete feeds[id];
		$(".rssid[data-id=" + id + "]").remove();
	}
}

var fetchFeed = function(id) {
	var url = feeds[id].link;

	var threshold = 60000; // wait for 120 seconds before sending another request

	if(currentFeed == id)
		showLoader();

	if(currentTime() - feeds[id].lastUpdated < threshold && typeof cached[url] != "undefined") {

		// Use previous collected results
		if(currentFeed == id)
			showFeed(id, cached[url]);
		hideLoader();

	} else {
		new Ajax(url, function(result) {
			feeds[id].failed = false;
			feeds[id].lastUpdated = currentTime();

			if(currentFeed == id)
				showFeed(id, result);

			saveFeed(url, result);
			hideLoader();
		}, function(err) {
			feeds[id].failed = true;
			hideLoader();
		});
	}
}

var saveFeed = function(url, data) {
	cached[url] = data;
}

var currentTime = function() {
	return (new Date()).getTime();
}

var sync = function(id) {
	if(typeof id != "undefined" && typeof feeds[id] != "undefined") {
		fetchFeed(id);
	} else {
		for(id in feeds) {
			fetchFeed(id);
		}
	}
}