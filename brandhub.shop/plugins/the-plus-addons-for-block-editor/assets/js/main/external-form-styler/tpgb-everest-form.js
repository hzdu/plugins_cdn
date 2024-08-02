document.addEventListener('DOMContentLoaded', (event) => {
	tpeverestform(document);
});

function tpeverestform(doc){

 const elements = doc.querySelectorAll('.tpgb-everest-form');

 elements.forEach( el => {
		var innerCheck = el.querySelectorAll('.evf-field.evf-field-checkbox .everest-forms-field-label-inline');
		innerCheck.forEach(innerC => {
		 const e = document.createElement('span');
		 e.className = 'tpgb-everest-check';
		 e.innerHTML ="<i class='fa fa-check'></i>";
		 innerC.insertBefore(e, innerC.childNodes[0]);
		});
		
		var innerRadio = el.querySelectorAll('.evf-field.evf-field-radio .everest-forms-field-label-inline');
		innerRadio.forEach(innerR => {
		 const e = document.createElement('span');
		 e.className = 'tpgb-everest-radio';
		 e.innerHTML ="<i class='fa fa-check'></i>";
		 innerR.insertBefore(e, innerR.childNodes[0]);
		});
 });
}