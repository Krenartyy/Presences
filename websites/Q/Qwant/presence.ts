const presence = new Presence({
		clientId: "719331723560878091",
	}),
	browsingTimestamp = Math.floor(Date.now() / 1000),
	searchTypeMap: ItemMap = {
		web: "Searching on the web",
		news: "Searching the news",
		images: "Searching images",
		videos: "Searching videos",
		social: "Searching social media",
		shopping: "Searching for products",
	},
	searchMusicTypeMap: ItemMap = {
		overview: "Searching music",
		albums: "Searching music albums",
		artists: "Searching music artists",
		songs: "Searching songs",
	},
	searchJuniorTypeMap: ItemMap = {
		web: "Searching on the web",
		images: "Searching images",
		videos: "Searching videos",
		education: "Searching educational content",
	};

interface ItemMap {
	[key: string]: string;
}

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
		largeImageKey: "qwant",
		startTimestamp: browsingTimestamp,
	};

	let query: URLSearchParams = null;

	if (location.hostname === "www.qwant.com") {
		switch (location.pathname.split("/")[1]) {
			case "":
				query = new URLSearchParams(location.search);
				if (query.has("q")) {
					presenceData.details = searchTypeMap[query.get("t")];
					presenceData.state = query.get("q");
				} else presenceData.details = "Home";
				break;
			case "music":
				presenceData.smallImageKey = "music";
				presenceData.smallImageText = "Qwant Music";
				if (location.pathname === "/music/search") {
					query = new URLSearchParams(location.search);
					if (query.has("q")) {
						presenceData.details = searchMusicTypeMap[query.get("t")];
						presenceData.state = query.get("q");
					}
				} else presenceData.details = "Music Home";
				break;
			case "maps":
				presenceData.smallImageKey = "maps";
				presenceData.smallImageText = "Qwant Maps";
				presenceData.details = "Looking at maps";
				break;
		}
	} else if (location.hostname === "www.qwantjunior.com") {
		presenceData.largeImageKey = "qwantjunior";
		query = new URLSearchParams(location.search);
		switch (location.pathname) {
			case "/":
				if (query.has("q")) {
					presenceData.details = `${
						searchJuniorTypeMap[query.get("type")]
					} in Qwant Junior`;
					presenceData.state = query.get("q");
				} else presenceData.details = "Junior Home";
				break;
			case "/news":
				presenceData.smallImageKey = "news";
				presenceData.smallImageText = "Qwant Junior News";
				if (query.has("q")) {
					presenceData.details = "Searching the news on Qwant Junior";
					presenceData.state = query.get("q");
				} else presenceData.details = "Junior News Home";
				break;
		}
	}

	// If data doesn't exist clear else set activity to the presence data
	if (!presenceData.details) {
		// Clear tray
		presence.setActivity(); // Clear activity
	} else presence.setActivity(presenceData);
});
