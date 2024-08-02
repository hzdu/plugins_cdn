document.addEventListener("DOMContentLoaded", function() {
	tpdownBtn(document)
})

function tpdownBtn(doc){
	let advbtnWrapper = doc.querySelectorAll('.tpgb-advanced-buttons');
	advbtnWrapper.forEach((self) => {
        if(self.classList.contains('ab-download')){
            let btnText = self.querySelector('.adv_btn_ext_txt');
            if(btnText){
                btnText.addEventListener('click', (event) => {
                    event.preventDefault();
                    let advBtn = btnText.closest('.tpgb-advanced-buttons');
                    let btnLink = advBtn.querySelector('.adv-button-link-wrap');
                        clickBtn(btnLink);
                });
            }
            let advbtnLink = self.querySelector('.adv-button-link-wrap');
            advbtnLink.addEventListener('click', (event) => {
                event.preventDefault();
                clickBtn(advbtnLink);
            });
        }
	});
}
function tpgb_download_btn(link, name){
    var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.classList.add("tplus-download");
        a.href = link;
        a.download = name;
        a.click();
        window.URL.revokeObjectURL(link);
}
function clickBtn(link){
	let download_link = link.getAttribute('href'),
		classDownload = link.closest('.tpgb-adv-btn-inner.ab-download'),
		dfname = classDownload.getAttribute('data-dfname');
	
	if(link.closest('.tpgb-adv-btn-inner').classList.contains('ab-download')){
		event.preventDefault();
	}
	
	// Button 1 Start
	if(classDownload.classList.contains('tpgb-download-style-1')){
		let btn1 = link.closest('.tpgb-adv-btn-inner.ab-download.tpgb-download-style-1');
		link.classList.toggle('downloaded');
		var a = document.createElement("a");
		tpgb_download_btn(download_link, dfname );
		setTimeout(function() {
			link.classList.remove('downloaded');
		}, 5000);
	}
	// Button 2 Start
	if(classDownload.classList.contains('tpgb-download-style-2')){
		let btn2 = link.closest('.tpgb-adv-btn-inner.ab-download.tpgb-download-style-2');
		link.classList.add('load');
		setTimeout(function() {
			link.classList.add('done');
		}, 1000);
		tpgb_download_btn(download_link, dfname );
		setTimeout(function() {
			link.classList.remove('load');
			link.classList.remove('done');
		}, 5000);
	}
	// Button 3 Start
	if(classDownload.classList.contains('tpgb-download-style-3')){
		tpgb_download_btn(download_link, dfname );
	}
	// Button 4 Start
	if(classDownload.classList.contains('tpgb-download-style-4')){
		link.classList.add('loading');
		setTimeout(function() {
			link.classList.remove('loading');
			link.classList.add('success');
			tpgb_download_btn(download_link, dfname );
		}, 3000);
		setTimeout(function() {
			link.classList.remove('success');
		}, 8000);
	}
	// Button 5 Start
	if(classDownload.classList.contains('tpgb-download-style-5')){
		let btn5 = link.closest('.tpgb-adv-btn-inner.ab-download.tpgb-download-style-5');
		let btn5Meter = btn5.querySelector('.tp-meter');
		btn5.classList.toggle('is-active');

		setTimeout(function() {
			btn5Meter.classList.toggle('is-done');
			tpgb_download_btn(download_link, dfname );
		}, 3500);

		setTimeout(function() {
			btn5.classList.remove('is-active');
			btn5Meter.classList.remove('is-done');
		}, 5000);
	}
}