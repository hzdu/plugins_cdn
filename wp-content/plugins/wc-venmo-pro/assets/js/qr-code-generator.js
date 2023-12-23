function QRCodeGenerator(element, qrcode_object) {
	if (element == undefined || typeof qrcode_object.url == undefined) { return; }
	console.log(element, qrcode_object);

	let qrcode;
	try {
		// https://qr-code-styling.com
		qrcode = new QRCodeStyling({
			width: qrcode_object.width,
			height: qrcode_object.height,
			margin: 0,
			data: qrcode_object.url,
			image: qrcode_object.logo,
			imageOptions: { hideBackgroundDots: true, imageSize: 0.5, margin: 5 },
			qrOptions: {
				typeNumber: "0",
				mode: "Byte",
				errorCorrectionLevel: "Q",
			},
			dotsOptions: {
				type: qrcode_object.dotsType,
				color: qrcode_object.darkcolor,
			},
			dotsOptionsHelper: {
				colorType: { single: true, gradient: false },
				gradient: {
					linear: true,
					radial: false,
					color1: qrcode_object.darkcolor,
					color2: qrcode_object.darkcolor,
					rotation: "0",
				},
			},
			cornersSquareOptions: {
				type: qrcode_object.cornersSquareType,
				color: qrcode_object.darkcolor,
			},
			cornersSquareOptionsHelper: {
				colorType: { single: true, gradient: false },
				gradient: {
					linear: true,
					radial: false,
					color1: qrcode_object.darkcolor,
					color2: qrcode_object.darkcolor,
					rotation: "0",
				},
			},
			cornersDotOptions: {
				type: qrcode_object.cornersDotType,
				color: qrcode_object.darkcolor,
			},
			cornersDotOptionsHelper: {
				colorType: { single: true, gradient: false },
				gradient: {
					linear: true,
					radial: false,
					color1: qrcode_object.darkcolor,
					color2: qrcode_object.darkcolor,
					rotation: "0",
				},
			},
			backgroundOptions: { color: qrcode_object.backgroundcolor },
			backgroundOptionsHelper: {
				colorType: { single: true, gradient: false },
				gradient: {
					linear: true,
					radial: false,
					color1: qrcode_object.backgroundcolor,
					color2: qrcode_object.backgroundcolor,
					rotation: "0",
				},
			},
		});
		console.log("qrcode", qrcode);
		let b64 = null;
		// // https://github.com/kozakdenys/qr-code-styling/blob/master/README.md#qrcodestyling-methods
		// qrcode.append(element);
		// https://github.com/kozakdenys/qr-code-styling/blob/master/README.md#qrcodestyling-methods
		qrcode.getRawData("png").then((blob) => {
			var reader = new FileReader();
			reader.readAsDataURL(blob);
			return new Promise((resolve) => {
				reader.onloadend = function () {
					b64 = reader.result;
					// console.log(b64);
					var img = document.createElement("img");
					img.src = b64;
					// console.log("element", element);
					// return resolve(element.appendChild(img));

					var html = `<a href="${qrcode_object.url}" target="_blank"><img src="${img.src}" alt="QR Code" width="150" height="150" /></a>`;
					// element.innerHTML = html;
					// console.log("element", element);

					element.html(html);
					console.log("QR Code", element);
					return resolve(element);
				};
			});
		});
	} catch (error) {
		console.log(error);
		qrcode = document.createElement("img");
		qrcode.src =
			"https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=" +
			encodeURI(qrcode_object.url);
		// qrcode.width = "150px";
		// qrcode.height = "150px";
		// // element.appendChild(qrcode);
		// element.html(qrcode);

		var html = `<a href="${qrcode_object.url}" target="_blank"><img src="${qrcode.src}" alt="QR Code" width="150" height="150" /></a>`;
		// element.innerHTML = html;
		// console.log("element", element);

		element.html(html);
		console.log("QR Code", element);
	}
}