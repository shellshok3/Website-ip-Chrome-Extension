var chrome = window.chrome;

chrome.extension.sendMessage({name: 'isEnabled'}, function(isEnabled) {
	// summary:
	//		only do stuff if enabled
	if(!isEnabled) { return; }

	chrome.extension.sendMessage({name: 'getIP'}, function(response) {
		// summary:
		//		grab the ip

		if(!response.ip || response.ip === '::') { return; }

		var websiteip = document.createElement('websiteip');

		websiteip.id = 'chrome_websiteIP';
		websiteip.className = 'chrome_websiteIP_right';
		websiteip.innerHTML = response.ip;
		if(document && document.body) {
			//alert(response.ip);
			document.body.appendChild(websiteip);
		}

	});});