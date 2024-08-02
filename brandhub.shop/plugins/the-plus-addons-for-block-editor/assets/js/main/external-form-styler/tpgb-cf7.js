document.addEventListener('DOMContentLoaded', (event) => {
	tpcoForm(document);
});

function tpcoForm(doc){

		let contactForm = doc.querySelectorAll(".tpgb-external-form-styler .tpgb-contact-form-7");
		contactForm.forEach((self,idx) => {
			var radio_checkbox = 'tpgb-cf7-checkbox';
			var i = 0;
			if(!self.classList.contains('tp-form-loaded')){
				var i = 0;
				let radioList = self.querySelectorAll('.wpcf7-form-control.wpcf7-radio .wpcf7-list-item');
				if(radioList){
					radioList.forEach((selfList,idx) => {
						let text = selfList.querySelector('.wpcf7-list-item-label'),
							text_val = text.innerText;
						text.remove();
						var label_Tags = selfList.querySelector('input[type="radio"]');
						if(label_Tags.parentNode.localName == 'label'){
							label_Tags.parentNode.remove();
							selfList.appendChild(label_Tags);
						}
						var radio_name = label_Tags.getAttribute('name');
						let label = '<label class="input__radio_btn" for="'+radio_name+i+'">'+text_val+'<div class="toggle-button__icon"><span class="tpgb-radiocf7-icon"><i class="fa fa-check" aria-hidden="true"></i></span></div></label>';
						label_Tags.insertAdjacentHTML("afterend",label);

						label_Tags.setAttribute('id',radio_name+i);
						label_Tags.classList.add('input-radio-check');
						selfList.closest('.wpcf7-form-control-wrap').classList.add(radio_checkbox);
						i++;
					});
				}
				var i = 0;
				let formCheckbox = self.querySelectorAll('.wpcf7-form-control.wpcf7-checkbox');
				if(formCheckbox){
					formCheckbox.forEach((selfCheck) => {
						let checkboxList = selfCheck.querySelectorAll('.wpcf7-list-item');
							checkboxList.forEach((selfList,idx) => {
								var text = selfList.querySelector('.wpcf7-list-item-label'),
									text_val = text.innerText;
								text.remove();
								var label_Tags = selfList.querySelector('input[type="checkbox"]');
								if(label_Tags.parentNode.localName == 'label'){
									label_Tags.parentNode.remove();
									selfList.appendChild(label_Tags);
								}
								let label = '<label class="input__checkbox_btn" for="'+radio_checkbox+i+'">'+text_val+'<div class="toggle-button__icon"><span class="tpgb-checkcf7-icon"><i class="fa fa-check" aria-hidden="true"></i></span></div></label>';
								label_Tags.insertAdjacentHTML("afterend", label);

								label_Tags.setAttribute('id',radio_checkbox+i);
								label_Tags.classList.add('input-checkbox-check');
								selfList.closest('.wpcf7-form-control-wrap').classList.add(radio_checkbox);
								i++;
							});
					});
				}
				var i = 0;
				let acceptanceBox = self.querySelectorAll('.wpcf7-form-control.wpcf7-acceptance');
				if(acceptanceBox){
					let acceptance_class = 'tpgb-cf7-acceptance';
					acceptanceBox.forEach((selfCheck) => {
						let checkboxList = selfCheck.querySelectorAll('.wpcf7-list-item');
							checkboxList.forEach((selfList,idx) => {
								var text = selfList.querySelector('.wpcf7-list-item-label'),
									text_val = text.innerText;
								text.remove();
								var label_Tags = selfList.querySelector('input[type="checkbox"]');
								if(label_Tags.parentNode.localName == 'label'){
									label_Tags.parentNode.remove();
									selfList.appendChild(label_Tags);
								}
								let label = '<label class="input__checkbox_btn" for="'+acceptance_class+i+'"><div class="toggle-button__icon"><span class="tpgb-checkcf7-icon"><i class="fa fa-check" aria-hidden="true"></i></span></div>'+text_val+'</label>';
								label_Tags.insertAdjacentHTML("afterend", label);

								label_Tags.setAttribute('id',acceptance_class+i);
								label_Tags.classList.add('input-checkbox-check');
								selfList.closest('.wpcf7-form-control-wrap').classList.add(acceptance_class);
								i++;
							});
					});
				}
				var i = 0;
				let fileList = self.querySelectorAll(".wpcf7-form-control-wrap input[type='file']");
				if(fileList){
					fileList.forEach((self,idx) => {
						var file_name = self.getAttribute('name');
						self.setAttribute('id',file_name+i);
						self.setAttribute('data-multiple-caption',"{count} files selected");
						let label = '<label class="input__file_btn" for="'+file_name+i+'"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path></svg><span>Choose a file…</span></label>';
						if(self.parentNode.classList.contains('wpcf7-form-control-wrap')){
							self.insertAdjacentHTML("afterend",label);
						}
						self.closest('.wpcf7-form-control-wrap').classList.add('cf7-style-file');
						i++;
					});
				}
				self.classList.add('tp-form-loaded');
			}
		});
}