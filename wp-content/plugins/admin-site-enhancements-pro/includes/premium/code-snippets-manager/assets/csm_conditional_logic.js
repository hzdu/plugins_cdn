// Forked from https://plugins.trac.wordpress.org/browser/insert-php/tags/2.4.10/admin/assets/js/view-opt.js
if( !window.csm ) {
	window.csm = {};
}

// console.log('csm');
// console.log(csm);

(function($) {

	/**
	 * Condition Editor
	 */
	$.widget("csm.csmConditionEditor", {

		options: {
			filters: null
		},

		_create: function() {
			var self = this;

			this._counter = 0;

			this._$editor = this.element;
			this._$editor.data('csm-api', this);

			this._$filters = this._$editor.find(".csm-filters");
			this._$tmplFilter = this._$editor.find(".csm-filter.csm-template").clone().removeClass("csm-template");

			this._$btnAdd = this._$editor.find(".csm-add-filter");

			this._$btnAdd.click(function() {
				self.addFilter();
				return false;
			});

			this._$editor.on('csm.filters-changed', function() {
				self._checkIsEmpty();
				self._checkIsDeleted();
			});

			this._load();

			this._checkIsEmpty();
		},

		_load: function() {

			if( this.options.filters ) {
				// console.log( 'this.options.filters' );
				// console.log( this.options.filters );
				for( var index in this.options.filters ) {
					this.addFilter(this.options.filters[index]);
				}
			}
		},

		_checkIsEmpty: function() {

			if( this.getCount() === 0 ) {
				this._$editor.addClass('csm-empty');
			} else {
				this._$editor.removeClass('csm-empty');
			}
		},

		_checkIsDeleted: function() {

			if( this.getCount() === 0 ) {
				this.markChangeFilters();
			}
		},

		markChangeFilters: function() {
			this._$editor.find("#code_snippet_changed_filters").val(1);
		},

		addFilter: function(data) {
			if( !data ) {
				data = {type: 'showif'};
			}
			// console.log( 'data from addFilter' );
			// console.log( data );

			var self = this;

			var $filter = this._$tmplFilter.clone();
			this._$filters.append($filter);

			$filter.data('csm-editor', this._$editor);

			this._counter = this._counter + 1;

			$filter.csmConditionFilter({
				index: self._counter,
				type: data.type,
				conditions: data.conditions
			});

			self._$editor.trigger('csm.filters-changed');
			return $filter;
		},

		getData: function() {
			var filters = [];

			this._$filters.find(".csm-filter").each(function() {
				var definition = $(this).csmConditionFilter('getData');
				filters.push(definition);
			});

			return filters;
		},

		getCount: function() {
			return this._$editor.find('.csm-filter:not(.csm-template)').length;
		}
	});

	/**
	 * Condition Filter
	 */
	$.widget("csm.csmConditionFilter", {

		options: {
			type: 'showif',
			conditions: null,
			index: null
		},

		_create: function() {
			var self = this;

			this._counter = 0;
			this._index = this.options.index;

			this._$filter = this.element;
			this._$filter.data('csm-api', this);

			this._$editor = this._$filter.data('csm-editor');
			this._$conditions = this._$filter.find(".csm-conditions");

			this._$tmplCondition = this._$editor.find(".csm-condition.csm-template").clone().removeClass("csm-template");
			this._$tmplScope = this._$editor.find(".csm-scope.csm-template").clone().removeClass("csm-template");

			this._load();

			this._$filter.find(".csm-link-add").click(function() {
				self.addCondition();
				return false;
			});

			this._$filter.find(".btn-remove-filter").click(function() {
				self._$filter.remove();
				self._$editor.trigger('csm.filters-changed');
				return false;
			});

			this._$filter.find(".csm-btn-apply-template").click(function() {
				var templateName = $(".csm-select-template").val();

				if( templateName ) {
					var data = self.getTemplateData(templateName);
					if( data ) {
						self.setFilterData(data);
					}
				}

				return false;
			});

			this._$filter.on('csm.conditions-changed', function() {
				self._checkIsEmpty();
			});
		},

		_load: function() {

			if( !this.options.conditions ) {
				this.addCondition();
			} else {
				this.setFilterData(this.options);
			}
		},

		setFilterData: function(data) {

			this._$filter.find('.csm-condition').remove();

			if( data.conditions ) {
				for( var index in data.conditions ) {
					this.addCondition(data.conditions[index]);
				}
			}

			this._$filter.find(".csm-filter-type").val(data.type);
			this._checkIsEmpty();
		},

		_checkIsEmpty: function() {

			if( this.getCount() === 0 ) {
				this._$filter.addClass('csm-empty');
			} else {
				this._$filter.removeClass('csm-empty');
			}

			this._$conditions.find('.csm-scope').each(function() {
				var count = $(this).find('.csm-condition').length;
				if( count === 0 ) {
					$(this).remove();
				}
			});
		},

		addCondition: function(data, $scope) {
			if( !data ) {
				data = {type: 'condition'};
			}

			if( data.type === 'scope' ) {
				this.addScope(data);
			} else if( data.type === 'condition' && !$scope ) {
				var $scope = this.addScope();
				this.addCondition(data, $scope);
			} else {

				var $condition = this._$tmplCondition.clone();
				$scope.append($condition);

				$condition.data('csm-scope', $scope);
				$condition.data('csm-editor', this._$editor);
				$condition.data('csm-filter', this._$filter);

				this._counter = this._counter + 1;
				data.index = this._index + '_' + this._counter;

				$condition.csmCondition(data);
				this._$filter.trigger('csm.conditions-changed');
			}
		},

		addScope: function(data) {
			if( !data ) {
				data = {};
			}

			var $scope = this._$tmplScope.clone();
			this._$conditions.append($scope);

			if( data && data.conditions ) {
				for( var index in data.conditions ) {
					this.addCondition(data.conditions[index], $scope);
				}
			}

			return $scope;
		},

		getData: function() {
			var scopes = [];

			this._$conditions.find('.csm-scope').each(function() {

				var scope = {
					type: 'scope',
					conditions: []
				};

				scopes.push(scope);

				$(this).find('.csm-condition').each(function() {
					var condition = $(this).csmCondition('getData');
					scope.conditions.push(condition);
				});
			});

			var filterType = this._$filter.find(".csm-filter-type").val();

			return {
				conditions: scopes,
				type: filterType
			};
		},

		getCount: function() {
			return this._$filter.find('.csm-condition').length;
		},

		getTemplateData: function(paramName) {
			if( !window.csm ) {
				return;
			}
			if( !window.csm.templates ) {
				return;
			}

			for( var index in window.csm.templates ) {
				var data = window.csm.templates[index];
				if( data['id'] === paramName ) {
					return data['filter'];
				}
			}

			return false;
		}
	});

	/**
	 * Condition
	 */
	$.widget("csm.csmCondition", {

		options: {
			index: null,
			operator: 'equals'
		},

		_create: function() {
			this._index = this.options.index;

			this._$condition = this.element;
			this._$condition.data('csm-condition', this);

			this._$editor = this._$condition.data('csm-editor');
			this._$filter = this._$condition.data('csm-filter');
			this._$scope = this._$condition.data('csm-scope');

			this._editor = this._$editor.data('csm-api');
			this._filter = this._$filter.data('csm-api');

			this._$hint = this.element.find(".csm-hint");
			this._$hintContent = this.element.find(".csm-hint-content");

			this._$tmplDateControl = this._$editor.find(".csm-date-control.csm-template").clone().removeClass("csm-template");
		},

		_init: function() {
			var self = this;

			this._$condition.find(".csm-param-select").change(function() {
				self.prepareFields();
			});
			self.prepareFields(true);

			// buttons

			this._$condition.find(".csm-btn-remove").click(function() {
				self._editor.markChangeFilters();
				self.remove();
				return false;
			});

			this._$condition.find(".csm-btn-or").click(function() {
				self._editor.markChangeFilters();
				self._filter.addCondition(null, self._$scope);
				return false;
			});

			this._$condition.find(".csm-btn-and").click(function() {
				self._editor.markChangeFilters();
				self._filter.addCondition();
				return false;
			});
		},

		remove: function() {
			this._$condition.remove();
			this._$filter.trigger('csm.conditions-changed');
		},

		getData: function() {

			var currentParam = this._$condition.find(".csm-param-select").val();
			var paramOptions = this.getParamOptions(currentParam);

			var $operator = this._$condition.find(".csm-operator-select");
			var currentOperator = $operator.val();

			var value = null;

			if( 'select' === paramOptions['type'] ) {
				value = this.getSelectValue(paramOptions);
			} else if( 'date' === paramOptions['type'] ) {
				value = this.getDateValue(paramOptions);
			} else if( 'date-between' === paramOptions['type'] ) {
				value = this.getDateBetweenValue(paramOptions);
			} else if( 'integer' === paramOptions['type'] ) {
				value = this.getIntegerValue(paramOptions);
			} else {
				value = this.getTextValue(paramOptions);
			}

			return {
				param: currentParam,
				operator: currentOperator,
				type: paramOptions['type'],
				value: value
			};
		},

		prepareFields: function(isInit) {
			var self = this;

			if( isInit && this.options.param ) {
				this.selectParam(this.options.param);
			}

			var currentParam = this._$condition.find(".csm-param-select").val();
			var paramOptions = this.getParamOptions(currentParam);
			// console.log( 'paramOptions' );
			// console.log( paramOptions );

			this.setParamHint(paramOptions.description);

			var operators = [];

			if( 'select' === paramOptions['type'] ) {
				if ( 'location-page-type' == paramOptions['id'] 
					|| 'location-post-type' == paramOptions['id'] 
					|| 'location-single-post' == paramOptions['id'] 
					|| 'location-taxonomy-type' == paramOptions['id'] 
					|| 'location-taxonomy-term' == paramOptions['id'] 
					|| 'user-role' == paramOptions['id'] 
					|| 'location-device-type' == paramOptions['id'] 
				) {
					operators = ['in', 'notin'];
				} else {
					operators = ['equals', 'notequal'];
				}
			} else if ( paramOptions['onlyEquals'] ) {
				operators = ['equals', 'notequal'];
			} else if( 'date' === paramOptions['type'] ) {
				operators = ['equals', 'notequal', 'younger', 'older', 'between'];
			} else if( 'date-between' === paramOptions['type'] ) {
				operators = ['between'];
			} else if( 'integer' === paramOptions['type'] ) {
				operators = ['equals', 'notequal', 'less', 'greater', 'between'];
			} else {
				operators = ['equals', 'notequal', 'contains', 'notcontain'];
			}

			this.setOperators(operators);

			// console.log( 'operators : ');
			// console.log( operators );
			// console.log( 'isInit : ' + isInit );
			// console.log( 'this.options.operator : ' + this.options.operator );
			// console.log( 'paramOptions : ' );
			// console.log( paramOptions );
			
			// isInit is 'true' when a new condition is added (OR or AND)
			// isInit is 'undefined' when a new location type is selected within a condition
			// this.options.operator has the default value of 'equals', unless another value has been selected and saved

			if( isInit ) {
				// isInit is 'true'
				// A new OR/AND condition is being added, and 'equals' is the default value for this.options.operator
				if ( 'equals' == this.options.operator ) {
					// At this point, the location defaults to "Type of page" and we set the default operator
					this.selectOperator('in'); // 'is / one of'
				} else {
					// At this point, location type and operator were selected and we use that value
					this.selectOperator(this.options.operator);
				}
			} else {
				// isInit is 'undefined'
				// This is when a new location type is being selected
				// and we want to select the default operator for it.
				if ( 'location-page-type' == paramOptions['id'] 
					|| 'location-post-type' == paramOptions['id'] 
					|| 'location-single-post' == paramOptions['id'] 
					|| 'location-taxonomy-type' == paramOptions['id']
					|| 'location-taxonomy-term' == paramOptions['id']
					|| 'user-role' == paramOptions['id'] 
					|| 'location-device-type' == paramOptions['id'] 
				) {
					this.selectOperator('in'); // 'is / one of'
				} else {
					this.selectFirstOperator('equals'); // 'is'
				}
			}

			this.createValueControl(paramOptions, isInit);
		},

		/**
		 * Displays and configures the param hint.
		 */
		setParamHint: function(description) {

			if( description ) {
				this._$hintContent.html(description);
				this._$hint.show();
			} else {
				this._$hint.hide();
			}
		},

		/**
		 * Creates control to specify value.
		 */
		createValueControl: function(paramOptions, isInit) {

			if( 'select' === paramOptions['type'] ) {
				this.createValueAsSelect(paramOptions, isInit);
			} else if( 'date' === paramOptions['type'] ) {
				this.createValueAsDate(paramOptions, isInit);
			} else if( 'date-between' === paramOptions['type'] ) {
				this.createValueAsDateBetween(paramOptions, isInit);
			} else if( 'integer' === paramOptions['type'] ) {
				this.createValueAsInteger(paramOptions, isInit);
			} else {
				this.createValueAsText(paramOptions, isInit);
			}
		},

		// -------------------
		// Select Control
		// -------------------

		/**
		 * Creates the Select control.
		 */
		createValueAsSelect: function(paramOptions, isInit) {
			// console.log( 'paramOptions' );
			// console.log( paramOptions );
			var self = this;
			if ( 'location-page-type' == paramOptions['id'] 
				|| 'location-post-type' == paramOptions['id'] 
				|| 'location-single-post' == paramOptions['id'] 
				|| 'location-taxonomy-type' == paramOptions['id']
				|| 'location-taxonomy-term' == paramOptions['id']
				|| 'user-role' == paramOptions['id'] 
				|| 'location-device-type' == paramOptions['id'] 
			) {
				var attrs = {class:paramOptions['id'], multiple:"multiple"};
			} else {
				var attrs = {class:paramOptions['id']};
			}

			var createSelect = function(values,attrs) {
				var $select = self.createSelect(values,attrs);
				self.insertValueControl($select);
				if( isInit && self.options.value ) {
					self.setSelectValue(self.options.value);
				}
				self._$condition.find(".csm-value").trigger("insert.select");
			};

			if( !paramOptions['values'] ) {
				return;
			}

			if( 'ajax' === paramOptions['values']['type'] ) {

				var $fakeSelect = self.createSelect([
					{
						value: null,
						title: '- loading -'
					}
				]);
				self.insertValueControl($fakeSelect);

				$fakeSelect.attr('disabled', 'disabled');
				$fakeSelect.addClass('csm-fake-select');

				if( isInit && this.options.value ) {
					$fakeSelect.data('value', this.options.value);
				}

				var req = $.ajax({
					url: window.ajaxurl,
					method: 'post',
					data: {
						action: paramOptions['values']['action'],
						snippet_id: $('#post_ID').val(),
						_wpnonce: $('#code_snippet_conditions_metabox_nonce').val()
					},
					dataType: 'json',
					success: function(data) {

						if( data.error ) {
							self.advancedOptions.showError(data.error);
							return;
						} else if( !data.values ) {
							self.advancedOptions.showError(req.responseText);
							return;
						}

						// console.log( 'data.values from createValueAsSelect(528)' );
						// console.log( data.values );
						createSelect(data.values,attrs);
						// Let's initialize select2
						if ( 'location-page-type' == paramOptions['id'] 
							|| 'location-post-type' == paramOptions['id'] 
							|| 'location-single-post' == paramOptions['id'] 
							|| 'location-taxonomy-type' == paramOptions['id']
							|| 'location-taxonomy-term' == paramOptions['id']
							|| 'user-role' == paramOptions['id'] 
							|| 'location-device-type' == paramOptions['id'] 
						) {
							// $('.'+paramOptions['id']).select2();
							$('.'+paramOptions['id']).select2({
								'placeholder' : csm.placeholderText
							});
						}
					},
					error: function() {
						self.advancedOptions.showError('Unexpected error during the ajax request.');
					},
					complete: function() {
						if( $fakeSelect ) {
							$fakeSelect.remove();
						}
						$fakeSelect = null;
					}
				});
			} else {
				createSelect(paramOptions['values'],attrs);
			}
		},

		/**
		 * Returns a value for the select control.
		 */
		getSelectValue: function() {
			var $select = this._$condition.find(".csm-value select");

			var value = $select.val();
			if( !value ) {
				value = $select.data('value');
			}
			return value;
		},

		/**
		 * Sets a select value.
		 */
		setSelectValue: function(value) {
			var $select = this._$condition.find(".csm-value select");

			if( $select.hasClass('.csm-fake-select') ) {
				$select.data('value', value);
			} else {
				$select.val(value);
			}
		},

		// -------------------
		// Date Control
		// -------------------

		/**
		 * Creates a control for the input linked with the date.
		 */
		createValueAsDate: function(paramOptions, isInit) {

			var $operator = this._$condition.find(".csm-operator-select");
			var $control = this._$tmplDateControl.clone();

			$operator.change(function() {
				var currentOperator = $operator.val();

				if( 'between' === currentOperator ) {
					$control.addClass('csm-between');
					$control.removeClass('csm-solo');
				} else {
					$control.addClass('csm-solo');
					$control.removeClass('csm-between');
				}

			});

			$operator.change();

			var $radioes = $control.find(".csm-switcher input")
				.attr('name', 'csm_switcher_' + this._index)
				.click(function() {
					var value = $control.find(".csm-switcher input:checked").val();
					if( 'relative' === value ) {
						$control.addClass('csm-relative');
						$control.removeClass('csm-absolute');
					} else {
						$control.addClass('csm-absolute');
						$control.removeClass('csm-relative');
					}
				});

			$control.find(".csm-absolute-date input[type='text']").datepicker({
				format: 'dd.mm.yyyy',
				todayHighlight: true,
				autoclose: true
			});

			this.insertValueControl($control);
			if( isInit && this.options.value ) {
				this.setDateValue(this.options.value);
			}
		},

		/**
		 * Returns a value for the Date control.
		 * @returns {undefined}
		 */
		getDateValue: function() {
			var value = {};

			var $operator = this._$condition.find(".csm-operator-select");
			var currentOperator = $operator.val();

			var $control = this._$condition.find(".csm-value > .csm-date-control");
			var $holder = this._$condition.find(".csm-value > .csm-date-control");

			if( 'between' === currentOperator ) {
				$holder = $holder.find(".csm-between-date");
				value.range = true;

				value.start = {};
				value.end = {};

				if( $control.hasClass('csm-relative') ) {
					$holder = $holder.find(".csm-relative-date");

					value.start.unitsCount = $holder.find(".csm-date-value-start").val();
					value.end.unitsCount = $holder.find(".csm-date-value-end").val();

					value.start.units = $holder.find(".csm-date-start-units").val();
					value.end.units = $holder.find(".csm-date-end-units").val();

					value.start.type = 'relative';
					value.end.type = 'relative';

				} else {
					$holder = $holder.find(".csm-absolute-date");

					value.start = $holder.find(".csm-date-value-start").datepicker('getUTCDate').getTime();
					value.end = $holder.find(".csm-date-value-end").datepicker('getUTCDate').getTime();
					value.end = value.end + (((23 * 60 * 60) + (59 * 60) + 59) * 1000) + 999;
				}

			} else {
				$holder = $holder.find(".csm-solo-date");
				value.range = false;

				if( $control.hasClass('csm-relative') ) {
					$holder = $holder.find(".csm-relative-date");

					value.type = 'relative';
					value.unitsCount = $holder.find(".csm-date-value").val();
					value.units = $holder.find(".csm-date-value-units").val();

				} else {
					$holder = $holder.find(".csm-absolute-date");
					value = $holder.find("input[type='text']").datepicker('getUTCDate').getTime();

					if( 'older' === currentOperator ) {
						value = value + (((23 * 60 * 60) + (59 * 60) + 59) * 1000) + 999;
					}
				}
			}

			return value;
		},

		/**
		 * Sets a select value.
		 */
		setDateValue: function(value) {
			if( !value ) {
				value = {};
			}

			var $holder = this._$condition.find(".csm-value > .csm-date-control");
			var $control = this._$condition.find(".csm-value > .csm-date-control");

			if( value.range ) {

				if( 'relative' === value.start.type ) {
					$holder = $holder.find(".csm-relative-date");

					$holder.find(".csm-date-value-start").val(value.start.unitsCount);
					$holder.find(".csm-date-value-end").val(value.end.unitsCount);
					$holder.find(".csm-date-start-units").val(value.start.units);
					$holder.find(".csm-date-end-units").val(value.end.units);

				} else {
					$holder = $holder.find(".csm-absolute-date");

					var start = new Date(value.start);
					var end = new Date(value.end);

					$holder.find(".csm-date-value-start").datepicker('setUTCDate', start);
					$holder.find(".csm-date-value-end").datepicker('setUTCDate', end);
				}

			} else {

				if( 'relative' === value.type ) {
					$holder = $holder.find(".csm-relative-date");

					$holder.find(".csm-date-value").val(value.unitsCount);
					$holder.find(".csm-date-value-units").val(value.units);

				} else {
					$holder = $holder.find(".csm-absolute-date");

					var date = new Date(value);
					$holder.find(".csm-date-value").datepicker('setUTCDate', date);
				}
			}

			var $relative = $control.find(".csm-switcher input[value=relative]");
			var $absolute = $control.find(".csm-switcher input[value=absolute]");

			if( 'relative' === value.type || (value.start && 'relative' === value.start.type) ) {
				$relative.attr('checked', 'checked');
				$relative.click();
			} else {
				$absolute.attr('checked', 'checked');
				$absolute.click();
			}
		},

		// -------------------
		// Date Between Control
		// -------------------

		/**
		 * Creates a control for the input linked with the date between.
		 */
		createValueAsDateBetween: function(paramOptions, isInit) {
			this._$condition.find('.csm-operator-select').hide();
			var $control = this._$tmplDateControl.clone();
			$control.addClass('csm-between');
			$control.removeClass('csm-solo');
			$control.addClass('csm-absolute');
			$control.removeClass('csm-relative');

			$control.find('.csm-switcher input').attr('name', 'csm_switcher_' + this._index);
			$control.find('.csm-switcher').hide();

			$control.find('.csm-absolute-date input[type=\'text\']').datepicker({
				format: 'dd.mm.yyyy',
				todayHighlight: true,
				autoclose: true
			}).attr('readonly', false);

			this.insertValueControl($control);
			if( isInit && this.options.value ) {
				this.setDateBetweenValue(this.options.value);
			}
		},

		/**
		 * Returns a value for the Date Between control.
		 * @returns {undefined}
		 */
		getDateBetweenValue: function() {
			var value = {};

			var $holder = this._$condition.find(".csm-value > .csm-date-control");

			$holder = $holder.find(".csm-between-date");
			value.range = true;

			value.start = {};
			value.end = {};

			$holder = $holder.find(".csm-absolute-date");

			value.start = $holder.find(".csm-date-value-start").datepicker('getUTCDate').getTime();
			value.end = $holder.find(".csm-date-value-end").datepicker('getUTCDate').getTime();
			value.end = value.end + (((23 * 60 * 60) + (59 * 60) + 59) * 1000) + 999;

			return value;
		},

		/**
		 * Sets a select value.
		 */
		setDateBetweenValue: function(value) {
			if( !value ) {
				value = {};
			}

			var $holder = this._$condition.find(".csm-value > .csm-date-control");
			var $control = this._$condition.find(".csm-value > .csm-date-control");

			$holder = $holder.find(".csm-absolute-date");

			var start = new Date(value.start);
			var end = new Date(value.end);

			$holder.find(".csm-date-value-start").datepicker('setUTCDate', start);
			$holder.find(".csm-date-value-end").datepicker('setUTCDate', end);

			var $absolute = $control.find(".csm-switcher input[value=absolute]");

			$absolute.attr('checked', 'checked');
			$absolute.click();
		},

		// -------------------
		// Integer Control
		// -------------------

		/**
		 * Creates a control for the input linked with the integer.
		 */
		createValueAsInteger: function(paramOptions, isInit) {
			var self = this;

			var $operator = this._$condition.find(".csm-operator-select");

			$operator.on('change', function() {
				var currentOperator = $operator.val();

				var $control;
				if( 'between' === currentOperator ) {
					$control = $("<span><input type='text' class='csm-integer-start' /> and <input type='text' class='csm-integer-end' /></span>");
				} else {
					$control = $("<input type='text' class='csm-integer-solo' /></span>");
				}

				self.insertValueControl($control);
			});

			$operator.change();
			if( isInit && this.options.value ) {
				this.setIntegerValue(this.options.value);
			}
		},

		/**
		 * Returns a value for the Integer control.
		 */
		getIntegerValue: function() {
			var value = {};

			var $operator = this._$condition.find(".csm-operator-select");
			var currentOperator = $operator.val();

			if( 'between' === currentOperator ) {
				value.range = true;
				value.start = this._$condition.find(".csm-integer-start").val();
				value.end = this._$condition.find(".csm-integer-end").val();

			} else {
				value = this._$condition.find(".csm-integer-solo").val();
			}

			return value;
		},

		/**
		 * Sets a value for the Integer control.
		 */
		setIntegerValue: function(value) {
			if( !value ) {
				value = {};
			}

			if( value.range ) {
				this._$condition.find(".csm-integer-start").val(value.start);
				this._$condition.find(".csm-integer-end").val(value.end);
			} else {
				this._$condition.find(".csm-integer-solo").val(value);
			}
		},

		// -------------------
		// Text Control
		// -------------------

		/**
		 * Creates a control for the input linked with the integer.
		 */
		createValueAsText: function(paramOptions, isInit) {
			var $control = $("<input type='text' class='csm-text "+paramOptions['id']+"' /></span>");
			this.insertValueControl($control);
			if( isInit && this.options.value ) {
				// console.log( 'this.options.value from createValueAsText(900)' );
				// console.log( this.options.value );
				// console.log( 'paramOptions from createValueAsText(900)' );
				// console.log( paramOptions );
				this.setTextValue(this.options.value);
			}
		},

		/**
		 * Returns a value for the Text control.
		 * @returns {undefined}
		 */
		getTextValue: function() {
			return this._$condition.find(".csm-text").val();
		},

		/**
		 * Sets a value for the Text control.
		 */
		setTextValue: function(value) {
			this._$condition.find(".csm-text").val(value);
		},

		// -------------------
		// Helper Methods
		// -------------------

		selectParam: function(value) {
			this._$condition.find(".csm-param-select").val(value);
		},

		selectOperator: function(value) {
			this._$condition.find(".csm-operator-select").val(value);
		},

		selectFirstOperator: function() {
			this._$condition.find(".csm-operator-select").prop('selectedIndex', 0); // 'is'
		},

		selectThirdOperator: function() {
			this._$condition.find(".csm-operator-select").prop('selectedIndex', 2); // 'is / one of'
		},
		
		setOperators: function(values) {
			var $operator = this._$condition.find(".csm-operator-select");
			$operator.show().off('change');

			$operator.find("option").hide();
			for( var index in values ) {
				$operator.find("option[value='" + values[index] + "']").show();
			}
			var value = $operator.find("option:not(:hidden):eq(0)").val();
			$operator.val(value);
		},

		insertValueControl: function($control) {
			this._$condition.find(".csm-value").html("").append($control);

		},

		getParamOptions: function(paramName) {
			if( !window.csm ) {
				return;
			}
			if( !window.csm.filtersParams ) {
				return;
			}

			for( var index in  window.csm.filtersParams ) {
				var paramOptions = window.csm.filtersParams[index];
				if( paramOptions['id'] === paramName ) {
					return paramOptions;
				}
			}

			return false;
		},

		createSelect: function(values, attrs) {
			// console.log( 'values from createSelect(980)' );
			// console.log( values );
			// console.log( 'attrs from createSelect(980)' );
			// console.log( attrs );

			var $select = $("<select></select>");
			if( attrs ) {
				$select.attr(attrs);
			}
			// console.log( 'attrs from createSelect(991)' );
			// console.log( attrs );

			for( var index in values ) {
				var item = values[index];
				var $option = '';

				if( typeof index === "string" && isNaN(index) === true ) {
					var $optgroup = $("<optgroup></optgroup>").attr('label', index);

					for( var subindex in item ) {
						var subvalue = item[subindex];
						$option = $("<option></option>").attr('value', subvalue['value']).text(subvalue['title']);
						if (subvalue['disabled'] !== null && subvalue['disabled']) $option.attr('disabled', 'disabled');
						$optgroup.append($option);
					}
					$select.append($optgroup);
				} else {
					$option = $("<option></option>").attr('value', item['value']).text(item['title']);
					$select.append($option);
				}
			}

			return $select;
		},

		createDataPircker: function() {

			var $control = $('<div class="csm-date-control" data-date="today"></div>');
			var $input = $('<input size="16" type="text" readonly="readonly" />');
			var $icon = $('<i class="fa fa-calendar"></i>');

			$control.append($input);
			$control.append($icon);

			var $datepicker = $input.datepicker({
				autoclose: true,
				format: 'dd/mm/yyyy'
			});

			$control.data('csm-datepicker', $datepicker);

			$icon.click(function() {
				$input.datepicker('show');
			});

			$control.on('changeDate', function(ev) {
				$input.datepicker('hide');
			});

			return $control;
		}
	});

	/**
	 * Visability Options.
	 */
	window.visibilityOptions = {

		init: function() {
			this.initSwitcher();
			this.initSimpleOptions();
			this.initAdvancedOptions();
			this.initDefaultAction();
		},

		initSwitcher: function() {
			var $buttons = $(".csm-options-switcher .btn");

			var selectOptions = function(value) {
				if( !value ) {
					value = $("#csm_visibility_mode").val();
				}

				$buttons.removeClass('active');

				if( 'simple' === value ) {
					$(".csm-options-switcher .btn-btn-simple").addClass('active');
					$("#csm-advanced-visibility-options").hide();
					$("#csm-simple-visibility-options").fadeIn(300);
				} else {
					$(".csm-options-switcher .btn-btn-advanced").addClass('active');
					$("#csm-simple-visibility-options").hide();
					$("#csm-advanced-visibility-options").fadeIn(300);
				}

				$("#csm_visibility_mode").val(value);
			};

			$buttons = $(".csm-options-switcher .btn").click(function() {
				var value = $(this).data('value');
				selectOptions(value);
				return false;
			});

			selectOptions();
		},

		initSimpleOptions: function() {
			$("#csm_relock").change(function() {
				if( $(this).is(":checked") ) {
					$("#onp-sl-relock-options").hide().removeClass('hide').fadeIn();
				} else {
					$("#onp-sl-relock-options").hide();
				}
			});
		},

		initAdvancedOptions: function() {
			var $formPost = $("form#post");
			var $hidden = $("#code_snippet_visibility_filters");
			var $editor = $("#csm-advanced-visibility-options");
			if ( $hidden.val() ) {
				var json_data = $.parseJSON($hidden.val());
				// console.log( 'json_data - saved conditional logic data' );
				// console.log( json_data );
				$editor.csmConditionEditor({
					filters: typeof json_data[0] === 'undefined' ? [] : json_data[0]
				});
				
				// saves conditions on clicking the button Save
				$formPost.submit(function() {
					var data = $editor.csmConditionEditor("getData");
					var json = JSON.stringify(data);
					$hidden.val(json);

					return true;
				});
			}
		},

		// Based on the selected parameter "Insertion location", we determine the condition parameters
		changeConditionValue: function() {
			var $editor = $("#csm-advanced-visability-options");
			var $condition = $editor.find('.csm-condition').eq(0);
			switch( $("#wbcr_inp_snippet_location").val() ) {
				case 'before_post':
				case 'before_content':
				case 'before_paragraph':
				case 'after_paragraph':
				case 'after_content':
				case 'after_post':
					$condition.find(".csm-value>select").val('base_sing');
					break;
				case 'before_excerpt':
				case 'after_excerpt':
				case 'between_posts':
				case 'before_posts':
				case 'after_posts':
					$condition.find(".csm-value>select").val('base_arch');
					break;
				default:
					$condition.find(".csm-value>select").val('base_web');
			}
		},

		// "Hang" events on three selects. If the user changes them, 
		// then we remember this and do not change the parameters automatically anymore.
		bindTrigger: function() {
			var $editor = $("#csm-advanced-visability-options");
			var $filter = $editor.find('.csm-filter').eq(0);
			$filter.find('select').change(function() {
				$editor.find("#code_snippet_changed_filters").val(1);
			});
		},

		// We set the first condition and "hang" events on the elements
		initDefaultAction: function() {
			var $editor = $("#csm-advanced-visability-options");
			var $condition = null;
			var $select = null;
			var self = this;

			// If there is no condition yet, then we create it
			if( $editor.find("#code_snippet_changed_filters").val() == 0 ) {
				if( $(".csm-filter:not(.csm-template)").length == 0 ) {
					// Generate a button click event - Add new condition
					$("a.csm-add-filter").trigger('click');
				} else {
					$select = $("select.csm-param-select").eq(0);
				}

				// "Hang" the event on the last select, which is loaded via ajax
				$condition = $editor.find('.csm-condition').eq(0);
				$condition.find(".csm-value").on("insert.select", function() {
					if( $editor.find("#code_snippet_changed_filters").val() == 0 ) {
						if( $select == null ) {
							$select = $("select.csm-param-select").eq(0);
							$select.val('location-page-type').trigger('change');
						}

						self.bindTrigger();
						self.changeConditionValue();
					}
				});
			}

			// If you have changed one of the two parameters (scope or location), 
			// then if necessary, we set the condition parameters automatically
			$("#wbcr_inp_snippet_scope, #wbcr_inp_snippet_location").change(function() {
				if( $editor.find("#code_snippet_changed_filters").val() == 0 && $select != null ) {
					// Если первый параметр условия уже установлен
					if( 'location-page-type' == $select.val() ) {
						if( 'auto' == $("#wbcr_inp_snippet_scope").val() ) {
							self.changeConditionValue();
						} else {
							$condition.find(".csm-value>select").val('base_web');
						}
					} else {
						$select.val('location-page-type').trigger('change');
					}
				}
			});

			$editor.find("select.csm-filter-type").change(function() {
				$editor.find("#code_snippet_changed_filters").val(1);
			});
		}
	};

	$(function() {
		window.visibilityOptions.init();
	});

})(jQuery);