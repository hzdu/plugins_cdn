document.addEventListener("DOMContentLoaded", (event) => {
	tpcodeInit(document);
});

function tpcodeInit(doc) {
	const elements = doc.querySelectorAll(".tpgb-code-highlighter");

	if(elements){
		elements.forEach((el) => {
			var data = JSON.parse(el.getAttribute("data-code-atr"));

			if (data.copyicon != "" || data.copiedicon != "") {
				setTimeout(function () {	
					var copyhtml = "",
					copiedhtml = "",
					coDiv = el.querySelector(".copy-to-clipboard-button");

					if (data.copyicon != "") {
						copyhtml = '<span class="code-copy-icon"><i class="' + data.copyicon + '"></i></span>';
					}
					if (data.copiedicon != "") {
						copiedhtml = '<span class="code-copied-icon"><i class="' + data.copiedicon +'"></i></span>';
					}
					coDiv.innerHTML = "<span>" + data.copytext + "</span>" + copyhtml;
					coDiv.addEventListener( "click", (el) => {
						el.innerHTML = "<span>" + data.copiedText + "</span>" + copiedhtml;

						setTimeout(function () {
							el.innerHTML = "<span>" + data.copytext + "</span>" + copyhtml;
						}, 1000);
					}
					);
				}, 1500);
			}
			if (data.downloadicon != "") {
				setTimeout(function () {
					el.querySelector(".toolbar-item a").innerHTML = data.downloadtext + '<span class="code-download-icon"><i class="' + data.downloadicon +'"></i></span>';
				}, 50);
			}
		});
	}
	
}