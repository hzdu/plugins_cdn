/**
 * Resources
 * https://github.com/InteractiveAdvertisingBureau/iabtcf-es
 * */
import {CmpApi} from '@iabtcf/cmpapi';
import {TCModel, TCString, GVL, Segment} from '@iabtcf/core';
import UsprivacyString from '../ccpa/src/uspapi.js';
const cmplzCMP = 332;
const cmplzCMPVersion = 1;
const cmplzIsServiceSpecific = cmplz_tcf.isServiceSpecific == 1 ? true : false;
const cmplzExistingLanguages = ['bg', 'ca', 'cs', 'da', 'de', 'el', 'es', 'et', 'fi', 'fr', 'hr', 'hu', 'it', 'ja', 'lt', 'lv', 'mt', 'nl', 'no', 'pl', 'pt', 'ro', 'ru', 'sk', 'sl', 'sr', 'sv', 'tr', 'zh',];
var langCount = cmplzExistingLanguages.length;
let cmplz_html_lang_attr =  document.documentElement.lang.length ? document.documentElement.lang.toLowerCase() : 'en';
let cmplzLanguage = 'en';
for (var i = 0; i < langCount; i++) {
	var cmplzLocale = cmplzExistingLanguages[i];
	if (cmplz_html_lang_attr.indexOf(cmplzLocale)!=-1) {
		cmplzLanguage = cmplzLocale
	}
}
let cmplzLanguageJson;

let onOptOutPolicyPage = document.getElementById('cmplz-tcf-us-vendor-container') !== null;
let onOptInPolicyPage = document.getElementById('cmplz-tcf-vendor-container') !== null;
/**
 * initialize the __tcfapi function and post message
 * https://github.com/InteractiveAdvertisingBureau/iabtcf-es/tree/master/modules/stub
 */

let purposesUrl = cmplz_tcf.cmp_url+'cmp/vendorlist'+'/purposes-'+cmplzLanguage+'.json';
if (!cmplzExistingLanguages.includes(cmplzLanguage)) {
	cmplzLanguage = 'en';
	purposesUrl = cmplz_tcf.cmp_url + 'cmp/vendorlist' + '/vendor-list.json';
}

/**
 * Create an element
 * @param el
 * @param content
 * @returns {*}
 */
function create_element(el, content) {
	let obj = document.createElement(el);
	obj.innerHtml = content;
	return obj;
}

/**
 * Get a cookie by name
 * @param name
 * @returns {string}
 */

function cmplz_tcf_get_cookie(name) {
	if (typeof document === 'undefined') {
		return '';
	}
	name = cmplz_tcf.prefix+name + "=";
	let cArr = document.cookie.split(';');
	for (let i = 0; i < cArr.length; i++) {
		let c = cArr[i].trim();
		if (c.indexOf(name) == 0)
			return c.substring(name.length, c.length);
	}

	return "";
}

/**
 * Add an event
 * @param event
 * @param selector
 * @param callback
 * @param context
 */
function cmplz_tcf_add_event(event, selector, callback, context) {
	document.addEventListener(event, e => {
		if ( e.target.closest(selector) ) {
			callback(e);
		}
	});
}

/**
 * Check if the element is hidden
 * @param el
 * @returns {boolean}
 */
function is_hidden(el) {
	return (el.offsetParent === null)
}

var bannerDataLoadedResolve;
var tcModelLoadedResolve;
var tcfLanguageLoadedResolve;
var bannerLoadedResolve;
var revokeResolve;
var bannerDataLoaded = new Promise(function(resolve, reject){
	bannerDataLoadedResolve = resolve;
});
var tcModelLoaded = new Promise(function(resolve, reject){
	tcModelLoadedResolve = resolve;
});
var tcfLanguageLoaded = new Promise(function(resolve, reject){
	tcfLanguageLoadedResolve = resolve;
});
var bannerLoaded = new Promise(function(resolve, reject){
	bannerLoadedResolve = resolve;
});
var revoke = new Promise(function(resolve, reject){
	revokeResolve = resolve;
});

fetch(purposesUrl, {
	method: "GET",
}).then(response => response.json())
	.then(
		function (data) {
			cmplzLanguageJson = data;
			tcfLanguageLoadedResolve();
		}
	);

document.addEventListener('wp_consent_type_defined', function (e) {
	bannerDataLoadedResolve();
});
document.addEventListener('cmplz_cookie_warning_loaded', function (e) {
	if ( !complianz.disable_cookiebanner) {
		bannerLoadedResolve();
	}
});
document.addEventListener('cmplz_revoke', function (e) {
	const reload = e.detail;
	revokeResolve(reload);
});

bannerDataLoaded.then(()=>{

});

