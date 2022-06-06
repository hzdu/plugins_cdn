var reports = require( './views/report/report' ),
	variation_collection = require( './collections/variations' ),
	dashboard = require( './views/dashboard' ),
	test_model = require( './models/test' );

(function ( $ ) {

	module.exports = Backbone.Router.extend( {
		view: null,
		$el: $( '#tab-dashboard-wrapper' ),
		routes: {
			'dashboard(/:action)': 'dashboard',
			'test(/:id)': 'reports'
		},
		/**
		 * dashboard route callback
		 */
		dashboard: function ( action ) {
			if ( this.view ) {
				this.view.remove();
			}

			if ( typeof ThriveAB === 'undefined' ) {
				console.log( 'Thrive Optimize have not localized required data !' );
				return;
			}

			this.view = new dashboard( {
				el: this.$el,
				model: new Backbone.Model( ThriveAB.page ),
				collection: new variation_collection( ThriveAB.variations ),
				archived: new variation_collection( ThriveAB.archived ),
			} );

			if ( action === 'start-test' ) {
				this.view.$( '#thrive-ab-start-test' ).trigger( 'click' );
			}
		},
		/**
		 * reports route callback
		 */
		reports: function ( id ) {
			if ( this.view ) {
				this.view.remove();
			}

			var model = new test_model( id ? ThriveAB.running_test : ThriveAB.current_test );

			this.view = new reports( {
				el: this.$el,
				model: model
			} );
		}
	} );

})( jQuery );
