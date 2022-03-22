/* JavaScript */
var ckas_jq = null;
if( jQuery && typeof jQuery.fn.wc_variation_form == 'function' ){
	ckas_jq = jQuery;
} else if( $ && typeof $.fn.wc_variation_form == 'function' ){
	ckas_jq = $;
}
var cgkit_attr_swatches = document.querySelectorAll('.cgkit-attribute-swatches');
if( cgkit_attr_swatches.length > 0 ){
	document.addEventListener('click', function(e){
		var input = e.target;
		var inputp = input.closest('.cgkit-swatch');
		if( input.classList.contains('cgkit-swatch') || inputp ) {
			if( inputp ){
				input = inputp;
			}
			e.preventDefault();
			e.stopPropagation();
			if( input.classList.contains('cgkit-disabled') ) {
				var form = input.closest('form');
				cgkitResetAttributeSwatches(form);
				input.classList.remove('cgkit-disabled');
				input.setAttribute('title', input.getAttribute('data-attribute-text'));
			}
			cgkitUpdateAttributeSwatch(input);
			setTimeout(function(){cgkitUpdateAttributeSwatchImage(input);}, 200);
		}
		if( input.classList.contains('reset_variations') ) {
			e.preventDefault();
			e.stopPropagation();
			var form = input.closest('form');
			cgkitClearAttributeSwatches(form, true);
		}
	});
	var cgkit_sel_swatches = document.querySelectorAll('.cgkit-swatch.cgkit-swatch-selected');
	cgkit_sel_swatches.forEach(function(input){
		cgkitUpdateAttributeSwatch2(input);
	});
	var cgkit_update_called = false;
	if( ckas_jq ){
		ckas_jq('form.variations_form:not(.cgkit-swatch-form)').on('woocommerce_update_variation_values', function(){
			if( !cgkit_update_called ){
				setTimeout(cgkitUpdateAvailableAttributes(this), 200);
			}
			cgkit_update_called = true;
		});
	}
	var single_form = document.querySelector('form.variations_form:not(.cgkit-swatch-form)');
	if( single_form ){
		setTimeout(cgkitUpdateAvailableAttributes(single_form), 200);
	}
}
function cgkitUpdateAttributeSwatch(input){
	var form = input.closest('form');
	var parent = input.closest('.cgkit-attribute-swatches');
	var attr_name = parent.getAttribute('data-attribute');
	var no_selection = parent.getAttribute('data-no-selection');
	var attr_value = input.getAttribute('data-attribute-value');
	var attr_text = input.getAttribute('data-attribute-text');
	var swatch_type = input.getAttribute('data-type');
	var attr_obj = form.querySelector('[name="'+attr_name+'"]');
	var clear_all = form.querySelector('.reset_variations');
	if( attr_obj ){
		if( swatch_type == 'button' ){
			attr_text = input.innerHTML;
		}
		var clone_input = null;
		var clone_parent = input.closest('tr.cgkit-as-swatches-original');
		if( !clone_parent ){
			clone_parent = form.querySelector('tr.cgkit-as-swatches-original');
		} else {
			clone_parent = form.querySelector('div.cgkit-as-swatches-clone');
		}
		if( clone_parent ){
			clone_input = clone_parent.querySelector('[data-attribute-value="'+attr_value+'"]');
		}
		if( input.classList.contains('cgkit-swatch-selected') ) {
			attr_value = '';
			input.classList.remove('cgkit-swatch-selected');
			if( clone_input ){
				clone_input.classList.remove('cgkit-swatch-selected');
			}
		} else {
			var inputs = parent.querySelectorAll('.cgkit-swatch');
			inputs.forEach(function(oinput){
				oinput.classList.remove('cgkit-swatch-selected');
			});
			input.classList.add('cgkit-swatch-selected');

			if( clone_parent && clone_input ){
				var clone_inputs = clone_parent.querySelectorAll('.cgkit-swatch');
				clone_inputs.forEach(function(clone_oinput){
					clone_oinput.classList.remove('cgkit-swatch-selected');
				});
				clone_input.classList.add('cgkit-swatch-selected');
			}
		}
		var text_obj = form.querySelector('.cgkit-chosen-attribute.'+attr_name);
		if( text_obj ){
			if( attr_value == '' ){
				text_obj.innerHTML = no_selection;
				text_obj.classList.add('no-selection');
			} else {
				text_obj.innerHTML = attr_text;
				text_obj.classList.remove('no-selection');
			}
		}
		attr_obj.value = attr_value;
		if( ckas_jq ){
			ckas_jq(attr_obj).change();
		} else {
			attr_obj.dispatchEvent(new Event('change'));
		}
		if( clear_all ) {
			var select_objs = form.querySelectorAll('.cgkit-swatch.cgkit-swatch-selected');
			if( select_objs.length > 0 ){
				clear_all.style.visibility = 'visible';
			} else {
				clear_all.style.visibility = 'hidden';
			}
		}
		setTimeout(cgkitUpdateAvailableAttributes(form), 100);
		if( form.classList.contains('cgkit-swatch-form') ) {
			setTimeout(cgkitAutoAddToCartVariation(form), 150);
		}
	}
}
function cgkitUpdateAttributeSwatch2(input){
	var form = input.closest('form');
	var parent = input.closest('.cgkit-attribute-swatches');
	var attr_name = parent.getAttribute('data-attribute');
	var no_selection = parent.getAttribute('data-no-selection');
	var attr_value = input.getAttribute('data-attribute-value');
	var attr_text = input.getAttribute('data-attribute-text');
	var swatch_type = input.getAttribute('data-type');
	var attr_obj = form.querySelector('[name="'+attr_name+'"]');
	if( attr_obj ){
		if( swatch_type == 'button' ){
			attr_text = input.innerHTML;
		}
		var text_obj = form.querySelector('.cgkit-chosen-attribute.'+attr_name);
		if( text_obj ){
			if( attr_value == '' ){
				text_obj.innerHTML = no_selection;
				text_obj.classList.add('no-selection');
			} else {
				text_obj.innerHTML = attr_text;
				text_obj.classList.remove('no-selection');
			}
		}
	}
}
function cgkitClearAttributeSwatches(form, update){
	var cgkit_swatches = form.querySelectorAll('.cgkit-attribute-swatches');
	cgkit_swatches.forEach(function(cgkit_swatch){
		var attr_name = cgkit_swatch.getAttribute('data-attribute');
		var no_selection = cgkit_swatch.getAttribute('data-no-selection');
		var inputs = cgkit_swatch.querySelectorAll('.cgkit-swatch');
		inputs.forEach(function(input){
			input.classList.remove('cgkit-swatch-selected');
			input.classList.remove('cgkit-disabled');
			input.setAttribute('title', input.getAttribute('data-attribute-text'));
		});
		var text_obj = form.querySelector('.cgkit-chosen-attribute.'+attr_name);
		if( text_obj ){
			text_obj.innerHTML = no_selection;
			text_obj.classList.add('no-selection');
		}
		if( !update ){
			var attr_obj = form.querySelector('[name="'+attr_name+'"]');
			if( attr_obj ) {
				attr_obj.value = '';
				if( ckas_jq ){
					ckas_jq(attr_obj).change();
				} else {
					attr_obj.dispatchEvent(new Event('change'));
				}
			}
		}
	});
	if( update ){
		setTimeout(cgkitUpdateAvailableAttributes(form), 200);
	}
	var notice = document.querySelector('#cgkit-as-notice-wrap');
	if( notice ){
		notice.style.display = 'none';
	}
}
function cgkitResetAttributeSwatches(form){
	var clear_all = form.querySelector('.reset_variations');
	var cgkit_swatches = form.querySelectorAll('.cgkit-attribute-swatches');
	cgkit_swatches.forEach(function(cgkit_swatch){
		var attr_name = cgkit_swatch.getAttribute('data-attribute');
		var no_selection = cgkit_swatch.getAttribute('data-no-selection');
		var inputs = cgkit_swatch.querySelectorAll('.cgkit-swatch-selected');
		inputs.forEach(function(input){
			input.classList.remove('cgkit-swatch-selected');
			input.classList.remove('cgkit-disabled');
			input.setAttribute('title', input.getAttribute('data-attribute-text'));
		});
		var attr_obj = form.querySelector('[name="'+attr_name+'"]');
		if( attr_obj ){
			attr_obj.value = '';
			if( ckas_jq ){
				ckas_jq(attr_obj).change();
			} else {
				attr_obj.dispatchEvent(new Event('change'));
			}
		}
		var text_obj = form.querySelector('.cgkit-chosen-attribute.'+attr_name);
		if( text_obj ){
			text_obj.innerHTML = no_selection;
			text_obj.classList.add('no-selection');
		}
	});
	if( clear_all ) {
		clear_all.style.visibility = 'hidden';
	}
}
function cgkitUpdateAvailableAttributes(form){
	var cgkit_swatches = form.querySelectorAll('.cgkit-attribute-swatches');
	cgkit_swatches.forEach(function(cgkit_swatch){
		var attr_name = cgkit_swatch.getAttribute('data-attribute');
		var attr_obj = form.querySelector('[name="'+attr_name+'"]');
		var attr_obj_val = attr_obj.value;
		var inputs = cgkit_swatch.querySelectorAll('.cgkit-swatch');
		inputs.forEach(function(input){
			var attr_value = input.getAttribute('data-attribute-value');
			var attr_value2 = attr_value.replace(/"/g, '\\"');
			attr_value2 = attr_value2.replace(/'/g, "\\'");
			var find_opt = attr_obj.querySelector('option[value="'+attr_value2+'"]');
			if( !find_opt ){
				input.classList.remove('cgkit-swatch-selected');
				input.classList.add('cgkit-disabled');
				input.setAttribute('title', input.getAttribute('data-oos-text'));
			} else {
				input.classList.remove('cgkit-disabled');
				input.setAttribute('title', input.getAttribute('data-attribute-text'));
				if( attr_value == attr_obj_val ){
					input.classList.add('cgkit-swatch-selected');
				}
			}
		});
	});
}
function cgkitAutoAddToCartVariation(form){
	var input_var = form.querySelector('input.variation_id');
	if( input_var ){
		var dis_atc = form.closest('.product.cgkit-disable-atc');
		if( dis_atc || form.classList.contains('cgkit-disable-atc-form') ){
			var wraps = form.querySelectorAll('table.variations .cgkit-attribute-swatches');
			var hide_rows = form.querySelectorAll('table.variations tr.cgkit-hide-loop');
			var vis_row_count = wraps.length - hide_rows.length;
			var url = form.getAttribute('action');
			url = url.indexOf('?') == -1 ? url + '?' : url + '&';
			var params = [];
			wraps.forEach(function(wrap){
				var attr_name = wrap.getAttribute('data-attribute');
				var attr_val = '';
				var attr_obj = wrap.querySelector('.cgkit-swatch-selected');
				if( attr_obj ){
					attr_val = attr_obj.getAttribute('data-attribute-value');
					if( attr_name && attr_val ){
						params.push( attr_name + '=' + attr_val ); 
					}
				}
			});
			if( ( vis_row_count == 1 || vis_row_count == 2 ) && vis_row_count == params.length ){
				url = url + params.join('&');
				window.location.href = url;
				return;
			}
		}

		var variation_id = input_var.value;
		var product_id = form.getAttribute('data-product_id');
		var out_of_stock = form.querySelector('.stock.out-of-stock');
		if( form.classList.contains('cgkit-disable-atc-form') ){
			return true;
		}
		if( variation_id != '' && !out_of_stock ){
			form.classList.add('loading');
			form.classList.add('cgkit-loading');
			cgkitHideOtherFormNotices(form);
			var formData = new FormData();
			formData.append('product_id', product_id);
			formData.append('variation_id', variation_id);
			var wraps = form.querySelectorAll('table.variations .cgkit-attribute-swatches');
			wraps.forEach(function(wrap){
				var attr_name = wrap.getAttribute('data-attribute');
				var attr_val = '';
				var attr_obj = wrap.querySelector('.cgkit-swatch-selected');
				if( attr_obj ){
					attr_val = attr_obj.getAttribute('data-attribute-value');
					if( attr_name && attr_val ){
						formData.append('variations['+attr_name+']', attr_val);
					}
				}
			});
			var data = {};
			data['quantity'] = 1;
			data['product_id'] = variation_id;
			data['product_sku'] = '';
			var $thisbutton = null;
			if( ckas_jq ){
				ckas_jq(document.body).trigger('adding_to_cart', [$thisbutton, data]);
			}
			fetch( commercekit_ajs.ajax_url + '=commercekit_ajax_as_add_to_cart', {
				method: 'POST',
				body: formData,
			}).then(response => response.json()).then( json => {
				if( json.status == 1 ){
					if( ckas_jq ){
						ckas_jq(document.body).trigger('added_to_cart', [json.fragments, json.cart_hash, $thisbutton]);
					}
					cgkitClearAttributeSwatches(form, false);
					cgkitClearAttributeSwatchImage(form);
				} else {
					if( json.notices != '' ){
						cgkitAttributeSwatchesNotice(json.notices);
					}
				}
				form.classList.remove('loading');
				form.classList.remove('cgkit-loading');
			});
		} else {
			setTimeout(function(){
				var wrap = form.querySelector('.cgkit-swatch-quickwrap');
				if( wrap ){
					wrap.style.height = "auto";
					var height = wrap.clientHeight + "px";
					wrap.style.height = height;
				}
			}, 200);
		}
	}
}
function cgkitUpdateSwatchesDetails(){
	if( window.innerWidth > 992 ){
		var details = document.querySelectorAll('form.cgkit-swatch-form details');
		details.forEach(function(detail){
			detail.setAttribute('open', true);
		});
	} else {
		var details = document.querySelectorAll('form.cgkit-swatch-form details');
		details.forEach(function(detail){
			if( detail.hasAttribute('open') ){
				detail.removeAttribute('open');
			}
		});
	}
}
function cgkitUpdateAttributeSwatchImage(input){
	var form = input.closest('form');
	var form_parent = form.closest('.product');
	var img_img = form_parent.querySelector('img.wp-post-image-cgas');
	if( !img_img ){
		return;
	}
	var images = JSON.parse(form.getAttribute('data-images'));
	if( !images || Object.keys(images).length == 0 ){
		return;
	}

	var default_img = false;
	if( !input.classList.contains('cgkit-swatch-selected') ){
		var tinput = null;
		var ninputs = form.querySelectorAll('.cgkit-swatch-selected');
		ninputs.forEach(function(ninput){
			var gimg_id1 = ninput.getAttribute('data-gimg_id');
			var image_id1 = '';
			if( commercekit_as.cgkit_attr_gal == 1 && gimg_id1 != '' ){
				image_id1 = gimg_id1;
			}
			if( image_id1 != '' ){
				tinput = ninput;
				return;
			}
		});
		if( tinput ){
			input = tinput;
		} else {
			default_img = true;
		}
	}
	var gimg_id = input.getAttribute('data-gimg_id');
	var image_id = '';
	if( commercekit_as.cgkit_attr_gal == 1 && gimg_id != '' ){
		image_id = gimg_id;
	}
	if( image_id == '' ){
		var ninputs2 = form.querySelectorAll('.cgkit-swatch-selected');
		ninputs2.forEach(function(ninput2){
			var gimg_id2 = ninput2.getAttribute('data-gimg_id');
			var image_id2 = '';
			if( commercekit_as.cgkit_attr_gal == 1 && gimg_id2 != '' ){
				image_id2 = gimg_id2;
			}
			if( image_id2 != '' ){
				image_id = image_id2;
				return;
			}
		});
		if( image_id == '' ){
			default_img = true;
		}
	}
	var vimg_id = form.getAttribute('current-image');
	if( image_id == '' && vimg_id != '' ){
			image_id = vimg_id;
			default_img = false;
	}
	if( !default_img && image_id != '' && images.hasOwnProperty('img_'+image_id) ){
		var img_key = 'img_'+image_id;
		var img_src = img_img.getAttribute('data-cgas-src');
		var img_srcset = img_img.getAttribute('data-cgas-srcset');
		var img_sizes = img_img.getAttribute('data-cgas-sizes');
		if( !img_src ){
			img_img.setAttribute('data-cgas-src', img_img.getAttribute('src'));
			img_img.setAttribute('data-cgas-srcset', '');
			img_img.setAttribute('data-cgas-sizes', '');
			if( img_srcset ){
				img_img.setAttribute('data-cgas-srcset', img_srcset);
			}
			if( img_sizes ){
				img_img.setAttribute('data-cgas-sizes', img_sizes);
			}
		}
		if( images[img_key].srcset ){
			img_img.setAttribute('srcset', images[img_key].srcset);
		} else {
			img_img.setAttribute('srcset', '');
		}
		if( images[img_key].sizes ){
			img_img.setAttribute('sizes', images[img_key].sizes);
		} else {
			img_img.setAttribute('sizes', '');
		}
		img_img.setAttribute('src', images[img_key].src);
	} else {
		cgkitClearAttributeSwatchImage(form);
	}
}
function cgkitClearAttributeSwatchImage(form){
	var form_parent = form.closest('.product');
	var img_img = form_parent.querySelector('img.wp-post-image-cgas');
	if( !img_img ){
		return;
	}
	var img_src = img_img.getAttribute('data-cgas-src');
	var img_srcset = img_img.getAttribute('data-cgas-srcset');
	var img_sizes = img_img.getAttribute('data-cgas-sizes');
	if( img_src ){
		if( img_srcset ){
			img_img.setAttribute('srcset', img_srcset);
		} else {
			img_img.setAttribute('srcset', '');
		}
		if( img_sizes ){
			img_img.setAttribute('sizes', img_sizes);
		} else {
			img_img.setAttribute('sizes', '');
		}
		img_img.setAttribute('src', img_src);
	}
}
function cgkitAttributeSwatchesNotice(notice){
	var cgkit_notice_wrap = document.querySelector('#cgkit-as-notice-wrap');
	if( cgkit_notice_wrap ){
		cgkit_notice = cgkit_notice_wrap.querySelector('#cgkit-as-notice');
		cgkit_notice.innerHTML = notice;
		cgkit_notice_wrap.style.display = 'block';
	} else {
		document.body.insertAdjacentHTML( 'beforeend', '<div id="cgkit-as-notice-wrap"><a href="javascript:;" class="cgkit-as-notice-close">X</a><div id="cgkit-as-notice">'+notice+'</div></div>' );
	}
}
var cgkit_as_product_ids = [];
var cgkit_swatch_forms = document.querySelectorAll('form.cgkit-swatch-form');
if( cgkit_swatch_forms.length > 0 ){
	var product_ids = [];
	cgkit_swatch_forms.forEach(function(as_form){
		as_form.classList.add('variations_form');
		as_form.classList.add('cart');
		var hide_attrs = as_form.querySelectorAll('table.variations tr.cgkit-hide-loop');
		if( hide_attrs.length > 0 ){
			as_form.classList.add('cgkit-disable-atc-form');
		}
		product_ids.push(as_form.getAttribute('data-product_id'));
		var frm_parent = as_form.closest('.product');
		if( frm_parent ) {
			var img_wrap = frm_parent.querySelector('.woocommerce-image__wrapper');
			if( img_wrap ){
				img_wrap.classList.add('images');
				var img_link = img_wrap.querySelector('a');
				if( img_link ){
					img_link.classList.add('woocommerce-product-gallery__image');
				}
				var img_img = img_wrap.querySelector('img');
				if( img_img ){
					img_img.classList.add('wp-post-image-cgas');
				}
			} else {
				var img_img = frm_parent.querySelector('img.attachment-woocommerce_thumbnail');
				if( img_img ){
					img_img.classList.add('wp-post-image-cgas');
					var img_wrap = document.createElement('span');
					img_wrap.classList.add('images');
					var img_link = document.createElement('span');
					img_link.classList.add('woocommerce-product-gallery__image');
					img_wrap.appendChild(img_link);
					img_img.parentNode.insertBefore(img_wrap, img_img);
					img_link.appendChild(img_img);
				}
			}
		}

		vform_observer = new MutationObserver((changes) => {
			changes.forEach(change => {
				var blocks = as_form.querySelector('.blockUI.blockOverlay');
				if( blocks ){
					var dis_atc = as_form.closest('.product.cgkit-disable-atc');
					if( dis_atc || as_form.classList.contains('cgkit-disable-atc-form') ){
						return;
					} else {
						as_form.classList.add('loading');
						cgkitHideOtherFormNotices(as_form);
					}
				} else {
					if( !as_form.classList.contains('cgkit-loading') ){
						as_form.classList.remove('loading');
					}
				}
			});
		});
		vform_observer.observe(as_form, {childList:true, subtree:true});

		var vinput = as_form.querySelector('input.variation_id');
		if( vinput ){
			vinput_observer = new MutationObserver((changes) => {
				changes.forEach(change => {
					if(change.attributeName.includes('value')){
						setTimeout(function(){
							if( vinput.value != '' && vinput.value != '0' && as_form.getAttribute('data-product_variations') == 'false' ){
								cgkitAutoAddToCartVariation(as_form);
							}	
						}, 150);
					}
				});
			});
			vinput_observer.observe(vinput, {attributes : true});
		}
	});
	var uproduct_ids = product_ids.filter(function(product_id, index){
		return product_ids.indexOf(product_id) === index;
	});
	var fproduct_ids = uproduct_ids.slice(0, 6);
	cgkit_as_product_ids = uproduct_ids.slice(6);

	if( commercekit_as.swatches_ajax == 1 ){
		cgkitGetAjaxAttributeSwatchesVariations(fproduct_ids, 1);
	}

	document.addEventListener('click', function(e){
		var input = e.target;
		var inputp = input.closest('.cgkit-as-notice-close');
		if( input.classList.contains('cgkit-as-notice-close') || inputp ) {
			if( inputp ){
				input = inputp;
			}
			e.preventDefault();
			e.stopPropagation();
			var parent = input.closest('#cgkit-as-notice-wrap');
			if( parent ){
				parent.style.display = 'none';
			}
		}
	});
	window.addEventListener('resize', function(e){
		cgkitUpdateSwatchesDetails();
	});
	cgkitUpdateSwatchesDetails();
}
function cgkitGetAjaxAttributeSwatchesVariations(product_ids, page){
	var formData = new FormData();
	formData.append('product_ids', product_ids);
	fetch( commercekit_ajs.ajax_url + '=commercekit_get_ajax_as_variations', {
		method: 'POST',
		body: formData,
	}).then(response => response.json()).then( json => {
		if( json.status == 1 && Object.keys(json.variations).length > 0 ){
			for( var product_id in json.variations ){
				var forms = document.querySelectorAll('form[data-product_id="'+product_id+'"]');
				forms.forEach(function(form){
					if( ckas_jq ) {
						form.classList.remove('cgkit-no-actions');
						form.setAttribute('data-product_variations', json.variations[product_id]);
						form.setAttribute('data-images', json.images[product_id]);
						var var_form = ckas_jq(form);
						var_form.removeData('product_variations');
						var_form.removeData('images');
						var_form.wc_variation_form();
					}
				});
			}
			
		}
		if( page == 2 ){
			cgkit_as_product_ids = [];
		}
	});
}
function cgkitHideOtherFormNotices(as_form){
	var no_matches = document.querySelectorAll('.wc-no-matching-variations');
	no_matches.forEach(function(no_matche){
		var tas_form = no_matche.closest('form');
		if( tas_form ){
			if( tas_form !== as_form ){
				no_matche.style.display = 'none';
			}
		}
	});
	var notices = document.querySelector('#cgkit-as-notice-wrap');
	if( notices ){
		notices.style.display = 'none';
	}
}
function loadAS(){
	var as_form = document.querySelectorAll('form.cgkit-swatch-form');
	if( as_form.length > 0 ){
		var dynamic_css = '';
		as_form.forEach(function(as_form){
			var product_id = as_form.getAttribute('data-product_id');
			var rows = as_form.querySelectorAll('table.variations tr');
			var clone = as_form.querySelector('.cgkit-as-swatches-clone');
			var row_count = 0;
			var product_height = 0;
			var margin_top = 0;
			rows.forEach(function(row){
				if( !row.classList.contains('cgkit-hide-loop') ){
					if( row_count != 0 ){
						row.style.marginTop = margin_top+'px';
						row.style.display = 'table-row';
						product_height += row.clientHeight;
						margin_top = row.clientHeight;
						row.style.display = '';
					} else {
						var original = row.querySelector('.cgkit-as-wrap-plp');
						if( clone && original ){
							clone.innerHTML = original.innerHTML;
							row.classList.add('cgkit-as-swatches-original');
						}
					}
					row_count++;
				}
			});
			if( row_count == 1 ){
				as_form.classList.add('cgkit-single-attribute');
			}
			dynamic_css += 'ul.products li.post-'+product_id+'.product:not(.product-category):before { padding-bottom: '+product_height+'px; }';	
		});
		var as_css = document.createElement('style');
		as_css.type = 'text/css';
		as_css.id = 'cgkit-as-dynamic-css';
		as_css.innerHTML = dynamic_css;
		document.body.appendChild(as_css);
	}
}
const asUserInteractionEvents = ["mouseover", "keydown", "touchstart", "touchmove", "wheel"];
asUserInteractionEvents.forEach(function(event) {
    window.addEventListener(event, triggerASScriptLoader, {
        passive: !0
    })
});
function triggerASScriptLoader() {
    loadASScripts();
    asUserInteractionEvents.forEach(function(event) {
        window.removeEventListener(event, triggerASScriptLoader, {
            passive: !0
        })
    })
}
function loadASScripts() {
	loadAS();
	if( commercekit_as.swatches_ajax == 1 ){
		if( cgkit_as_product_ids.length > 0 ){
			cgkitGetAjaxAttributeSwatchesVariations(cgkit_as_product_ids, 2);
		}
	}
}
class CgkitAccordion {
	constructor(el) {
		this.el = el;
		this.summary = el.querySelector('summary');
		this.content = el.querySelector('.ckit-attributes-wrap');
		this.animation = null;
		this.isClosing = false;
		this.isExpanding = false;
		this.summary.addEventListener('click', (e) => this.onClick(e));
	}

	onClick(e) {
		e.preventDefault();
		if( this.isClosing || !this.el.open ){
			this.open();
		} else if( this.isExpanding || this.el.open ){
			this.shrink();
		}
	}

	shrink() {
		this.isClosing = true;
		const startHeight = `${this.el.offsetHeight}px`;
		const endHeight = `${this.summary.offsetHeight}px`;
		if (this.animation) {
			this.animation.cancel();
		}
		
		this.animation = this.el.animate({
			height: [startHeight, endHeight]
		}, {
			duration: 400,
			easing: 'ease-out'
		});
		this.animation.onfinish = () => this.onAnimationFinish(false);
		this.animation.oncancel = () => this.isClosing = false;
	}

	open() {
		this.el.style.height = `${this.el.offsetHeight}px`;
		this.el.open = true;
		window.requestAnimationFrame(() => this.expand());
	}
	
	expand() {
		this.isExpanding = true;
		const startHeight = `${this.el.offsetHeight}px`;
		const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;

		if( this.animation ){
			this.animation.cancel();
		}
		this.animation = this.el.animate({
			height: [startHeight, endHeight]
		}, {
			duration: 400,
			easing: 'ease-out'
		});
		this.animation.onfinish = () => this.onAnimationFinish(true);
		this.animation.oncancel = () => this.isExpanding = false;
	}

	onAnimationFinish(open) {
		this.el.open = open;
		this.animation = null;
		this.isClosing = false;
		this.isExpanding = false;
		this.el.style.height = '';
	}
}
document.querySelectorAll('form.cgkit-swatch-form details').forEach((el) => {
	new CgkitAccordion(el);
});