tcfLanguageLoaded.then(()=>{
	GVL.baseUrl = cmplz_tcf.cmp_url + "cmp/vendorlist";
	let gvl = new GVL(cmplzLanguageJson);
	let sourceGvl = gvl.clone();
	let tcModel = new TCModel(gvl);
	tcModel.publisherCountryCode = cmplz_tcf.publisherCountryCode;
	tcModel.version = 2;
	tcModel.cmpId = cmplzCMP;
	tcModel.cmpVersion = cmplzCMPVersion;
	tcModel.isServiceSpecific = cmplzIsServiceSpecific;
	tcModel.UseNonStandardStacks = 0; //A CMP that services multiple publishers sets this value to 0
	const cmpApi = new CmpApi(cmplzCMP, cmplzCMPVersion, cmplzIsServiceSpecific);//Whether the signals encoded in this TC String were from service-specific storage (true) versus ‘global’ consensu.org shared storage (false).
	const storedTCString = cmplzGetTCString();

	/**
	 * After banner data is fully loaded
	 */

	tcModel.gvl.readyPromise.then(() => {
		const json = tcModel.gvl.getJson();
		let vendors = json.vendors;
		let vendorIds = cmplzFilterVendors(vendors);
		tcModel.gvl.narrowVendorsTo(vendorIds);
		//update model with given consents
		try {
			tcModel = TCString.decode(storedTCString, tcModel);
		} catch (err) {}

		tcModelLoadedResolve();
	});

	Promise.all([bannerDataLoaded, tcModelLoaded]).then(()=> {
		insertVendorsInPolicy(tcModel.gvl.vendors);
		if (complianz.consenttype === 'optin'){
			if (cmplz_tcf.debug) console.log(tcModel);
			var date = new Date();
			/**
			 * If the TC String was created over a year ago, we clear it.
			 */
			if (Date.parse(tcModel.created) < date.getTime() - 365 * 24 * 60 * 60 * 1000) {
				cmplzSetTCString(null, cmplzUIVisible() );
			} else {
				cmplzSetTCString(tcModel, cmplzUIVisible() );
			}
		} else {
			if (cmplz_tcf.debug) console.log("not an optin tcf region");
			cmplzSetTCString(null, false );
		}
	});

	Promise.all([bannerLoaded, tcModelLoaded, tcfLanguageLoaded]).then(()=> {
		configureOptinBanner();
	});

	revoke.then(reload => {
		if (cmplz_is_tcf_region(complianz.region)) {
			revokeAllVendors(reload);
		}
	});

	/**
	 * When the marketing is accepted, make sure all vendors are allowed
	 */

	document.addEventListener("cmplz_fire_categories", function (e) {
		//skip if not gdpr
		if (complianz.consenttype !== 'optin') {
			return;
		}
		if (cmplz_in_array('marketing', e.detail.categories)) {
			acceptAllVendors();
		}
	});

	/**
	 * Accept all vendors
	 */
	function acceptAllVendors() {
		cmplzSetAllVendorLegitimateInterests();
		tcModel.setAllPurposeLegitimateInterests();
		for (var key in cmplz_tcf.purposes) {
			tcModel.purposeConsents.set(cmplz_tcf.purposes[key]);
			cmplzSetTypeByVendor('purpose_legitimate_interest', cmplz_tcf.purposes[key]);
		}

		tcModel.setAllSpecialFeatureOptins()
		for (var key in cmplz_tcf.specialFeatures) {
			tcModel.specialFeatureOptins.set(cmplz_tcf.specialFeatures[key]);
			cmplzSetTypeByVendor('specialfeature', cmplz_tcf.specialFeatures[key]);
		}

		tcModel.setAllPurposeConsents();
		for (var key in cmplz_tcf.purposes) {
			tcModel.purposeConsents.set(cmplz_tcf.purposes[key]);
			cmplzSetTypeByVendor('purpose_consent', cmplz_tcf.purposes[key]);
		}

		tcModel.setAllVendorConsents();
		document.querySelectorAll('.cmplz-tcf-input').forEach(checkbox => {
			checkbox.checked = true;
		});

		cmplzSetTCString(tcModel, cmplzUIVisible() );
		cmplz_set_cookie('banner-status', 'dismissed');
	}

	/**
	 * Revoke all vendors
	 * @param reload
	 */
	function revokeAllVendors(reload) {
		//legint should be handled by right to object checkbox in vendor overview.
		// tcModel.unsetAllVendorLegitimateInterests();
		tcModel.unsetAllPurposeLegitimateInterests();

		cmplzUnsetAllVendorLegitimateInterests();
		for (var key in cmplz_tcf.specialFeatures) {
			tcModel.specialFeatureOptins.set(cmplz_tcf.specialFeatures[key]);
			cmplzUnsetTypeByVendor('specialfeature', cmplz_tcf.specialFeatures[key]);
		}

		for (var key in cmplz_tcf.purposes) {
			tcModel.purposeConsents.set(cmplz_tcf.purposes[key]);
			cmplzUnsetTypeByVendor('purpose_consent', cmplz_tcf.purposes[key]);
		}

		tcModel.unsetAllVendorConsents();
		document.querySelectorAll('.cmplz-tcf-input').forEach(checkbox => {
			if (!checkbox.disabled) checkbox.checked = false;
		});

		cmplzSetTCString(tcModel, cmplzUIVisible() );
		cmplz_set_cookie('banner-status', 'dismissed');
		if (reload) {
			location.reload();
		}
	}

	/**
	 * Set all legitimate interests, except when a vendor does not have legints or special purposes.
	 */
	function cmplzSetAllVendorLegitimateInterests() {
		tcModel.setAllVendorLegitimateInterests();
		for (var key in tcModel.gvl.vendors) {
			var vendor = tcModel.gvl.vendors[key];
			/**
			 * no legint, and no special purposes, set legint signal to 0.
			 */
			if (vendor.legIntPurposes.length == 0 && vendor.specialPurposes.length == 0) {
				tcModel.vendorLegitimateInterests.unset(vendor.id);
			}
		}
	}

	/**
	 * Set all purpose legint that are currently used
	 */
	function cmplzSetAllPurposeLegitimateInterests() {
		const purposes = cmplzIABfilterArray(cmplzLanguageJson.purposes, cmplz_tcf.purposes);
		for (var key in purposes) {
			const purpose = purposes[key];
			tcModel.purposeLegitimateInterests.set(purpose.id);
		}
	}

	/**
	 * UnSet all legitimate interests, except when a vendor does not have legints or special purposes.
	 */
	function cmplzUnsetAllVendorLegitimateInterests() {
		tcModel.unsetAllVendorLegitimateInterests();
		for (var key in tcModel.gvl.vendors) {
			var vendor = tcModel.gvl.vendors[key];
			/**
			 * If a vendor only has special purposes, and no other purposes, there's no right to object.
			 */
			if (vendor.legIntPurposes.length == 0 && vendor.purposes.length == 0 && vendor.flexiblePurposes.length == 0 && vendor.specialFeatures.length == 0 && vendor.specialPurposes.length != 0) {
				tcModel.vendorLegitimateInterests.set(vendor.id);
			}
		}
	}

	/**
	 * If a purpose has been selected/deselected, we need to re-check for al vendors if this has consenquences for legint
	 */
	function cmplzUpdateAllVendorLegitimateInterests() {
		for (var key in tcModel.gvl.vendors) {
			var vendor = tcModel.gvl.vendors[key];

			/**
			 * no legint, and no special purposes, set legint signal to 0.
			 */
			if (vendor.legIntPurposes.length == 0 && vendor.specialPurposes.length == 0) {
				tcModel.vendorLegitimateInterests.unset(vendor.id);
			}

			if (vendor.legIntPurposes.length == 0 && vendor.purposes.length == 0 && vendor.flexiblePurposes.length == 0 && vendor.specialFeatures.length == 0 && vendor.specialPurposes.length != 0) {
				tcModel.vendorLegitimateInterests.set(vendor.id);
			}
		}
	}

	/**
	 * We use this method to keep track of consents per vendor. This is not stored in the core tcString
	 *
	 * @param type
	 * @param typeId
	 */
	function cmplzSetTypeByVendor(type, typeId) {
		if (type === 'purpose_consent') {
			tcModel.purposeConsents.set(typeId);
			for (var key in tcModel.gvl.vendors) {
				var vendor = tcModel.gvl.vendors[key];
				if (sourceGvl.vendors[vendor.id].purposes.includes(typeId) && !vendor.purposes.includes(typeId)) {
					tcModel.gvl.vendors[vendor.id].purposes.push(typeId);
				}
			}
		}

		if (type === 'purpose_legitimate_interest') {
			tcModel.purposeLegitimateInterests.set(typeId);
			for (var key in tcModel.gvl.vendors) {
				var vendor = tcModel.gvl.vendors[key];
				if (sourceGvl.vendors[vendor.id].purposes.includes(typeId) && !vendor.purposes.includes(typeId)) {
					tcModel.gvl.vendors[vendor.id].purposes.push(typeId);
				}
			}
		}

		if (type === 'specialfeature') {
			tcModel.specialFeatureOptins.set(typeId);
			for (var key in tcModel.gvl.vendors) {
				var vendor = tcModel.gvl.vendors[key];
				if (sourceGvl.vendors[vendor.id].specialFeatures.includes(typeId) && !vendor.specialFeatures.includes(typeId)) {
					tcModel.gvl.vendors[vendor.id].specialFeatures.push(typeId);
				}
			}
		}

		if (type === 'feature') {
			for (var key in tcModel.gvl.vendors) {
				var vendor = tcModel.gvl.vendors[key];
				if (sourceGvl.vendors[vendor.id].features.includes(typeId) && !vendor.features.includes(typeId)) {
					tcModel.gvl.vendors[vendor.id].features.push(typeId);
				}
			}
		}
	}

	function cmplzUnsetTypeByVendor(type, typeId) {
		if (type === 'purpose_consent') {
			tcModel.purposeConsents.unset(typeId);
			for (var key in tcModel.gvl.vendors) {
				var vendor = tcModel.gvl.vendors[key];
				let index = vendor.purposes.indexOf(typeId);
				if (index > -1) {
					tcModel.gvl.vendors[vendor.id].purposes.splice(index, 1);
				}
			}
		}

		if (type === 'purpose_legitimate_interest') {
			tcModel.purposeLegitimateInterests.unset(typeId);
			for (var key in tcModel.gvl.vendors) {
				var vendor = tcModel.gvl.vendors[key];
				let index = vendor.legIntPurposes.indexOf(typeId);
				if (index > -1) {
					tcModel.gvl.vendors[vendor.id].legIntPurposes.splice(index, 1);
				}
			}
		}

		if (type === 'specialfeature') {
			tcModel.specialFeatureOptins.unset(typeId);
			for (var key in tcModel.gvl.vendors) {
				var vendor = tcModel.gvl.vendors[key];
				const index = vendor.specialFeatures.indexOf(typeId);
				if (index > -1) {
					tcModel.gvl.vendors[vendor.id].specialFeatures.splice(index, 1);
				}
			}
		}

		if (type === 'feature') {
			for (var key in tcModel.gvl.vendors) {
				var vendor = tcModel.gvl.vendors[key];
				const index = vendor.features.indexOf(typeId);
				if (index > -1) {
					tcModel.gvl.vendors[vendor.id].features.splice(index, 1);
				}
			}
		}
	}

	/**
	 * When revoke button is clicked, so banner shows again
	 *
	 */

	cmplz_tcf_add_event('click', '.cmplz-manage-consent', function () {
		const storedTCString = cmplzGetTCString();
		cmpApi.update(storedTCString, true);  //just got the banner to show again, so we have to pass ui visible true
	});

	/**
	 * Create a checkbox, clickable
	 * @param type
	 * @param object
	 * @param container
	 * @param checked
	 * @param disabled
	 */
	function cmplzRenderCheckbox(type, object, container, checked, disabled) {
		let template = document.getElementById('cmplz-tcf-type-template').innerHTML;
		let description = object.descriptionLegal;
		const descArr = description.split('*');
		let header = descArr[0];
		descArr.splice(0, 1);
		description = header + '<ul><li>' + descArr.join('</li><li>') + '</li></ul>';
		template = template.replace(/{type_name}/g, object.name);
		template = template.replace(/{type_description}/g, description);
		template = template.replace(/{type_id}/g, object.id);
		template = template.replace(/{type}/g, type);

		const wrapper = document.createElement('div');
		wrapper.innerHTML = template;
		const checkbox = wrapper.firstChild;
		checkbox.querySelector('.cmplz-tcf-' + type + '-input').checked = checked;
		checkbox.querySelector('.cmplz-tcf-' + type + '-input').disabled = disabled;

		checkbox.querySelector('.cmplz-tcf-' + type + '-input').setAttribute('data-' + type + '_id', object.id);
		var fragment = document.createDocumentFragment();
		fragment.appendChild(checkbox);
		container.appendChild(checkbox);
	}

	/**
	 * Generate entire block of checkboxes with event listener
	 * @param type
	 * @param objects
	 * @param filterBy
	 */

	function generateTypeBlock(type, objects, filterBy) {
		let containerid = type;
		let srcPurposes;
		if (filterBy !== false) {
			containerid = filterBy + '-' + containerid;
			srcPurposes = cmplzGetPurposes(filterBy, false);
		}

		const container = document.getElementById('cmplz-tcf-' + containerid + 's-container');
		if (container === null) {
			return;
		}

		container.innerHTML = '';
		for (var key in objects) {
			if (objects.hasOwnProperty(key)) {
				const object = objects[key];
				let addItem = true;
				if (filterBy) {
					if (!srcPurposes.includes(object.id)) {
						addItem = false;
					}
				}

				if (addItem) {
					const object = objects[key];
					let checked = false;
					let disabled = false;
					if (type === 'purpose_consent') {
						checked = tcModel.purposeConsents.has(object.id);
					}
					if (type === 'purpose_legitimate_interest') {
						checked = tcModel.purposeLegitimateInterests.has(object.id);
					}
					if (type === 'specialfeature') {
						checked = tcModel.specialFeatureOptins.has(object.id);
					}
					if (type === 'feature') {
						checked = true;
						disabled = true;
					}
					if (type === 'specialpurpose') {
						checked = true;
						disabled = true;
					}

					cmplzRenderCheckbox(type, object, container, checked, disabled);
				}
			}
		}

		//add event listener
		cmplz_tcf_add_event("click", '.cmplz-tcf-' + type + '-input', function (e) {
			let obj = e.target;
			const typeId = parseInt(obj.getAttribute('data-'+type + '_id'));
			if (obj.checked) {
				//set all of this id to checked
				document.querySelectorAll('[data-' + type + '_id="' + typeId + '"]').forEach(obj => {
					obj.checked = true;
				});
				if (type === 'purpose_consent') {
					tcModel.purposeConsents.set(typeId);
				}
				if (type === 'purpose_legitimate_interest') {
					tcModel.purposeLegitimateInterests.set(typeId);
				}
				if (type === 'specialfeature') {
					tcModel.specialFeatureOptins.set(typeId);
				}
				cmplzSetTypeByVendor(type, typeId);
			} else {
				//set all of this id to unchecked
				document.querySelectorAll('[data-' + type + '_id="' + typeId + '"]').forEach(obj => {
					obj.checked = false;
				});
				if (type === 'purpose_consent') {
					tcModel.purposeConsents.unset(typeId);
				}
				if (type === 'purpose_legitimate_interest') {
					tcModel.purposeLegitimateInterests.unset(typeId);
				}
				if (type === 'specialfeature') {
					tcModel.specialFeatureOptins.unset(typeId);
				}
				cmplzUnsetTypeByVendor(type, typeId);
			}
			cmplzUpdateAllVendorLegitimateInterests();
			cmplzSetTCString(tcModel, true);
		});


		cmplz_tcf_add_event("click", '.cmplz-tcf-toggle', function (e) {
			let obj = e.target;

			e.preventDefault();
			let label = obj.closest('label');
			let description = label.querySelector('.cmplz-tcf-type-description');

			if ( is_hidden(description) ) {
				obj.classList.add('cmplz-tcf-rl');
				obj.classList.remove('cmplz-tcf-rm');
				description.style.display = 'block';
			} else {
				obj.classList.add('cmplz-tcf-rm');
				obj.classList.remove('cmplz-tcf-rl');
				description.style.display = 'none';
			}
		});
	}

	function cmplzUIVisible() {
		let bannerVisible = true;
		const bannerStatus = cmplz_tcf_get_cookie('banner-status');
		if (bannerStatus === 'dismissed') {
			bannerVisible = false;
		}

		const policyVisible = document.getElementById('cmplz-tcf-vendor-container') !== null;
		return bannerVisible || policyVisible;
	}

	/**
	 * Create a list of checkable vendors in the cookie policy
	 * @param vendors
	 */

	function insertVendorsInPolicy(vendors) {
		const vendorContainer = document.getElementById('cmplz-tcf-vendor-container');
		if (vendorContainer === null) {
			return;
		}

		vendorContainer.innerHTML = '';
		const template = document.getElementById('cmplz-tcf-vendor-template').innerHTML;
		const purposes = cmplzIABfilterArray(cmplzLanguageJson.purposes, cmplz_tcf.purposes);
		const specialPurposes = cmplzIABfilterArray(cmplzLanguageJson.specialPurposes, cmplz_tcf.specialPurposes);
		const features = cmplzIABfilterArray(cmplzLanguageJson.features, cmplz_tcf.features);
		const specialFeatures = cmplzIABfilterArray(cmplzLanguageJson.specialFeatures, cmplz_tcf.specialFeatures);
		generateTypeBlock('purpose_consent', purposes, 'statistics');
		generateTypeBlock('purpose_consent', purposes, 'marketing');
		generateTypeBlock('purpose_legitimate_interest', purposes, 'statistics');
		generateTypeBlock('purpose_legitimate_interest', purposes, 'marketing');
		generateTypeBlock('feature', features, false);
		generateTypeBlock('specialpurpose', specialPurposes, false);
		generateTypeBlock('specialfeature', specialFeatures, false);

		if (specialFeatures.length == 0) {
			document.getElementById('cmplz-tcf-specialfeatures-wrapper').style.display = 'none';
		}
		for (var key in vendors) {
			if (vendors.hasOwnProperty(key)) {
				let customTemplate = template;
				const vendor = vendors[key];
				const vendorPurposes = vendor.purposes + vendor.legIntPurposes;
				let purposeString = '';
				for (var p_key in vendorPurposes) {
					if (vendorPurposes.hasOwnProperty(p_key)) {
						let purposeName = false;
						for (var src_p_key in purposes) {
							if (purposes.hasOwnProperty(src_p_key)) {
								if (purposes[src_p_key].id == vendorPurposes[p_key]) {
									purposeName = purposes[src_p_key].name;
								}
							}
						}
						if (purposeName) {
							const purposeLink = 'https://cookiedatabase.org/tcf/' + purposeName.replace(/ /g, '-').replace(/\//g, '-').toLowerCase();
							purposeString += '<div class="cmplz-tcf-purpose"><a href="' + purposeLink + '" target="_blank" rel="noopener noreferrer nofollow">' + purposeName + '</a></div>';
						}
					}
				}

				var retentionInDays = Math.round(vendor.cookieMaxAgeSeconds / (60 * 60 * 24));
				//if result is 0, get day in decimals.
				customTemplate = customTemplate.replace(/{cookie_retention_seconds}/g, vendor.cookieMaxAgeSeconds);
				customTemplate = customTemplate.replace(/{cookie_retention_days}/g, retentionInDays);
				customTemplate = customTemplate.replace(/{vendor_name}/g, vendor.name);
				customTemplate = customTemplate.replace(/{vendor_id}/g, vendor.id);
				customTemplate = customTemplate.replace(/{purposes}/g, purposeString);
				customTemplate = customTemplate.replace(/{privacy_policy}/g, vendor.policyUrl);

				const wrapper = document.createElement('div');
				wrapper.innerHTML = customTemplate;
				const checkbox = wrapper.firstChild;
				checkbox.querySelector('.cmplz-tcf-vendor-input').checked = tcModel.vendorConsents.has(vendor.id) || tcModel.vendorLegitimateInterests.has(vendor.id);
				checkbox.querySelector('.cmplz-tcf-vendor-input').setAttribute('data-vendor_id', vendor.id);

				//set consent
				checkbox.querySelector('.cmplz-tcf-consent-input').checked = tcModel.vendorConsents.has(vendor.id);
				checkbox.querySelector('.cmplz-tcf-consent-input').setAttribute('data-vendor_id', vendor.id);

				//show legint option if vendor has legintpurposes
				if (vendor.legIntPurposes.length != 0) {
					checkbox.querySelector('.cmplz_tcf_legitimate_interest_checkbox').style.display = 'block';
					checkbox.querySelector('.cmplz-tcf-legitimate-interest-input').setAttribute('data-vendor_id', vendor.id);
					checkbox.querySelector('.cmplz-tcf-legitimate-interest-input').checked = tcModel.vendorLegitimateInterests.has(vendor.id);
				}

				//handle non cookie access
				if (vendor.usesNonCookieAccess) {
					wrapper.querySelector('.non-cookie-storage-active').style.display = 'block';
				} else {
					wrapper.querySelector('.non-cookie-storage-inactive').style.display = 'block';
				}

				if (vendor.cookieRefresh) {
					wrapper.querySelector('.non-cookie-refresh-active').style.display = 'block';
				} else {
					wrapper.querySelector('.non-cookie-refresh-inactive').style.display = 'block';
				}

				if (vendor.cookieMaxAgeSeconds <= 0) {
					wrapper.querySelector('.session-storage').style.display = 'block';
				} else if (vendor.cookieMaxAgeSeconds <= 60 * 60 * 24) {
					wrapper.querySelector('.retention_seconds').style.display = 'block';
				} else {
					wrapper.querySelector('.retention_days').style.display = 'block';
				}

				var fragment = document.createDocumentFragment();
				fragment.appendChild(checkbox);
				vendorContainer.appendChild(checkbox);
			}
		}

		cmplz_tcf_add_event("click", '.cmplz-tcf-legitimate-interest-input', function (e) {
			let obj = e.target;
			const vendorId = parseInt(obj.getAttribute('data-vendor_id'));
			if ( obj.checked ) {
				tcModel.vendorLegitimateInterests.set(vendorId);
				let container = obj.closest('.cmplz-tcf-vendor-container');
				container.querySelector('.cmplz-tcf-vendor-input').checked = true;
			} else {
				tcModel.vendorLegitimateInterests.unset(vendorId);
			}
			cmplzSetTCString(tcModel, true);
			cmplz_set_cookie('banner-status', 'dismissed');
		});

		cmplz_tcf_add_event("click", '.cmplz-tcf-consent-input', function (e) {
			let obj = e.target;
			const vendorId = parseInt(obj.getAttribute('data-vendor_id'));
			if ( obj.checked ) {
				tcModel.vendorConsents.set(vendorId);
				let container = obj.closest('.cmplz-tcf-vendor-container');
				container.querySelector('.cmplz-tcf-vendor-input' ).prop('checked', true);
			} else {
				tcModel.vendorConsents.unset(vendorId);
			}
			//now we update the tcstring
			cmplzSetTCString(tcModel, true);
			cmplz_set_cookie('banner-status', 'dismissed');
		});

		cmplz_tcf_add_event("click", '.cmplz-tcf-vendor-input', function (e) {
			let obj = e.target;
			const vendorId = parseInt(obj.getAttribute('data-vendor_id'));
			let container = obj.closest('.cmplz-tcf-vendor-container');
			if (obj.checked) {
				tcModel.vendorConsents.set(vendorId);
				//positive leg int should not be set.
				tcModel.vendorLegitimateInterests.set(vendorId);
				container.querySelector('.cmplz-tcf-legitimate-interest-input' ).checked = true;
				container.querySelector('.cmplz-tcf-consent-input' ).checked = true;
			} else {
				tcModel.vendorConsents.unset(vendorId);
				tcModel.vendorLegitimateInterests.unset(vendorId);
				container.querySelector('.cmplz-tcf-legitimate-interest-input').checked = false;
				container.querySelector('.cmplz-tcf-consent-input').checked = false;
			}
			cmplzSetTCString(tcModel, true);
			cmplz_set_cookie('banner-status', 'dismissed');
		});

		cmplz_tcf_add_event("click", '.cmplz-tcf-toggle-info', function (e) {
			let obj = e.target;
			e.preventDefault();
			if ( is_hidden() ) {
				obj.style.display = 'block';
			} else {
				obj.style.display = 'none';
			}
		});

		cmplz_tcf_add_event("click", '.cmplz-tcf-toggle-vendor', function (e) {
			let obj = e.target;
			e.preventDefault();
			const container = obj.closest('.cmplz-tcf-vendor-container');
			const info = container.querySelector('.cmplz-tcf-info');
			if ( is_hidden(info) ) {
				obj.classList.add('cmplz-tcf-rl');
				obj.classList.remove('cmplz-tcf-rm');
				info.style.display = 'block';
			} else {
				obj.classList.add('cmplz-tcf-rm');
				obj.classList.remove('cmplz-tcf-rl');
				info.style.display = 'none';
			}
		});

		cmplz_tcf_add_event("click", "#cmplz-tcf-selectall", function () {
			for (var key in vendors) {
				if (vendors.hasOwnProperty(key)) {
					const vendor = vendors[key];
					tcModel.vendorConsents.set(vendor.id);
					document.querySelector('#cmplz-tcf-' + vendor.id).checked = true;
				}
			}
			const vendorCheckboxes = document.querySelectorAll('[data-vendor_id]');
			vendorCheckboxes.forEach(vendorCheckbox => {
				vendorCheckbox.checked = true;
			});
			acceptAllVendors();
		});

		cmplz_tcf_add_event("click", "#cmplz-tcf-deselectall", function () {
			for (var key in vendors) {
				if (vendors.hasOwnProperty(key)) {
					const vendor = vendors[key];
					tcModel.vendorConsents.unset(vendor.id);
					document.querySelector('#cmplz-tcf-' + vendor.id).checked = false;
				}
			}
			revokeAllVendors(true);
		});
		let event = new CustomEvent('cmplz_vendor_container_loaded', {detail: complianz.region});
		document.dispatchEvent(event);
	}


	/**
	 * Filter the list of vendors
	 *
	 * @param vendors
	 * @returns {*}
	 */
	function cmplzFilterVendors(vendors) {
		let vendorIds = [];
		for (var key in vendors) {
			if (vendors.hasOwnProperty(key)) {
				const vendor = vendors[key];
				// if (vendor.id==755 || vendor.legIntPurposes.length==0){
					vendorIds.push(vendor.id);
				// }
			}
		}
		let addVendorIds = cmplzFilterVendorsBy('purposes', vendors, cmplz_tcf.purposes);
		vendorIds = vendorIds.filter(value => addVendorIds.includes(value));

		addVendorIds = cmplzFilterVendorsBy('specialPurposes', vendors, cmplz_tcf.specialPurposes);
		vendorIds = vendorIds.filter(value => addVendorIds.includes(value));

		addVendorIds = cmplzFilterVendorsBy('features', vendors, cmplz_tcf.features);
		vendorIds = vendorIds.filter(value => addVendorIds.includes(value));

		addVendorIds = cmplzFilterVendorsBy('specialFeatures', vendors, cmplz_tcf.specialFeatures);
		vendorIds = vendorIds.filter(value => addVendorIds.includes(value));
		return vendorIds;
	}


	/**
	 * Get vendors who only have one of these purposes
	 * @param vendors
	 * @param category_purposes
	 * @returns {[]}
	 */
	function cmplzFilterVendorsBy(type, vendors, category_purposes) {
		let output = [];
		for (var key in vendors) {
			if (vendors.hasOwnProperty(key)) {
				const vendor = vendors[key];
				//for each vendor purpose, check if it exists in the category purposes list. If not, don't add this vendor
				let allPurposesAreCategoryPurpose = true;
				const vendorProperties = vendor[type];
				for (var p_key in vendorProperties) {
					if (vendorProperties.hasOwnProperty(p_key)) {
						const purpose = vendorProperties[p_key];

						const inPurposeArray = category_purposes.includes(purpose);
						if (!inPurposeArray) {
							allPurposesAreCategoryPurpose = false;
						}
					}
				}
				const inOutPutArray = output.includes(vendor.id);
				if (!inOutPutArray && allPurposesAreCategoryPurpose) {
					output.push(vendor.id);
				}
			}
		}
		return output;
	}

	/**
	 * Get thet TC String
	 * @returns {string}
	 */
	function cmplzGetTCString() {
		let user_policy_id = cmplz_tcf_get_cookie('policy_id');
		if ( !user_policy_id || complianz.current_policy_id !== user_policy_id  ) {
			if (localStorage.cmplz_tcf_consent) localStorage.removeItem('cmplz_tcf_consent');
		}
		return window.localStorage.getItem('cmplz_tcf_consent');
	}

	/**
	 * Set the tcstring, and update the api if needed
	 * @param tcModel
	 * @param uiVisible
	 */
	function cmplzSetTCString( tcModel, uiVisible ) {
		let encodedTCString = null;
		tcModel.created = cmplzRemoveTime(tcModel.lastUpdated);
		tcModel.lastUpdated = cmplzRemoveTime(tcModel.lastUpdated);
		if ( tcModel ) {
			encodedTCString = TCString.encode(tcModel);
			cmpApi.update(encodedTCString, uiVisible);
		}

		window.localStorage.setItem('cmplz_tcf_consent', encodedTCString);
	}

	/**
	 * Ensure the date does not contain hours or minutes
	 * @param date
	 * @returns {Date}
	 */

	function cmplzRemoveTime(date) {
		return new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate()
		);
	}

	/**
	 * Get list of purposes
	 * @param category
	 * @param includeLowerCategories
	 * @returns {*[]|number[]}
	 */
	function cmplzGetPurposes(category, includeLowerCategories) {
		//these categories aren't used
		if (category === 'functional' || category === 'preferences') {
			return [];
		}

		if (category === 'marketing') {
			if (includeLowerCategories) {
				return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
			} else {
				return [1, 2, 3, 4, 5, 6, 10];
			}
		} else if (category === 'statistics') {
			return [1, 7, 8, 9];
		}
	}

	/**
	 * Check if a region is a TCF region
	 * @param region
	 * @returns {boolean}
	 */
	function cmplz_is_tcf_region(region) {
		if (cmplz_in_array(region, complianz.tcf_regions)) {
			return true;
		}
		return false;
	}

	function configureOptinBanner() {
		//don't do this for non TCF regions
		if (!cmplz_is_tcf_region(complianz.region)) {
			return;
		}

		/**
		 * Filter purposes based on passed purposes
		 */
		//only optin variant of tcf has these purposes on the banner.
		if ( complianz.consenttype === 'optin' ) {
			const srcMarketingPurposes = cmplzGetPurposes('marketing', false);
			const srcStatisticsPurposes = cmplzGetPurposes('statistics', false);
			const marketingPurposes = cmplzIABfilterArray(cmplzIABfilterArray(cmplzLanguageJson.purposes, cmplz_tcf.purposes), srcMarketingPurposes);
			const statisticsPurposes = cmplzIABfilterArray(cmplzIABfilterArray(cmplzLanguageJson.purposes, cmplz_tcf.purposes), srcStatisticsPurposes);
			const features = cmplzIABfilterArray(cmplzLanguageJson.features, cmplz_tcf.features);
			const specialPurposes = cmplzIABfilterArray(cmplzLanguageJson.specialPurposes, cmplz_tcf.specialPurposes);
			const specialFeatures = cmplzIABfilterArray(cmplzLanguageJson.specialFeatures, cmplz_tcf.specialFeatures);

			const marketingPurposesContainer = document.querySelector('.cmplz-tcf .cmplz-marketing .cmplz-description');
			const statisticsPurposesContainer = document.querySelector('.cmplz-tcf .cmplz-statistics .cmplz-description');
			const featuresContainer = document.querySelector('.cmplz-tcf .cmplz-features .cmplz-description');
			const specialFeaturesContainer = document.querySelector('.cmplz-tcf .cmplz-specialfeatures .cmplz-title');
			const specialPurposesContainer = document.querySelector('.cmplz-tcf .cmplz-specialpurposes .cmplz-title');

			if (features.length === 0) document.querySelector('.cmplz-tcf .cmplz-features').style.display = 'none';
			if (specialPurposes.length === 0) document.querySelector('.cmplz-tcf .cmplz-specialpurposes').style.display = 'none';
			if (specialFeatures.length === 0) document.querySelector('.cmplz-tcf .cmplz-specialfeatures').style.display = 'none';
			if (statisticsPurposes.length === 0) document.querySelector('.cmplz-tcf .cmplz-statistics').style.display = 'none';

			statisticsPurposesContainer.innerHTML = cmplzConcatenateString(statisticsPurposes);
			marketingPurposesContainer.innerHTML = cmplzConcatenateString(marketingPurposes);
			featuresContainer.innerHTML = cmplzConcatenateString(features);
			specialFeaturesContainer.innerHTML = cmplzConcatenateString(specialFeatures);
			specialPurposesContainer.innerHTML = cmplzConcatenateString(specialPurposes);
		}

		//on pageload, show vendorlist area
		let wrapper = document.getElementById('cmplz-tcf-wrapper');
		let noscript_wrapper = document.getElementById('cmplz-tcf-wrapper-nojavascript');
		if ( wrapper ){
			wrapper.style.display = 'block';
			noscript_wrapper.style.display = 'none';
		}
	}

	function cmplzIABfilterArray(arrayToFilter, arrayToFilterBy) {
		let output = [];
		for (var key in arrayToFilter) {
			if (arrayToFilterBy.includes(arrayToFilter[key].id)) {
				output.push(arrayToFilter[key]);
			}
		}
		return output;
	}

	function cmplzConcatenateString(array) {
		let string = '';
		const max = array.length - 1;
		for (var key in array) {
			if (array.hasOwnProperty(key)) {
				string += array[key].name;
				if (key < max) {
					string += ', ';
				} else {
					string += '.';
				}
			}
		}
		return string;
	}

});

