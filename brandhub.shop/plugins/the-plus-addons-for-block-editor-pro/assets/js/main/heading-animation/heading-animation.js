document.addEventListener('DOMContentLoaded', () => {
	tpheAnim(document)
});

function tpheAnim(doc){
	let allHA = doc.querySelectorAll('.tpgb-heading-animation');
	if(allHA){
		allHA.forEach((ha) => {
			let settings = ha.getAttribute('data-settings');
			settings = JSON.parse(settings);
			if('textAnim' === settings.style){
				tpgbHeadingAnimation( ha, settings.animStyle )
			}
		})
	}
}

function tpgbHeadingAnimation(el, animStyle){
	var animDelay= 2500,
		charDelay= 70,
		revealDurationTime= 600,
		revealAnimateDelay= 1500;

	function getNextWord(word) {
        return (!word.nextSibling) ? word.parentElement.firstElementChild : word.nextSibling;
	}
	
	function ReplaceActWord(oldWord, newWord) {
		oldWord.classList.remove('heading-text-active');
		oldWord.classList.add('heading-text-inactive');

		newWord.classList.remove('heading-text-inactive');
		newWord.classList.add('heading-text-active');
		setWrapWidth(newWord);
	}

	function setWrapWidth(newWord) {
		if (animStyle=='style-2' || animStyle=='style-3' || animStyle=='style-5' || animStyle=='style-6' || animStyle=='style-7' || animStyle=='style-8') {
			newWord.closest('.heading-text-wrap').style.width = newWord.offsetWidth + "px";
		}else if(animStyle=='style-4'){
			setTimeout(function(){ newWord.closest('.heading-text-wrap').style.width = newWord.offsetWidth + "px" }, 600);
		}
	}

	function hideChar(letter, word, bool, duration) {
		let allLetter = word.querySelectorAll('.letter');
		allLetter.forEach((al)=>{
			al.classList.remove('letter-anim-in');
		})
		
		if(letter.nextSibling) {
			setTimeout(function(){ hideChar(letter.nextSibling, word, bool, duration) }, duration);  
		} else if(bool) { 
			setTimeout(function(){ hideWord(getNextWord(word)) }, 1000);
		}
	}
	
	function showChar(letter, word, bool, duration) {
		letter.classList.add('letter-anim-in');
		if (letter.nextSibling) {
			setTimeout(function(){ showChar(letter.nextSibling, word, bool, duration) }, duration);
		} else if (!bool) {
			var delayDuration = 1000;
			if(animStyle=='style-2' || animStyle=='style-3' || animStyle=='style-5' || animStyle=='style-6' || animStyle=='style-7' || animStyle=='style-8' ){
				delayDuration = 1000
			}
			setTimeout(function(){ hideWord(word) }, delayDuration);
		}
	}

	function showWord(word) {
		if (animStyle=='style-1') {
			if(word.dataset && word.dataset.duration){
				revealDurationTime = parseInt(word.dataset.duration);
			}else{
				revealDurationTime = 600;
			}
			let textWord = word.closest('.heading-text-wrap');
			animateWidth(
				textWord,
				word.getBoundingClientRect().width + 10,
				revealDurationTime,
				function () {
				setTimeout(function () {
					hideWord(word);
				}, revealAnimateDelay);
				}
			);
		}else if(animStyle=='style-4'){
			setTimeout(function(){ hideWord(word) }, 600);
		}
	}

	function hideWord(word) {
		var nextWord = getNextWord(word),
			letterSelector = '.letter';
		if (animStyle=='style-1') {
			let textWord = word.closest('.heading-text-wrap');
			animateWidth(
				textWord,
				2,
				revealDurationTime,
				function () {
					ReplaceActWord(word, nextWord);
					showWord(nextWord);
				}
			);
		}else if(animStyle=='style-2' || animStyle=='style-3' || animStyle=='style-5' || animStyle=='style-6' || animStyle=='style-7'|| animStyle=='style-8'){
			if(animStyle=='style-3'){
				charDelay= 150
			}else if(animStyle=='style-5' || animStyle=='style-6'){
				charDelay = 50
			}else if(animStyle=='style-7'){
				charDelay = 45
			}else if(animStyle=='style-8'){
				charDelay = 30
			}
			var bool = (word.querySelectorAll(letterSelector).length >= nextWord.querySelectorAll(letterSelector).length) ? true : false;
            let wrdFirst = word.querySelectorAll(letterSelector),
                wrdNext = nextWord.querySelectorAll(letterSelector);
			hideChar(wrdFirst[0], word, bool, charDelay);
			showChar(wrdNext[0], nextWord, bool, charDelay);
			setWrapWidth(nextWord);
		}else if(animStyle=='style-4'){
			setTimeout(function(){
				ReplaceActWord(word, nextWord);
				showWord(nextWord); 
			},1400);
		}
	}

	function onInit(){
		var TextWrap = el.querySelector('.heading-text-wrap'),
			allLetter = TextWrap.querySelectorAll('.letter');
		if(allLetter.length > 0){
			allLetter.forEach((al)=>{
				al.innerHTML = al.textContent.replace(/ /g, '&nbsp;');
			})
		}
		if(animStyle=='style-1'){
			TextWrap.style.width = TextWrap.getBoundingClientRect().width + 10 +"px";
		}
		if(animStyle=='style-4'){
			TextWrap.style.width = TextWrap.getBoundingClientRect().width + "px";
			animDelay = 800
		}
		if(animStyle=='style-2'){
			animDelay = 950
		}
		if(animStyle=='style-3'){
			animDelay = 2250
		}
		if(animStyle=='style-5' || animStyle=='style-6'){
			animDelay = 750
		}
		if(animStyle=='style-7'){
			animDelay = 1300
		}
		if(animStyle=='style-8'){
			animDelay = 1400
		}
		setTimeout(function(){
            let actText = el.querySelectorAll('.heading-text-active');
			hideWord(actText[0]) 
		}, animDelay);
	}
	onInit()
}

function animateWidth(element, targetWidth, duration, callback) {
	const startWidth = element.getBoundingClientRect().width;
	const startTime = Date.now();

	function updateWidth() {
		const currentTime = Date.now();
		const elapsedTime = currentTime - startTime;
		const progress = Math.min(elapsedTime / duration, 1);
		const newWidth = startWidth + (targetWidth - startWidth) * progress;

		element.style.width = newWidth + "px";

		if (progress < 1) {
		requestAnimationFrame(updateWidth);
		} else {
		if (typeof callback === "function") {
			callback();
		}
		}
	}
	updateWidth();
}