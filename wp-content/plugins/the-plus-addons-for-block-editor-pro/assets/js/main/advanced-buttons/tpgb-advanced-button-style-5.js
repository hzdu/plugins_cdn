/**
 * CTA Style-5
 */
document.addEventListener('DOMContentLoaded', () => {
    tpadvBtn(document)
});

function tpadvBtn(doc){
	let ctas5 = doc.querySelector('.tpgb-cta-style-5');
	if(ctas5){
		setTimeout(()=>{
			let style5 = document.createElement('style');
			style5.id = 'tpgb-cta-style-5';
			let cssKeyframes = `@keyframes tp-typing { 0%, to { width: 0; } 50%, 80% { width: 100%; } 55%, 65%, 75% { opacity: 1; } 60%, 70% { opacity: 0; } }`;
			style5.innerHTML = cssKeyframes;
			document.head.appendChild(style5);
		},4000)
	}
}