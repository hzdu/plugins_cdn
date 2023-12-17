window.onload = function () {
	// console.log("window.onload copy.js");
	copyjs();
	document
		.querySelector("body")
		.addEventListener("updated_checkout", async function () {
			// console.log("updated_checkout copy.js");
			copyjs();
		});
	var copyButtons = document.getElementsByClassName("copybtn");
	for (var i = 0; i < copyButtons.length; i++) {
		copyButtons[i].onclick = function () {
			// console.log("click copy.js");
			copyjs();
		};
	}
};
jQuery(document).ready(function ($) {
	copyjs();
	$("body").on("updated_checkout", function () {
		copyjs();
	});
	$(".copybtn").on("click", function () {
		copyjs();
	});
});

function copyjs() {
	var copyButtons = document.getElementsByClassName("copybtn");
	// console.log(copyButtons);
	for (var i = 0; i < copyButtons.length; i++) {
		copyButtons[i].addEventListener("click", function () {
			try {
				var copyText =
					this?.parentElement?.getElementsByClassName("copytxt")[0];
				console.log(copyText);
				copyText.removeAttribute("readonly");
				copyText.removeAttribute("disabled");
				if (copyText.type == "password") {
					copyText.setAttribute("type", "text");
				}
				copyText.focus();
				copyText.select();
				var successful = document.execCommand("copy");
				var msg = successful ? "successful" : "unsuccessful";
				console.log("Copying text " + msg);
				this.innerText = "Copied!";
				this.classList.add("success");
				copyText.setAttribute("readonly", "readonly");
			} catch (err) {
				this.innerText = "Failed!";
				this.classList.add("error");
				console.log("Oops, unable to copy");
				console.log(err);
			}
		});
	}

	var copyInputs = document.getElementsByClassName("copytxt");
	// console.log(copyInputs);
	for (var i = 0; i < copyInputs.length; i++) {
		copyInputs[i].addEventListener("click", function () {
			var copyBtn = this?.parentElement?.getElementsByClassName("copybtn")[0];
			console.log(copyBtn);
			try {
				this.removeAttribute("readonly");
				this.removeAttribute("disabled");
				if (this.type == "password") {
					this.setAttribute("type", "text");
				}
				this.focus();
				this.select();
				var successful = document.execCommand("copy");
				var msg = successful ? "successful" : "unsuccessful";
				console.log("Copying text " + msg);
				copyBtn.innerText = "Copied!";
				copyBtn.classList.add("success");
				this.setAttribute("readonly", "readonly");
			} catch (err) {
				copyBtn.innerText = "Failed!";
				copyBtn.classList.add("error");
				console.log("Oops, unable to copy");
			}
		});
	}
	return true;
}
