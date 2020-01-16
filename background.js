var chrome = window.chrome;

// Extract domain name (DN) from URL
function url2dn(url) {
	var tmpa = document.createElement('a');
	tmpa.href = url;
	return tmpa.host;
}

function reverce_url(url) {
	var win = window.open("https://viewdns.info/reverseip/?host="+url+"&t=1", '_blank');
	win.focus();
}

function bing_search(ipa) {
	var win = window.open("https://www.bing.com/search?q=ip%3A"+ipa+"+%2B", '_blank');
	win.focus();
}

// get IP using webRequest
var currentIPList = {};
chrome.webRequest.onCompleted.addListener(
	function(info) {
		// summary:
		//		retieve IP
		currentIPList[url2dn(info.url)] = info.ip;
	},
	{
		urls: [],
		types: []
	},
	[]
);

// Listeners
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		switch(request.name) {
		case 'setEnabled':
			// request from the content script to set the options.
			localStorage.setItem('websiteIPEnabled', request.status ? 'true' : 'false');
			break;
		case 'isEnabled':
			// request from the content script to get the options.
			sendResponse(localStorage.getItem('websiteIPEnabled') === 'true' || localStorage.getItem('websiteIPEnabled') === null);
			break;
		case 'getIP':
			sendResponse({
				ip: currentIPList[url2dn(sender.tab.url)] || null
			});
			break;
		case 'copyIP':
			chrome.tabs.getSelected(null, function(tab) {
				var input = document.createElement('input');
				document.body.appendChild(input);
				input.value = currentIPList[url2dn(tab.url)] || chrome.i18n.getMessage('notFound');
				input.focus();
				input.select();
				document.execCommand('Copy');
				input.remove();
			});
			break;
			
		case 'Reverce':
		
			chrome.tabs.getSelected(null, function(tab) {
			var host_reverce = url2dn(tab.url);
			var res = host_reverce.replace("www.", "");
			//alert(res);
			reverce_url(res);

			
			});
			break;
			
		case 'bing':
		
			chrome.tabs.getSelected(null, function(tab) {
				
					var ipq = currentIPList[url2dn(tab.url)];
					//alert(ipq);
					bing_search(ipq)

			
			});
			break;
			
		default:
			sendResponse({});
		}
	}
);