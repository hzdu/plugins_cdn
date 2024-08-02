
"use strict";

document.addEventListener("DOMContentLoaded", function() {
	var tpdaPurgeClear = document.querySelector("#wpadminbar .tpda-purge-clear");
	
	if (tpdaPurgeClear) {
		var ids = "tpda-purge-clear";
		var smartAction = "tpda_purge_current_clear";
		
		var submenuLinks = tpdaPurgeClear.querySelectorAll("." + ids + " .ab-submenu a");
		
		submenuLinks.forEach(function(link) {
			link.addEventListener("click", function(event) {
				event.preventDefault();
				
				var href = link.getAttribute('href').replace('#tpda-clear-', '');
				var confirmation = (href === 'gutenberg-all') ? confirm("Are you sure want to remove all cache files?") : true;
				
				if (href && confirmation) {
					var xhr = new XMLHttpRequest();
					xhr.open("POST", tpgb_config.ajax_url, true);
					xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
					xhr.onreadystatechange = function() {
						if (xhr.readyState === 4 && xhr.status === 200) {
							var response = xhr.responseText;
							if (response) {
								setTimeout(function() {
									location.reload(true);
								}, 50);
							}
						}
					};
					
					var params = "action=" + smartAction + "&security=" + tpgb_config.tpgb_nonce + "&plus_name=" + encodeURIComponent(href);
					xhr.send(params);
				}
			});
		});
	}
});