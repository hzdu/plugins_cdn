const { registerBlockType } = wp.blocks;

var wpep_block_container = {
	"text-align": 'center'
};

var divStyle = {
	"margin-bottom": "40px",
};

var wpep_logo = {

	filter: "grayscale(100%)",
	width: "250px"
}


registerBlockType(
	'wpep/shortcode',
	{

		title: 'WPEasyPay Form',
		description: 'Block to add WP EASY PAY shortcode to the page',
		icon: 'format-aside',
		category: 'layout',
		attributes: {
			type: {
				type: 'string',

			}
		},
		edit( props ) {


			var p       = wpep_forms.forms;
			var options = [];

			options.push( < option value = "" > Please select your form < / option > )

			for (var key in p) {

				if (p.hasOwnProperty( key )) {
					var form_id    = p[key].ID;
					var form_title = p[key].title;
					if (props.attributes.type == form_id) {

						options.push( < option value = {form_id} selected > {form_title} < / option > )

					} else {

						options.push( < option value = {form_id} > {form_title} < / option > )
					}
				}

			}

			var type = props.attributes.type;

			function wpep_shortcode_change(e) {
				var form_id = e.target.value;
				props.setAttributes( {type: form_id} );
			}

			return (
			<div style = {wpep_block_container}> <div style = {divStyle} > <img style={wpep_logo} src={'https://wpeasypay.com/wp-content/uploads/2019/12/Group-270@2x.png'}/> </div> <div> <select onChange={wpep_shortcode_change}>{options} </select> </div> </div>
			);

		},
		save( props ) {
			return null;
		}

	}
);
