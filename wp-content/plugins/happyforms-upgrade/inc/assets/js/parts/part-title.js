(function ($, _, Backbone, api, settings) {

	happyForms.classes.models.parts.title = happyForms.classes.models.Part.extend({
		defaults: function () {
			return _.extend(
				{},
				settings.formParts.title.defaults,
				_.result(happyForms.classes.models.Part.prototype, 'defaults'),
			);
		},
	});

	happyForms.classes.views.parts.title = happyForms.classes.views.Part.extend({
		template: '#happyforms-customize-title-template',

		initialize: function () {
			happyForms.classes.views.Part.prototype.initialize.apply(this, arguments);

			this.listenTo(this.model, 'change:required', this.onRequiredChange);
		},

		onRequiredChange: function( model, value ) {
			model.fetchHtml(function (response) {
				var data = {
				id: model.get('id'),
				html: response,
				};

				happyForms.previewSend('happyforms-form-part-refresh', data);
			});
		}
	});

})(jQuery, _, Backbone, wp.customize, _happyFormsSettings);
