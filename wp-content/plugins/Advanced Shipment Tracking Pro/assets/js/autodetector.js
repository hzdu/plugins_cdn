jQuery(document).on("blur", "#tracking_number", function(){	
	var arr = [];
	var number = jQuery(this).val().replaceAll(/[^\w\s]/gi, '').replaceAll(" ", "");	
	
	if ( number.match(/\b((420 ?\d{5} ?)?(91|92|93|94|95|01|03|04|70|23|13)\d{2} ?\d{4} ?\d{4} ?\d{4} ?\d{4}( ?\d{2,6})?)\b/i, '')  || number.match(/\b((M|P[A-Z]?|D[C-Z]|LK|E[A-C]|V[A-Z]|R[A-Z]|CP|CJ|LC|LJ) ?\d{3} ?\d{3} ?\d{3} ?[A-Z]?[A-Z]?)\b/i, '')  || number.match(/\b(82 ?\d{3} ?\d{3} ?\d{2})\b/i, '')) {	
		arr = jQuery.merge( arr, [{"usps": "USPS"}] );	
	}
	if ( number.startsWith( 'SD00' ) ){
		arr = jQuery.merge( arr,[{"shipa": "Shipa"}]);
	}
	if ( number.match(/^([28]{2}[0-9]{14})$/, '') ||  number.match(/^([003404343106307]{15}[0-9]{5})$/, '') || number.match(/^([\GM|LX|RX|LW|LY|RS][a-zA-Z0-9]{10,39})$/, '') || number.match(/^([\gm|lx|rx][a-zA-Z0-9]{10,39})$/, '') || number.match(/^(\d{22})$/, '') ){
		arr = jQuery.merge( arr, [{"dhl-ecommerce": "DHL eCommerce"}] );				
	}
	if ( number.match(/^([JJD|3S|JVGL]{2,3,4}[0-9]{14,18})$/, '') || number.match(/^(\d{6}|\d{10}|d{12})$/, '') || number.match(/^([a-zA-Z]{2}[0-9]{9}(DE))$/, '') ){
		arr = jQuery.merge( arr, [{"dhl-parcel": "DHL Parcel"}]);		
	}
	if ( number.match(/^(\d{7})$/, '') || number.match(/^(\d{1}[a-zA-Z]{2}\d{4,6})$/, '') || number.match(/^([a-zA-Z]{3,4}\d{6})$/, '') || number.match(/^(\d{3}-\d{8})$/, '') ){
		arr = jQuery.merge( arr,[{"dhl-express": "DHL Express"}]);	
	}
	
	if ( number.match(/^([a-zA-Z]{2,3}-[a-zA-Z]{2,3}-\d{7})$/, '') || number.match(/^(\d{4}-\d{5})$/, '')  || number.match(/^(\d{10})$/, '') ){
		arr = jQuery.merge( arr,[{"dhl-freight": "DHL Freight"}]);
	}
	if ( number.match(/\b(((96\d\d|6\d)\d{3} ?\d{4}|96\d{2}|\d{4}) ?\d{4} ?\d{4}( ?\d{3})?)\b/i, '')){
		arr = jQuery.merge( arr,[{"fedex": "Fedex"}]);
	}
	if ( number.match(/^(\b1Z[a-zA-Z0-9]{16}\b)$/, '') ||  number.match(/^(\b1z[a-zA-Z0-9]{16}\b)$/, '') ){
		arr = jQuery.merge( arr,[{"ups": "UPS"}]);
	}
	if ( number.match(/^(\d{13})$/, '') || number.match(/^([A-Z]{2}[0-9]+(IN))$/, '') || number.match(/^([a-zA-Z]{2}[0-9]+(in))$/, '') ){
		arr = jQuery.merge( arr,[{"india-post": "India Post"}]);
	}
	if ( number.match(/^(\d{13})$/, '') || number.match(/^([A-Z]{2}[0-9]+(IL))$/, '') || number.match(/^([a-zA-Z]{2}[0-9]+(il))$/, '') ){
		arr = jQuery.merge( arr,[{"israel-post": "Israel Post"}]);
	}
	if ( number.match(/^(d{12})$/, '') || number.match(/^(\b[99]{2}[0-9]{21}\b)$/, '') || number.match(/^(\b[0]{1}[0-9]{22}\b)$/, '') || number.match(/^(\b[UCD]{3}[0-9]{18}\b)$/, '') ){
		arr = jQuery.merge( arr,[{"australia-post": "Australia Post"}]);
	}
	if ( number.match(/^(\d{13})$/, '') || number.match(/^([A-Z]{2}[0-9]+(US)+)$/, '')  || number.match(/^([LY|EV]{2}[0-9]+(CN)+)$/, '') ){
		arr = jQuery.merge( arr,[{"ems": "EMS"}]);
	}
	if ( number.match(/^(\d{3}[a-zA-Z]{2}\d{8})$/, '') || number.match(/^([3A5V]{4}[0-9]{9})$/, '') ){
		arr = jQuery.merge( arr,[{"cne-express": "CNE Express"}]);
	}
	if ( number.match(/^(\d{12,13})$/, '') || number.match(/^([a-zA-Z]{1}\d{12})$/, '') ){
		arr = jQuery.merge( arr,[{"delhivery": "Delhivery"}]);
	}
	if ( number.match(/^(\d{6}|\d{7}|\d{8}|\d{10}|\d{16})$/, '') || number.match(/^([a-zA-Z]{3,4}[0-9]{7})$/, '') ){
		arr = jQuery.merge( arr,[{"dsv": "DSV"}]);
	}
	if ( number.match(/^[YT2]+\d{15}$/, '') ||  number.match(/^[yt]+\d{16}$/, '') ){
		arr = jQuery.merge( arr,[{"yunexpress": "Yun Express Tracking"}]);
	}
	if ( number.match(/^[VR|UR]+\d{9}(YP)+$/, '') || number.match(/^[a-zA-Z]{2}\d{10}[a-zA-Z]{2}$/, '')  || number.match(/^[a-zA-Z]{2}\d{9}[a-zA-Z]{2}$/, '') ||  number.match(/^([UF]{2}[0-9]+(YP))$/, '') ){
		arr = jQuery.merge( arr,[{"yanwen": "Yanwen"}]);
	}
	if ( number.match(/^[a-zA-Z]{2}\d{5}[a-zA-Z]{2}$/, '') || number.match(/^[6A]+\d{11}$/, '') || number.match(/^[128]+\d{23}$/, '') ){
		arr = jQuery.merge( arr,[{"aliexpress-standard-shipping": "Aliexpress Standard Shipping"}]);
	}
	if ( number.match(/^[a-zA-Z]{2}\d{10}$/, '') ){
		arr = jQuery.merge( arr,[{"fastway-za": "FastWay South Africa"}]);
	}
	if ( number.match(/^\d{10}$/, '') ){
		arr = jQuery.merge( arr,[{"geniki-taxydromiki": "Geniki Taxydromiki"}]);
	}
	if ( number.match(/^([a-zA-Z\d]{9}|[a-zA-Z\d]{10}|[a-zA-Z\d]{12}|[a-zA-Z\d]{11}|[a-zA-Z\d]{20})$/, '') ){
		arr = jQuery.merge( arr,[{"aramex": "Aramex"}]);
	}
	if ( number.match(/^\d{11}$/, '') ){
		arr = jQuery.merge( arr,[{"lbc-express": "LBC Express"}]);
	}
	if ( number.match(/^[a-zA-Z]{2}\d{9}[a-zA-Z]{2}$/, '') || number.match(/^[42]{2}\d{32}$/, '') ){
		arr = jQuery.merge( arr,[{"global-order-tracking": "Global Order Tracking"}]);
	}
	if ( number.match(/^(\d{10})$/, '') || number.match(/^([JJD01|JJD00|JVGL]+\d{7})$/, '') || number.match(/^([jjd01|jjd00|jvgl]+\d{7})$/, '') ){
		arr = jQuery.merge( arr, [{"dhl-express": "DHL Express"}] );
	}
	if (number.match(/^([A-Z]{2}[0-9]+(FI))$/, '') || number.match(/^([a-zA-Z]{2}[0-9]+(fi))$/, '') ){
		arr = jQuery.merge( arr,[{"finland-post": "Finland Post"}]);
	}
	if ( number.match(/^\d{18}$/, '') ){
		arr = jQuery.merge( arr,[{"db-schenker": "DB Schenker"}]);
	}
	if ( number.match(/^[a-zA-Z]{2}\d{9}[a-zA-Z]{2}$/, '') || number.match(/^(\d{12}|\d{15})$/, '') || number.match(/^([6]{1}\d{10})$/, '') ){
		arr = jQuery.merge( arr,[{"palletways": "Palletways"}]);
	}
	if ( number.match(/^[a-zA-Z]{2}\d{9}[a-zA-Z]{2}$/, '') || number.match(/^[33X]{3}\d{20}$/, '') || number.match(/^(\d{16}|\d{20})$/, '') ){
		arr = jQuery.merge( arr,[{"ubi-smart-parcel": "UBI Smart Parcel"}]);
	}
	if ( number.match(/^[R|V|C|E][A-Z]{1}[0-9]{9}[A-Z]{2}$/, '') || number.match(/^[r|v|c|e][a-zA-Z]{1}[0-9]{9}[a-zA-Z]{2}$/, '') ){
		arr = jQuery.merge( arr,[{"bulgaria-post": "Bulgaria Post"}]);
	}
	if ( number.match(/^([A-Z]{2}[0-9]+(PL))$/, '') || number.match(/^([a-zA-Z]{2}[0-9]+(pl))$/, '') ){
		arr = jQuery.merge( arr,[{"poland-post": "Poland Post"}]);
	}
	if ( number.match(/^[a-zA-Z]{1}\d{8,12}$/, '') ){
		arr = jQuery.merge( arr,[{"dotzot": "Dotzot"}]);
	}
	if ( number.match(/^[a-zA-Z]{3}\d{5}$/, '') ){
		arr = jQuery.merge( arr,[{"wahana": "Wahana"}]);
	}
	if ( number.match(/^\d{12}$/, '') ){
		arr = jQuery.merge( arr,[{"jt-express-ph": "JT Express PH"}]);
	}
	if ( number.match(/^([A-Z]{2}[0-9]+(ID))$/, '') || number.match(/^([a-zA-Z]{2}[0-9]+(id))$/, '') ){
		arr = jQuery.merge( arr,[{"pos-indonesia": "Pos Indonesia"}]);
	}
	if ( number.match(/^[a-zA-Z]{3}\d{9}[a-zA-Z]{2}$/, '') ){
		arr = jQuery.merge( arr,[{"yamato": "Yamato"}]);
	}
	if ( number.match(/^[a-zA-Z]{3}\d{9}[a-zA-Z]{2}$/, '') ){
		arr = jQuery.merge( arr,[{"tcat": "T Cat"}]);
	}
	if ( number.match(/^([A-Z]{2}[0-9]+(HU))$/, '') || number.match(/^([a-zA-Z]{2}[0-9]+(lu))$/, '') ){
		arr = jQuery.merge( arr,[{"luxembourg-post": "Luxembourg Post"}]);
	}
	if ( number.match(/^\d{12}$/, '') ){
		arr = jQuery.merge( arr,[{"correos-express": "Correos Express"}]);
	}
	if ( number.match(/^[A-Za-z0-9]{10}$/, '') ){
		arr = jQuery.merge( arr,[{"chit-chats": "Chit Chats"}]);
	}
	if ( number.match(/^[a-zA-Z]{3}\d{9}[a-zA-Z]{2}$/, '') ||  number.match(/^\d{12}$/, '') ){
		arr = jQuery.merge( arr,[{"shree-tirupati-courier": "Shree Tirupati Courier"}]);
	}
	if ( number.match(/^[a-zA-Z]{3}\d{10}$/, '') ){
		arr = jQuery.merge( arr,[{"ekart": "Ekart"}]);
	}
	if ( number.match(/^([BE]{2}[0-9]+(HU))$/, '') || number.match(/^([EA]{2}[0-9]+(HU))$/, '') || number.match(/^([PB]{2}[0-9]+(HU))$/, '') ){
		arr = jQuery.merge( arr,[{"magyar-posta": "Magyar Posta"}]);
	}
	if ( number.match(/^([A-Z]{2}[0-9]+(RS))$/, '') || number.match(/^([a-zA-Z]{2}[0-9]+(rs))$/, '') || number.match(/^([A-Z]{2}[0-9]+(LT))$/, '') ){
		arr = jQuery.merge( arr,[{"lithuania-post": "Lithuania Post"}]);
	}	
	if ( number.match(/^([A-Z]{2}[0-9]+(HU))$/, '') || number.match(/^([a-zA-Z]{2}[0-9]+(hu))$/, '') ){
		arr = jQuery.merge( arr,[{"kerry-express": "Kerry Express"}]);
	}
	if ( number.match(/^[a-zA-Z0-9]{7,19}$/, '') ){
		arr = jQuery.merge( arr,[{"collectplus": "CollectPlus"}]);
	}
	if ( number.match(/^[a-zA-Z0-9]{10,12}$/, '') ){
		arr = jQuery.merge( arr,[{"Sagawa": "SAGAWA"}]);
	}
	if ( number.match(/^([RR]{2}[0-9]+(TH))$/, '') || number.match(/^([RO]{2}[0-9]+(TH))$/, '') ){
		arr = jQuery.merge( arr,[{"thailand-post": "Thailand Post"}]);
	}
	if ( number.match(/^([A-Z]{2}[0-9]+(RU))$/, '') || number.match(/^([a-zA-Z]{2}[0-9]+(ru))$/, '') ){
		arr = jQuery.merge( arr,{"russian-post": "Russian Post"});
	}
	if ( number.match(/^[a-zA-Z]{3}\d{9}[a-zA-Z]{2}$/, '') ){
		arr = jQuery.merge( arr,[{"jcex": "JCEX"}]);
	}
	if ( number.match(/^[JD]{2}\d{16}$/, '') ){
		arr = jQuery.merge( arr,[{"yodel": "Yodel"}]);
	}
	if ( number.match(/^([A-Z]{2}[0-9]+(ET))$/, '') || number.match(/^([a-zA-Z]{2}[0-9]+(et))$/, '') ){
		arr = jQuery.merge( arr,[{"ethiopia-post": "Ethiopia Post"}]);
	}
	if ( number.match(/^[6867]{4}\d{9}$/, '') || number.match(/^[00093]{5}\d{15}$/, '') ){
		arr = jQuery.merge( arr,[{"toll": "TOLL"}]);
	}
	if ( number.match(/^\d{12,19}$/, '') || number.match(/^[a-zA-Z]{2}\d{12}$/, '') || number.match(/^[a-zA-Z]{1}\d{1}[a-zA-Z]{1}\d{11}$/,'') ){
		arr = jQuery.merge( arr,[{"brt": "BRT"}]);
	}
	
	jQuery(".tracking_provider_dropdown").children().remove("optgroup[label='Matching Provider']");
	var selected_option = '';	
	var optgroup = jQuery("<optgroup label='Matching Provider'>");		
	var num = 0;
	jQuery.each( arr, function( key, value ) {			
		jQuery.each( value, function( provider_slug, provider_name ) {
			if( num == 0 ){
				selected_option = provider_slug;
			}
			var op = "<option value='" + provider_slug + "'>" + provider_name + "</option>";				
			optgroup.append(op);
			num++;
		});		
	});
	
	jQuery(".tracking_provider_dropdown").prepend(optgroup);
	jQuery('.tracking_provider_dropdown').val(selected_option);
	jQuery('.tracking_provider_dropdown').select2();
});