/**
 * TCF for CCPA
 */

const USPSTR_NN = "1NN";
const USPSTR_YN = "1YN";
const USPSTR_YY = "1YY";
const USPSTR_NA = "1---";
let ccpaVendorlistLoadedResolve;
var ccpaVendorlistLoaded = new Promise(function(resolve, reject){
	ccpaVendorlistLoadedResolve = resolve;
});
let USvendorlistUrl = cmplz_tcf.cmp_url + 'cmp/vendorlist' + '/lspa.json';
let ccpaVendorList;
bannerDataLoaded.then(()=> {
	if (complianz.consenttype === 'optout' || onOptOutPolicyPage) {
		fetch(USvendorlistUrl, {
			method: "GET",
		}).then(response => response.json())
			.then(
				function (data) {
					ccpaVendorList = data;
					ccpaVendorlistLoadedResolve();
				}
			);
		cmplz_set_ccpa_tc_string();
		cmplzRenderUSVendorsInPolicy();
	} else {
		if (cmplz_tcf.debug) console.log("not an optout tcf region or page");
	}
});

/**
 * When CCPA applies, we set the TC string in the usprivacy cookie
 */
function cmplz_set_ccpa_tc_string() {
	if ( cmplz_tcf.ccpa_applies ) {
		cmplz_set_cookie('usprivacy', USPSTR_YN + cmplz_tcf.lspact, false);
		document.addEventListener("cmplz_fire_categories", function (e) {
			let val = USPSTR_YY + cmplz_tcf.lspact;
			if (cmplz_in_array('marketing', e.detail.categories)) {
				val = USPSTR_YN + cmplz_tcf.lspact;
			}
			cmplz_set_cookie('usprivacy', val);
		});
	} else {
		cmplz_set_cookie('usprivacy', USPSTR_NA + cmplz_tcf.lspact);
	}
}

