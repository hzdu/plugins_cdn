(function () {
	"use strict";
	// Clear purge cache files styles and scripts
		var performace_cont = document.querySelector('.tpgb-performance-wrap');
		if(performace_cont){
			var ids_dynamic="tpgb-remove-dynamic-style";
			var smart_action = '';
			var dynamic_action ='';
			
			if(performace_cont){
				smart_action = "tpgb_all_perf_clear_cache";
				dynamic_action = "tpgb_all_dynamic_clear_style";
				var delayJs = document.getElementById('tp-delay-js-opt');
				var deferJs = document.getElementById('tp-defer-js-opt');
				var delayJsVal = false;
				if(delayJs.checked){
					delayJsVal = true;
				}
				var deferJsVal = false;
				if(deferJs.checked){
					deferJsVal = true;
				}
				
				function tpgb_perf_opt_change(onajax=false, cacheVal, delayJsVal, deferJsVal){
					if (cacheVal === 'combine') {
						document.querySelectorAll('.tpgb_pref_data.performance-combine').forEach(function(element) {
							element.style.display = 'block';
						});
						document.querySelectorAll('.tpgb_pref_data.performance-separate').forEach(function(element) {
							element.style.display = 'none';
						});
					} else if (cacheVal === 'separate') {
						document.querySelectorAll('.tpgb_pref_data.performance-combine').forEach(function(element) {
							element.style.display = 'none';
						});
						document.querySelectorAll('.tpgb_pref_data.performance-separate').forEach(function(element) {
							element.style.display = 'block';
						});
					}
					var $this = document.querySelector(".tpgb-perf-save-msg");
					if (onajax && cacheVal) {
						$this.style.display = 'block';
						$this.innerHTML = '<svg id="plus-spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48"><circle cx="24" cy="4" r="4" fill="#fff"/><circle cx="12.19" cy="7.86" r="3.7" fill="#fffbf2"/><circle cx="5.02" cy="17.68" r="3.4" fill="#fef7e4"/><circle cx="5.02" cy="30.32" r="3.1" fill="#fef3d7"/><circle cx="12.19" cy="40.14" r="2.8" fill="#feefc9"/><circle cx="24" cy="44" r="2.5" fill="#feebbc"/><circle cx="35.81" cy="40.14" r="2.2" fill="#fde7af"/><circle cx="42.98" cy="30.32" r="1.9" fill="#fde3a1"/><circle cx="42.98" cy="17.68" r="1.6" fill="#fddf94"/><circle cx="35.81" cy="7.86" r="1.3" fill="#fcdb86"/></svg>';
						var xhr = new XMLHttpRequest();
						xhr.open("POST", tpgb_admin.ajax_url, true);
						xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
						xhr.onreadystatechange = function() {
							if (xhr.readyState === 4) {
								if (xhr.status === 200) {
									var response = JSON.parse(xhr.responseText);
									if (response && response.success) {
										$this.classList.add('success');
										$this.innerHTML = "Saved..";
										setTimeout(function() {
											$this.style.display = 'none';
											$this.classList.remove('success');
										}, 2000);
									} else {
										$this.classList.add('error');
										$this.innerHTML = "Server Error..";
										setTimeout(function() {
											$this.style.display = 'none';
											$this.classList.remove('error');
										}, 2000);
									}
								}
							}
						};
						xhr.send('action=tpgb_performance_opt_cache&security=' +tpgb_admin.tpgb_nonce+'&perf_caching='+cacheVal+'&delay_js='+delayJsVal+'&defer_js='+deferJsVal);
					}
				}
    			document.getElementById('tpgb-cache-opt-performance').addEventListener('change', function() {
					var delayJs = document.getElementById('tp-delay-js-opt');
					var delayVal = delayJs.checked;
					
					var deferJs = document.getElementById('tp-defer-js-opt');
					var deferVal = deferJs.checked;
				
					tpgb_perf_opt_change(true, this.value, delayVal, deferVal);
				});
				
				if (document.getElementById('tp-delay-js-opt')) {
					document.getElementById('tp-delay-js-opt').addEventListener('change', function(event) {
						var chkValue = event.currentTarget.checked;
						var deferJs = document.getElementById('tp-defer-js-opt');
						var deferVal = deferJs.checked;
						tpgb_perf_opt_change(true, document.getElementById('tpgb-cache-opt-performance').value, chkValue, deferVal);
					});
				}
				
				if (document.getElementById('tp-defer-js-opt')) {
					document.getElementById('tp-defer-js-opt').addEventListener('change', function(event) {
						var chkValue = event.currentTarget.checked;
						var delayJs = document.getElementById('tp-delay-js-opt');
						var delayVal = delayJs.checked;
						tpgb_perf_opt_change(true, document.getElementById('tpgb-cache-opt-performance').value, delayVal, chkValue);
					});
				}
			}
			
			document.querySelector('.tpgb-purge-cache-btn').addEventListener('click', function(e) {
				e.preventDefault();
				var performace_cont = true; // Assuming this variable is defined elsewhere in your code
				var confirmation = true; // Default value
				if (performace_cont) {
					confirmation = confirm("Are you sure want to remove all cache files? It will remove all cached JS and CSS files from your server. It will generate automatically on your next visit of page.");
				}
				if (confirmation) {
					var xhr = new XMLHttpRequest();
					xhr.open("POST", tpgb_admin.ajax_url, true);
					xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

					var $this = document.querySelector('.tpgb-purge-cache-btn');
					if (performace_cont) {
						$this.innerHTML = '<svg id="plus-spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48"><circle cx="24" cy="4" r="4" fill="#fff"/><circle cx="12.19" cy="7.86" r="3.7" fill="#fffbf2"/><circle cx="5.02" cy="17.68" r="3.4" fill="#fef7e4"/><circle cx="5.02" cy="30.32" r="3.1" fill="#fef3d7"/><circle cx="12.19" cy="40.14" r="2.8" fill="#feefc9"/><circle cx="24" cy="44" r="2.5" fill="#feebbc"/><circle cx="35.81" cy="40.14" r="2.2" fill="#fde7af"/><circle cx="42.98" cy="30.32" r="1.9" fill="#fde3a1"/><circle cx="42.98" cy="17.68" r="1.6" fill="#fddf94"/><circle cx="35.81" cy="7.86" r="1.3" fill="#fcdb86"/></svg><span style="margin-left: 5px;">Removing Purge...</span>';
					}
					
					xhr.onreadystatechange = function() {
						if (xhr.readyState === 4) {
							
							if (xhr.status === 200) {
								setTimeout(function() {
									if (performace_cont) {
										$this.innerHTML = "Purge All Cache";
									}
								}, 100);
							}
						}
					};
					xhr.send("action=" + smart_action + "&security=" + tpgb_admin.tpgb_nonce);
				}
			});
			
			document.getElementById(ids_dynamic).addEventListener('click', function(e) {
				e.preventDefault();
				var performace_cont = true; // Assuming this variable is defined elsewhere in your code
				var confirmation = true; // Default value
				if (performace_cont) {
					confirmation = confirm("Are you sure want to remove all cache files? It will remove all cached JS and CSS files from your server. It will generate automatically on your next visit of page.");
				}
				if (confirmation) {
					var xhr = new XMLHttpRequest();
					xhr.open("POST", tpgb_admin.ajax_url, true);
					xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
					var $this = document.getElementById(ids_dynamic);
					if (performace_cont) {
						$this.innerHTML = '<svg id="plus-spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48"><circle cx="24" cy="4" r="4" fill="#fff"/><circle cx="12.19" cy="7.86" r="3.7" fill="#fffbf2"/><circle cx="5.02" cy="17.68" r="3.4" fill="#fef7e4"/><circle cx="5.02" cy="30.32" r="3.1" fill="#fef3d7"/><circle cx="12.19" cy="40.14" r="2.8" fill="#feefc9"/><circle cx="24" cy="44" r="2.5" fill="#feebbc"/><circle cx="35.81" cy="40.14" r="2.2" fill="#fde7af"/><circle cx="42.98" cy="30.32" r="1.9" fill="#fde3a1"/><circle cx="42.98" cy="17.68" r="1.6" fill="#fddf94"/><circle cx="35.81" cy="7.86" r="1.3" fill="#fcdb86"/></svg><span style="margin-left: 5px;">Removing Assets...</span>';
					}
					xhr.onreadystatechange = function() {
						if (xhr.readyState === 4) {
							if (xhr.status === 200) {
								setTimeout(function() {
									if (performace_cont) {
										$this.innerHTML = "REGENERATE ALL ASSETS";
									}
								}, 100);
							}
						}
					};
					xhr.send("action=" + dynamic_action + "&security=" + tpgb_admin.tpgb_nonce);
				}
			});
		}
		
		/*Welcome page FAQ*/
		var dFaq = document.querySelectorAll('.tpgb-welcome-faq .tpgb-faq-section .faq-title');
		if (dFaq) {
			dFaq.forEach(function(title) {
				title.addEventListener('click', function() {
					var parent = this.closest('.tpgb-faq-section');
					var content = parent.querySelector('.faq-content');
					var computedStyle = window.getComputedStyle(content); // Get computed style

					if (computedStyle.display === 'none') {
						slideDownP(content);
					} else {
						slideUpP(content);
					}

					parent.classList.toggle('faq-active');
				});
			});
		}
		/*Welcome page FAQ*/
		/*Plus block Listing*/
		var blockCheck = document.getElementById('block_check_all');
		if(blockCheck){
			blockCheck.addEventListener('click', function() {
				var checkboxes = document.querySelectorAll('.plus-block-list input[type="checkbox"]:enabled');
				checkboxes.forEach(function(checkbox) {
					checkbox.checked = this.checked;
				}, this);
			
				if (this.checked) {
					this.closest('.panel-block-check-all').classList.add('active-all');
				} else {
					this.closest('.panel-block-check-all').classList.remove('active-all');
				}
			});
		}
		

		document.querySelectorAll(".panel-block-filters .blocks-filter").forEach(function(filter) {
			filter.addEventListener('change', function() {
				var selected = this.value;
				var block_filter = document.querySelectorAll(".plus-block-list .tpgb-panel-col");

				if (selected !== 'all') {
					block_filter.forEach(function(item) {
						item.classList.remove('is-animated');
						item.style.display = 'none';
					});

					block_filter.forEach(function(item) {
						if (item.classList.contains('block-' + selected)) {
							item.classList.add('is-animated');
							item.style.display = 'flex';
						}
					});
				} else {
					block_filter.forEach(function(item) {
						item.classList.add('is-animated');
						item.style.display = 'flex';
					});
				}
			});
		});
		
		function tpgb_block_filter(search) {
			var xhr = new XMLHttpRequest();
			xhr.open("POST", tpgb_admin.ajax_url, true);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		
			xhr.onreadystatechange = function() {
				if (xhr.readyState === XMLHttpRequest.DONE) {
					if (xhr.status === 200) {
						var response = xhr.responseText,
						 	plusBlockList = document.querySelector(".plus-block-list");
						
						if (response !== '') {
							plusBlockList.innerHTML = response;
						}
						document.querySelector(".panel-block-filters .blocks-filter").dispatchEvent(new Event('change'));
					}
				}
			};
		
			var data = "action=tpgb_block_search&filter=" + encodeURIComponent(search) + "&security=" + encodeURIComponent(tpgb_admin.tpgb_nonce);
			xhr.send(data);
		}
		
		var serDiv = document.querySelector(".tpgb-block-filters-search .block-search");
		if(serDiv) {
			serDiv.addEventListener('keyup', function(e) {
				tpgb_block_filter(e.target.value)
			});
		}
		

		/*Plus block Listing*/
		/* Rollback */
		
		var rollbackInnerElements = document.querySelectorAll('.tpgb-rollback-inner');

		if(rollbackInnerElements){
			rollbackInnerElements.forEach(function(element) {
				var rbBtn = element.querySelector('.tpgb-rollback-button');
				var dataBtnText = rbBtn.dataset.rvText;
				var dataBtnUrl = rbBtn.dataset.rvUrl;
				var rbSelect = element.querySelector('.tpgb-rollback-list').value;
				
				if (rbSelect) {
					rbBtn.innerHTML = dataBtnText.replace('{TPGB_VERSION}', rbSelect);
					rbBtn.setAttribute('href', dataBtnUrl.replace('TPGB_VERSION', rbSelect));
				}
				
				element.querySelector('.tpgb-rollback-list').addEventListener("change", function() {
					rbBtn.innerHTML = dataBtnText.replace('{TPGB_VERSION}', this.value);
					rbBtn.setAttribute('href', dataBtnUrl.replace('TPGB_VERSION', this.value));
				});
				
				rbBtn.addEventListener('click', function(e) {
					e.preventDefault();
					if (confirm("Are you sure you want to reinstall the previous version?")) {
						location.href = rbBtn.href;
					}
				});
			});
		}
		
		/* Rollback */

		/** On-boarding Process Start */

		var boardPop = document.querySelector('.tpgb-boarding-pop');

		var closePop = (boardPop !== null) ? boardPop.querySelector('.tpgb-close-button') :  null ;
			if(closePop !== null){
				closePop.addEventListener("click", event => {
					event.preventDefault();
					boardPop.style.display = "none";
				});
			}
				
		if(boardPop !== null){
			var proceedBtn = boardPop.querySelector('.tpgb-boarding-proceed'),
			backBtn = boardPop.querySelector('.tpgb-boarding-back'),
			step1 = boardPop.querySelector(`[data-step="1"]`),
			step7 = boardPop.querySelector(`[data-step="7"]`),
			step8 = boardPop.querySelector(`[data-step="8"]`),
			step6 = boardPop.querySelector(`[data-step="6"]`),
			step5 = boardPop.querySelector(`[data-step="5"]`),
			pagination = boardPop.querySelector('.tpgb-pagination'),
			boardProcess = boardPop.querySelector('.tpgb-boarding-progress'),
			processWidth = 100/8;
			

			var webcompTypes = boardPop.querySelector('.tpgb-select-3');
			var selectWebcomp = webcompTypes.querySelectorAll('.select-box');
				selectWebcomp.forEach((self) => {
					self.addEventListener("click", event => {
						event.preventDefault();

						var allTypes = webcompTypes.querySelectorAll('.select-box');
							allTypes.forEach((self) => {
								if(self.classList.contains('active')){
									self.classList.remove('active');
								}
							});
						event.currentTarget.classList.add('active');
					});
				});

			var webTypes = boardPop.querySelector('.tpgb-select-8');
			var selectWeb = webTypes.querySelectorAll('.select-box');
			selectWeb.forEach((self) => {
				self.addEventListener("click", event => {
					event.preventDefault();

					var allTypes = webTypes.querySelectorAll('.select-box');
						allTypes.forEach((self) => {
							if(self.classList.contains('active')){
								self.classList.remove('active');
							}
						});
					event.currentTarget.classList.add('active');
				});
			});
			
			proceedBtn.addEventListener("click", event => {
				event.preventDefault();

				var activeSection = boardPop.querySelector('.tpgb-on-boarding.active'),
					getstepVal = activeSection.getAttribute('data-step');
				var nextstepVal = Number(getstepVal) + 1;
				if(nextstepVal <= 8){
					var nextSection = boardPop.querySelector(`[data-step="${nextstepVal}"]`);
					activeSection.classList.remove('active');
					nextSection.classList.add('active');

					if(!step1.classList.contains('active')){
						backBtn.classList.add('active');
					}

					// Copy Offer Code
					if(step7.classList.contains('active')){
						
						var copyClick = boardPop.querySelector('.code-img');

						copyClick.addEventListener("click", function(e) {
							e.preventDefault();
							var copytxtDiv = boardPop.querySelector('.offer-code').textContent;
							
							if (copytxtDiv) {
								navigator.clipboard.writeText(copytxtDiv).then(function() {
									var copyIcon = boardPop.querySelector('.tpgb-copy-icon');
									e.target.remove();
									copyIcon.style.display = 'inline-block';
								}).catch(function() {
									console.log("Something went wrong");
								});
							}
						});
					}

					// Send Email
					if(step6.classList.contains('active')){
						tpgb_send_mail();
					}

					// Store Onboarding Data
					if(step8.classList.contains('active')){
						event.stopPropagation();
						proceedBtn.innerHTML = "Visit Dashboard";
						proceedBtn.classList.add('tpgb-onbor-last')

						var getdetBtn =  boardPop.querySelector('.tpgb-show-details');
						if(getdetBtn != null){
							getdetBtn.addEventListener("click", function(){
								var getdeDiv = this.parentNode.parentNode.querySelector('.tpgb-details');

								if(getdeDiv.classList.contains('show')){
									getdeDiv.classList.remove("show");
								}else{
									getdeDiv.classList.add("show");
								}
							})
						}

						if(nextstepVal === 8){
							tpgb_boarding_store(selectWebcomp , selectWeb , step8 , nextstepVal );
						}


					}
					
					// Install Nexter Theme
					if(step5.classList.contains('active')){
						tpgb_add_nexter(proceedBtn);
					}
					progessBar(nextstepVal);
				}
			});

			backBtn.addEventListener("click", event => {
				event.preventDefault();

				var activeSection = boardPop.querySelector('.tpgb-on-boarding.active'),
					getstepVal = activeSection.getAttribute('data-step');
				var nextstepVal = Number(getstepVal) - 1;
				var prevSection = boardPop.querySelector(`[data-step="${nextstepVal}"]`),
					getdetBtn =  boardPop.querySelector('.tpgb-show-details');
					activeSection.classList.remove('active');
					prevSection.classList.add('active');

				if(step1.classList.contains('active')){
					backBtn.classList.remove('active');
				}
				if(!step8.classList.contains('active')){
					proceedBtn.innerHTML = "Proceed";
				}
				if(proceedBtn.classList.contains('tpgb-onbor-last')){
					proceedBtn.onclick = ''; 
					proceedBtn.classList.remove('tpgb-onbor-last');
				}

				if(getdetBtn.parentNode.parentNode.querySelector('.tpgb-details').classList.contains('show')){
					getdetBtn.parentNode.parentNode.querySelector('.tpgb-details').classList.remove("show");
				}
				progessBar(nextstepVal);
			});

			function progessBar(nextstepVal){
				var progress = processWidth*nextstepVal;
				boardProcess.style.width = progress + '%';
				pagination.innerHTML = `${nextstepVal}/8`;
			}
			
			// Stey Update Email
			function tpgb_send_mail(){
				var tpgbSendEmail= document.querySelector('.submit-btn');
				tpgbSendEmail.addEventListener('click', event => {
					event.preventDefault();
					var tpgboName= document.querySelector('#tpgb-onb-name'),
						tpgboEmail= document.querySelector('#tpgb-onb-email'),
						errorDiv = document.querySelector('.input-note');

						if(tpgboName && tpgboName.value ==''){
							tpgb_on_validation( errorDiv , 'Name field is required.' )
						}else{
							if(tpgboEmail && tpgboEmail.value!=''){
								const validateEmail = (email) => {
									return email.match(
										/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
									);
									};
								if (validateEmail(tpgboEmail.value)) {
									const webhookBody = {
										full_name : tpgboName.value,
										email: tpgboEmail.value,
									};
									const welcomeEmailUrl = 'https://store.posimyth.com/?fluentcrm=1&route=contact&hash=30275c78-0cf5-42f1-adb0-32901bb25b90';
									fetch( welcomeEmailUrl, {
										method: 'POST',
										headers: {
											'Content-Type': 'application/json',
											'Access-Control-Allow-Origin' : 'http://localhost/',
										},
										mode: 'no-cors',
										body: JSON.stringify(webhookBody),
									}).then((response) => {
										if (response.ok) {
											tpgb_on_validation( errorDiv , 'Successfully send mail.' )
										}else{
											tpgb_on_validation( errorDiv , 'There was an error! Try again later!' )
										}
									});

								}else{
									tpgb_on_validation( errorDiv , 'Invalid email. Double-check your entry.' )
								}
							}else{
								tpgb_on_validation( errorDiv , 'Please Enter a Valid Email Address.' )
							}
						}
				})
			}

			// Form Field Vaildation
			function tpgb_on_validation(selector, msg) {
				selector.innerHTML = msg;
				selector.style.height = 'auto';
				selector.style.opacity = '1';
				setTimeout(function() {
					selector.style.height = '0';
					selector.style.opacity = '0';

				}, 5000);
			}

			// Store On Borading Data in DB
			function tpgb_boarding_store(select1 , select2 , stepno , current){
				if(current === 8){
					var onDonebtn = document.querySelector('.tpgb-onbor-last'),
					tpgb_ondata = document.getElementById('tpgb_ondata');

					if(onDonebtn != null ){
						onDonebtn.onclick = function(event) {
							event.preventDefault();
							var tpgbonData = { tpgb_web_com : '' , tpgb_web_Type : '' , tpgb_get_data : false , tpgb_onboarding : false };
							select1.forEach((obj) => {
								if(obj.classList.contains('active')){
									let webCom = obj.querySelector('.select-title')
									tpgbonData['tpgb_web_com'] = webCom.innerHTML;
								}
							})
							select2.forEach((obj) => {
								if(obj.classList.contains('active')){
									let webtype = obj.querySelector('.select-title')
									tpgbonData['tpgb_web_Type'] = webtype.innerHTML;
								}
							})

							if(tpgb_ondata){
								tpgbonData['tpgb_get_data'] = true;
							}

							if(tpgbonData){
								tpgbonData['tpgb_onboarding'] = true;	
								
								var xhr = new XMLHttpRequest();
								xhr.open("POST", tpgb_admin.ajax_url, true);
								xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

								xhr.onreadystatechange = function() {
								if (xhr.readyState === XMLHttpRequest.DONE) {
									if (xhr.status === 200) {

									var response = JSON.parse(xhr.response);
									if (response && response.onBoarding) {
										document.querySelector('.tpgb-boarding-pop').style.display = "none";
									}
									}
								}
								};

								xhr.send('action=tpgb_boarding_store&security=' + tpgb_admin.tpgb_nonce+'&boardingData='+ JSON.stringify(tpgbonData));
							}
						}
					}
				}
			}

			// Install & Active Nexter Theme
			function tpgb_add_nexter(btnscope){
				let addnxt = document.getElementById('in-nexter'),
					loder = document.querySelector('.tpgb-nxt-load'),
					notice = document.querySelector('.tpgb-wrong-msg-notice');

				addnxt.addEventListener( "change", function(){
					if(this.checked){
						btnscope.setAttribute('disabled' , true)

						var xhr = new XMLHttpRequest();
							xhr.open("POST", tpgb_admin.ajax_url, true);
							xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
							loder.style.display = 'flex';
							xhr.onreadystatechange = function() {
							if (xhr.readyState === XMLHttpRequest.DONE) {
								if (xhr.status === 200) {
								var response = JSON.parse(xhr.response);
								
								loder.style.display = 'none';
								
								var svgIcon = '';
								if (response.nexter) {
									svgIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512"><path fill="#27ae60" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>';
								} else {
									svgIcon = '<svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="15.75" stroke="#FC4032" stroke-width="0.5"></circle><circle cx="16" cy="16" r="12" fill="#FC4032"></circle><rect x="15" y="9" width="2" height="10" rx="1" fill="white"></rect><rect x="15" y="20" width="2" height="2" rx="1" fill="white"></rect></svg>';
								}
								
								notice.innerHTML = svgIcon + response.message;
								notice.classList.add('active');
								setTimeout(function() {
									notice.remove();
								}, 3500);
								
								btnscope.removeAttribute('disabled');
								}
							}
							};
							xhr.send('action=tpgb_install_nexter&security=' + tpgb_admin.tpgb_nonce);
							

					}else{
						btnscope. removeAttribute('disabled')
					}
				})
			}
		}
		/** On-boarding Process End */

		/** Plus Extra Page Start */
		let getSelectall = document.querySelectorAll('.extra-data-select');

		if(getSelectall){
			getSelectall.forEach((sel)=>{
				sel.addEventListener('change', (e)=>{
					let crt = e.currentTarget,
						cValue = crt.value,
						getId = crt.getAttribute('id'),
						allField = crt.closest('.tpgb-connection-all-fields'); 
					
					let conditionEl = allField.querySelectorAll('[data-condition-id='+getId+']');

					if(conditionEl){
						conditionEl.forEach((cel)=>{
							if(cValue == 'enable'){
								cel.style.display = '';
							}else{
								cel.style.display = 'none';
							}
						})
					}
				});
			});
		}
		/** Plus Extra Page End */


		document.body.addEventListener('click', function(e) {
			if (e.target.classList.contains('tpgb-logo-btn')) {
				e.preventDefault();
		
				// Create a media frame.
				var mediaUploader = wp.media({
					library: {
						type: 'image'
					},
					multiple: false
				});
		
				// When a media item is selected, do something with it.
				mediaUploader.on('select', function() {
					var attachment = mediaUploader.state().get('selection').first().toJSON();
					const extension = attachment.url.split('.').pop().toLowerCase();
		
					// Check if the extension is a valid image extension
					const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
					if (validExtensions.includes(extension)) {
						var imageUrl = attachment.url,
							imageId = attachment.id;
		
						document.querySelector('.tpgb_plus_logo-status img').src = imageUrl;
						document.getElementById('tpgb_plus_logo').value = imageUrl;
						document.getElementById('tpgb_plus_logo_id').value = imageId;
						document.querySelector('.tpgb_plus_logo-status').style.display = 'flex';
					}
				});
		
				// Open the media uploader.
				mediaUploader.open();
			} else if (e.target.classList.contains('tpgb-rempve-wl-logo')) {
				e.preventDefault();
				document.querySelector('.tpgb_plus_logo-status img').removeAttribute('src');
				document.getElementById('tpgb_plus_logo').removeAttribute('value');
				document.getElementById('tpgb_plus_logo_id').removeAttribute('value');
				document.querySelector('.tpgb_plus_logo-status').removeAttribute('style');
			}
		});

})();

/** On-boarding Process End */
var slidePage = 1;
showDivs(slidePage);

function plusPage(n){
	showDivs(slidePage += n);
}
function currentPage(n){
	showDivs(slidePage = n);
}
function showDivs(n){
	var i;
	var x = document.querySelectorAll(".tpgb-onboarding-details.slider");
	var sliderDots = document.querySelector('.slider-btns');
	var dots = (sliderDots != null) ? sliderDots.querySelectorAll(".slider-btn") : '';

	if(n > x.length){
		slidePage = 1;
	}
	if(n < 1){
		slidePage = x.length;
	}
	for(i=0; i<x.length; i++){
		x[i].style.display = "none";
	}
	for(i=0; i<dots.length; i++){
		dots[i].className = dots[i].className.replace(" active", "");
	}

	if(x[slidePage-1] != null){
		x[slidePage-1].style.display = "block";
	}
	if(dots[slidePage-1] != null){
		dots[slidePage-1].className += " active";
	}
}

/** On-boarding Process End */