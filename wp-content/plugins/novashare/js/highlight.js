(() => {

	document.addEventListener("DOMContentLoaded", function(event) {

		var highlight = document.getElementById("ns-highlight-share");
		var buttons = highlight.querySelectorAll("a.ns-button");

		//store original button hrefs
		buttons.forEach(function(b) {
			b.dataset.highlight = b.href
		});

		//mouseup event
		document.addEventListener("mouseup", function(event) {

			//timeout to make sure it fires after the highlight occurs and allow double click
			setTimeout(function() { 

				//hide if not selection is not in content
				if(!nsHighlightContentCheck(event)) {
					highlight.classList.remove("ns-visible");
					return;
				}

				//get selected text
				var selectedText = nsGetSelected().trim();

				if(selectedText != "") {

					//get selection position
					var s = window.getSelection();
					var sRange = s.getRangeAt(0);
					var sRect = sRange.getBoundingClientRect();

					//calculate button container position
					var left = sRect.left + window.scrollX + sRect.width / 2 - (buttons.length * 40) / 2;
					var top = sRect.top + window.scrollY - 40 - 15;
				
					//set new position
					highlight.style.left = (left > 15 ? left : 15) + "px";
					highlight.style.top = top + "px";
					
					//replace placeholders with selected text
					buttons.forEach(function(e) {
						e.href = e.dataset.highlight.replace("%highlight%", selectedText);
					});

					highlight.classList.add("ns-visible");
				} 
				else {
					highlight.classList.remove("ns-visible");
				}

			}, 1);
		});

		//mousedown event
		document.addEventListener("mousedown", function(event) {
			if(!highlight.contains(event.target)) {
				highlight.classList.remove("ns-visible");
			}
		});
	});

	//get selected text
	function nsGetSelected() {
		var text = "";
		if(window.getSelection) {
			text = window.getSelection().toString();
		}
		else if(document.getSelection) {
			text = document.getSelection().toString();
		} 
		else if(document.selection) {
			text = document.selection.createRange().text;
		}
		return text;
	}

	//check if selection is in content area
	function nsHighlightContentCheck(event) {
		var content = document.querySelectorAll(".ns-content-marker");
		for(var i = 0; i < content.length++; i++) {
			if(content[i].parentNode.contains(event.target)) {
				return true;
			}
		}
		return false;
	}
	
})();