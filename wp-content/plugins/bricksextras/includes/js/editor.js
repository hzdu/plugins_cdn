document.addEventListener("DOMContentLoaded", (event) => {

	const extrasSettings = document.createElement("li");
	extrasSettings.setAttribute('data-balloon','X-ray')
	extrasSettings.setAttribute('data-balloon-pos','bottom')
  
	const redo = document.querySelector( "#bricks-toolbar .group-wrapper.right .redo" );

	if ( redo ) {
		redo.after(extrasSettings);
	}
  
	extrasSettings.innerHTML = '<span class="bricks-svg-wrapper"><svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg></span>';
	
	extrasSettings.addEventListener("click", function () {
		document.getElementById('bricks-builder-iframe').contentWindow.document.body.classList.toggle('extras-x-ray');
	});

  });