function cmplzRenderUSVendorsInPolicy() {
	ccpaVendorlistLoaded.then(()=> {
		let vendors = ccpaVendorList.signatories;
		const vendorContainer = document.getElementById('cmplz-tcf-us-vendor-container');

		if (vendorContainer === null) {
			return;
		}
		vendorContainer.innerHTML = '';
		const template = document.getElementById('cmplz-tcf-vendor-template').innerHTML;

		for (var key in vendors) {
			if (vendors.hasOwnProperty(key)) {
				let customTemplate = template;
				let vendor = vendors[key];
				customTemplate = customTemplate.replace(/{vendor_name}/g, vendor.signatoryLegalName);
				let hasOptoutUrl = true;
				if (vendor.optoutUrl.indexOf('http') === -1) {
					hasOptoutUrl = false;
					customTemplate = customTemplate.replace(/{optout_string}/g, vendor.optoutUrl);
				} else {
					customTemplate = customTemplate.replace(/{optout_url}/g, vendor.optoutUrl);
				}

				const wrapper = document.createElement('div');
				wrapper.innerHTML = customTemplate;
				const html = wrapper.firstChild;
				if (hasOptoutUrl) {
					html.querySelector('.cmplz-tcf-optout-string').style.display = 'none';
					html.querySelector('.cmplz-tcf-optout-url').style.display = 'block';

				} else {
					html.querySelector('.cmplz-tcf-optout-string').style.display = 'block';
					html.querySelector('.cmplz-tcf-optout-url').style.display = 'none';
				}
				var fragment = document.createDocumentFragment();
				fragment.appendChild(html);
				vendorContainer.appendChild(html);
			}
		}

		document.querySelector('#cmplz-tcf-wrapper').style.display = 'block'
		document.querySelector('#cmplz-tcf-wrapper-nojavascript').style.display = 'none';
	})
}

/**
 * @todo get a list of ddr.js files. Not currently available
 * https://github.com/InteractiveAdvertisingBureau/USPrivacy/issues/17
 */
// Add all Vendor scripts; this is just an array of string sources
//https://github.com/InteractiveAdvertisingBureau/USPrivacy/blob/master/CCPA/Data%20Deletion%20Request%20Handling.md
// vendorDeleteScriptSources.forEach((vendorDeleteScriptSource) => {
//
// 	const scriptElement = document.createElement("script");
// 	scriptElement.src = vendorDeleteScriptSource;
//
// 	document.body.appendChild(scriptElement);
//
// });

/**
 * Fire a data deletion request.
 */
document.addEventListener("cmplz_dnsmpi_submit", function (e) {
	if (cmplz_tcf.debug) console.log("fire data deletion request for TCF");
	__uspapi('performDeletion', 1);
});
