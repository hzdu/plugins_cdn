/* Javascript Document */
if ( commercekit_ajs.ajax_search == 1 ) {
	function ckit_ajax_search(){
		var minChar = commercekit_ajs.char_count;
		var maxHeight = 600;
		var deferRequestBy = 200;
		var cSuggestions = {};
		var cViewAlls = {};
		var inputs = document.querySelectorAll('input[type="search"]');
		inputs.forEach(function(input){
			var searchWidget = input.closest('.widget_search');
			var productWidget = input.closest('.woocommerce.widget_product_search');
			if( !searchWidget && !productWidget ) return false;
			var currentRequest = null;
			var currentCancel = null;
			var currentValue = '';
			var iwidth = input.offsetWidth;
			var form = input.closest('form');
			form.insertAdjacentHTML('beforeend', '<div class="commercekit-ajs-results" style="max-height: '+maxHeight+'px; width: '+iwidth+'px;"><div class="commercekit-ajs-suggestions" style="position: absolute; display: none; max-height: '+maxHeight+'px; z-index: 9999; width: '+iwidth+'px;"></div><div class="commercekit-ajs-view-all-holder" style="display: none;"></div></div>');
			input.setAttribute('autocomplete', 'off');
			input.classList.add('commercekit-ajax-search');
			
			if( commercekit_ajs.layout == 'product' ){
				var post_type = form.querySelector('input[name="post_type"]');
				if( post_type ){
					post_type.value = 'product';
				} else {
					var hidinput = document.createElement('input');
					hidinput.setAttribute('type', 'hidden');
					hidinput.setAttribute('name', 'post_type');
					hidinput.setAttribute('value', 'product');
					input.parentNode.insertBefore(hidinput, input.nextSibling);
				}
			} else {
				var post_type = form.querySelector('input[name="post_type"]');
				if( post_type ){
					post_type.parentNode.removeChild(post_type);
				}
			}

			form.addEventListener('submit', function(e){
				var formsugg = form.querySelector('.commercekit-ajs-suggestions');
				var active = formsugg.querySelector('.active');
				if( active ){
					e.preventDefault();
					active.querySelector('a').click();
					return false;
				}
			});
			input.addEventListener('keyup', function(e){
				formresult = form.querySelector('.commercekit-ajs-results');
				formsugg = form.querySelector('.commercekit-ajs-suggestions');
				formall = form.querySelector('.commercekit-ajs-view-all-holder');
				var code = (e.keyCode || e.which);
				if (code === 37 || code === 38 || code === 39 || code === 40 || code === 27 || code === 13 || input.value.length < minChar ) {
					if( code === 27 ) {
						clearTimeout(currentRequest);
						ckCloseAllSuggestions();
					} else if( code === 38 || code === 40 || code === 13 ) {
						var result = ckAjaxSearchKeyboardAccess(code, formsugg, input);
						if( result == false ){
							e.preventDefault();
							return;
						}
					} else {
						return;
					}
				} else {
					clearTimeout(currentRequest);
					ckCloseAllSuggestions();
					formsugg.innerHTML = ''; formsugg.style.display = 'none';
					formall.innerHTML = ''; formall.style.display = 'none';

					if( cSuggestions[input.value] !== undefined ){
						formsugg.innerHTML = cSuggestions[input.value];
						formsugg.style.display = 'block';
						formall.innerHTML = cViewAlls[input.value];
						if( cViewAlls[input.value] != '' ){
							formall.style.display = 'block';
							ckPrepareSuggestionsHeight(input, form, formall, formresult, formsugg);
						} else {
							ckPrepareSuggestionsHeight(input, form, null, formresult, formsugg);
						}
					} else {
						if( currentValue == input.value ){
							return;
						}
						currentRequest = setTimeout(function(){
							currentValue = input.value;
							input.setAttribute('style', 'background-image: url(' + commercekit_ajs.loader_icon + '); background-repeat: no-repeat; background-position:50% 50%;');
							var url = commercekit_ajs.ajax_url + '=' + commercekit_ajs.action+'&query='+input.value;
							if( currentCancel ){
								currentCancel.abort();
							}
							currentCancel = new AbortController();
							fetch(url, {signal: currentCancel.signal}).then(response => response.json()).then(json => {
								input.setAttribute('style', 'background-image: none; background-repeat: no-repeat; background-position:50% 50%;');
								var html = '';
								var canViewAll = true;
								var noResult = 0;
								if( json.suggestions.length == 0 ) {
									html = '<div class="autocomplete-no-suggestion">'+commercekit_ajs.no_results_text+'</div>';
									cSuggestions[input.value] = html;
									cViewAlls[input.value] = '';
									canViewAll = false;
									noResult = 1;
								} else {
									json.suggestions.forEach(suggestion => {
										html += '<div class="autocomplete-suggestion">'+suggestion.data+'</div>';
									});
									cSuggestions[input.value] = html;
									cViewAlls[input.value] = json.view_all_link;
								}
								formsugg.innerHTML = cSuggestions[input.value];
								formsugg.style.display = 'block';
								if( canViewAll ) {
									formall.innerHTML = cViewAlls[input.value];
									formall.style.display = 'block';
									ckPrepareSuggestionsHeight(input, form, formall, formresult, formsugg);
								} else {
									ckPrepareSuggestionsHeight(input, form, null, formresult, formsugg);
								}
								var url2 = commercekit_ajs.ajax_url + '=commercekit_search_counts&query='+input.value+'&no_result='+noResult;
								fetch(url2).then(response => response.json()).then(json => {}).catch(function(e){});
							}).catch(function(e){});
						}, deferRequestBy);
					}
				}
			});
			input.addEventListener('focus', function(e){
				var input = e.target;
				if( input.classList.contains('commercekit-ajax-search') && input.value.length >= commercekit_ajs.char_count ){
					var form = input.closest('form');
					var formresult = form.querySelector('.commercekit-ajs-results');
					var formsugg = form.querySelector('.commercekit-ajs-suggestions');
					var formall = form.querySelector('.commercekit-ajs-view-all-holder');
					if( formsugg.querySelectorAll('.autocomplete-suggestion').length > 0 ){
						ckCloseAllSuggestions();
						if( !formall ) formall = null;
						if( formsugg ) formsugg.style.display = 'block';
						if( formall ) formall.style.display = 'block';
						ckPrepareSuggestionsHeight(input, form, formall, formresult, formsugg)
					} else {
						var keyup = new Event('keyup');
						input.dispatchEvent(keyup);
					}
				}
			});
		});
		document.onclick = function(e){
			if( !e.target.classList.contains('commercekit-ajs-suggestions') && !e.target.classList.contains('commercekit-ajax-search') ){
				ckCloseAllSuggestions();
			}
		}
	}
	ckit_ajax_search();
}
function ckCloseAllSuggestions(){
	document.querySelectorAll('.commercekit-ajs-results').forEach(function(results){ 
		results.style.height = '0px';
	});
	document.querySelectorAll('.commercekit-ajs-suggestions').forEach(function(suggestion){
		suggestion.style.display = 'none';
	});
	document.querySelectorAll('.commercekit-ajs-view-all-holder').forEach(function(viewall){
		viewall.style.display = 'none';
	});
}
function ckPrepareSuggestionsHeight(input, form, formall, formresult, formsugg){
	var $height = 0;
	form.querySelectorAll('.autocomplete-suggestion, .autocomplete-no-suggestion').forEach(function(list){
		$height += list.offsetHeight;
	});
	if( formall ){
		$height += formall.offsetHeight;
	}
	formresult.style.height = $height+'px';
	formresult.style.width = input.offsetWidth+'px';
	formsugg.style.width = input.offsetWidth+'px';
	var oresult = form.querySelector('.commercekit-ajs-other-result');
	if( oresult ){
		oresult.parentNode.classList.add('commercekit-ajs-other-result-wrap');
	}
}
function ckAjaxSearchKeyboardAccess(code, formsugg, input){
	input.selectionStart = input.selectionEnd = input.value.length;
	if( formsugg.style.display == 'block' ){
		var active = formsugg.querySelector('.active');
		if( ! active ){
			if( !formsugg.firstChild.classList.contains('commercekit-ajs-other-result-wrap')){
				active = formsugg.firstChild;
			} else {
				if( formsugg.firstChild.nextSibling )
					active = formsugg.firstChild.nextSibling;
			}
		} else {
			if( code === 38 ){
				active.classList.remove('active');
				if( active.previousSibling ){
					if( !active.previousSibling.classList.contains('commercekit-ajs-other-result-wrap')){
						active = active.previousSibling;
					} else {
						if( active.previousSibling.previousSibling ){
							active = active.previousSibling.previousSibling;
						} else if( formsugg.lastChild ) {
							active = formsugg.lastChild;
						}
					}
				} else if( formsugg.lastChild ) {
					active = formsugg.lastChild;
				}
			}
			if( code === 40 ){
				active.classList.remove('active');
				if( active.nextSibling ){
					if( !active.nextSibling.classList.contains('commercekit-ajs-other-result-wrap')){
						active = active.nextSibling;
					} else {
						if( active.nextSibling.nextSibling ){
							active = active.nextSibling.nextSibling;
						} else if( formsugg.firstChild ){
							active = formsugg.firstChild;
						}
					}
				} else if( formsugg.firstChild ){
					active = formsugg.firstChild;
				}
			}
		}
		if( ( code === 38 || code === 40 ) && active ){
			active.classList.add('active');
		} else if( code === 13 && active ) {
			return false;
		}
		return true;
	}
}
function ckAdjustSuggestionsHeight(img){
	var $height = 0;
	var form = img.closest('form');
	var formresult = form.querySelector('.commercekit-ajs-results');
	var formall = form.querySelector('.commercekit-ajs-view-all-holder');
	form.querySelectorAll('.autocomplete-suggestion, .autocomplete-no-suggestion').forEach(function(list){
		$height += list.offsetHeight;
	});
	if( formall.style.display == 'block' ){
		$height += formall.offsetHeight;
	}
	formresult.style.height = $height+'px';
}
