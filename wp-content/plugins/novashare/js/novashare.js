document.addEventListener("DOMContentLoaded", function() {

	var novashareButtons = document.querySelectorAll(".ns-button:not(.ns-follow-button), .ns-ctt, .ns-pinterest-image-button");

	novashareButtons.forEach(function(button) {

		//ignore non network buttons
		if(button.matches('.email, .sms, .print, .copy, .mastodon, .subscribe, .share')) {
			return;
		}

		button.addEventListener('click', function(e) {

			//disable link event
			e.preventDefault();

			//stop if we don't have a link to use
			if(this.getAttribute("href") == '#' || this.href == '#' || this.getAttribute("data-pinterest-gallery") == '1') {

				//pinterest gallery
				if(this.classList.contains('pinterest')) {
					(pinGrid = document.createElement("script")).setAttribute("type", "text/javascript"), pinGrid.setAttribute("charset", "UTF-8"), pinGrid.setAttribute("src", "https://assets.pinterest.com/js/pinmarklet.js"), document.body.appendChild(pinGrid);
				}

				return false;
			}

			//take focus off of clicked element
			this.blur();

			//setup window dimensions
			var size = {
				w  : 700,
				h : 300
			}

			//specific dimensions for buffer
			if(this.classList.contains('buffer') || this.classList.contains('ns-pinterest-image-button') || this.classList.contains('linkedin')) {
				size.w = 800;
				size.h = 575;
			}

			//use novashare href if available
			if(this.getAttribute('data-novashare-href')) {
				this.href = this.getAttribute('data-novashare-href');
			}

			//grab url
			var url = (typeof this.href != 'undefined' ? this.href : this.getAttribute("href"));

			//open popup window
			window.open(url, '', "toolbar=0,status=0,menubar=0,scrollbars=0,width=" + size.w + ",height=" + size.h + ",top=200,left=" + (window.innerWidth - size.w)/2);
		});
	});
});