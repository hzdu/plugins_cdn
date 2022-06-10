( function( $, settings ) {

	var Conditionals = function( conditions ) {
		this.visitedAttribute = 'data-happyforms-condition-visited';

		this.setConditions( conditions );
	};

	Conditionals.prototype.setConditions = function( conditions ) {
		this.conditions = {};

		for ( var formID in conditions ) {
			this.conditions[formID] = this.reduceClauses( conditions[formID] );
			this.applyConditions( formID );
		}
	};

	Conditionals.prototype.reduceClauses = function( clauses ) {
		clauses = clauses.map( this.reduceClause.bind( this ) );

		return clauses;
	}

	Conditionals.prototype.reduceClause = function( clause ) {
		var clause_groups = clause.if.reduce( function( group, _if ) {
			group[_if.key] = group[_if.key] || [];
			group[_if.key].push( _if );

			return group;
		}, {} );

		for ( var key in clause_groups ) {
			clause_groups[key] = clause_groups[key].reduce( function( group, _if, i ) {
				if ( i === 0 ) {
					_if.comparison = [_if.comparison];
					group = _if;
				} else {
					group.comparison.push( _if.comparison );
				}

				return group;
			}, {} );
		}

		var _if = [];

		for ( var key in clause_groups ) {
			var group = clause_groups[key];
			group.comparison = group.comparison.sort().join( ', ' );
			_if.push( group );
		}

		clause.if = _if;

		return clause;
	}

	Conditionals.prototype.callbacks = {};

	Conditionals.prototype.bind = function() {
		$( document ).on( 'happyforms-change', '[data-happyforms-conditionable]', this.onChange.bind( this ) );
		$( document ).on( 'happyforms-init', this.onInit.bind( this ) );
	};

	Conditionals.prototype.onInit = function( e ) {
		var $target = $( e.target );
		var $form = $( 'form', $target );
		var formID = parseInt( $( '[name=happyforms_form_id]', $form ).val(), 10 );

		if ( ! $form.is( '[data-happyforms-conditionable]' ) ) {
			return;
		}

		this.applyConditions( formID );
	};

	Conditionals.prototype.onChange = function( e ) {
		var $form = $( e.currentTarget ).parents( '.happyforms-form' );
		var form = $.data( $form.get( 0 ), 'HappyForm' );
		var formID = parseInt( $( '[name=happyforms_form_id]', $form ).val(), 10 );
		var $part = $( e.target );
		var partID = $part.attr( 'data-happyforms-id' );

		this.applyConditions( formID );
	};

	Conditionals.prototype.applyConditions = function( formID ) {
		var $form = $( '[name="happyforms_form_id"][value="' + formID + '"]' ).parents( '.happyforms-form' );

		if ( ! this.conditions[formID] ) {
			return;
		}

		var conditions = this.conditions[formID];

		$( '[' + this.visitedAttribute + ']', $form ).removeAttr( this.visitedAttribute );

		conditions.forEach( function( condition ) {
			var result = this.evaluateIf( condition, formID );
			this.applyThen( result, condition.then, formID );
		}.bind( this ) );
	};

	Conditionals.prototype.evaluateIf = function( condition, formID ) {
		var ifs = condition.if.map( function( clause ) {
			return this.evaluateClause( clause, formID );
		}.bind( this ) );

		var result = ifs.reduce( function( result, clause ) {
			switch( clause.op ) {
				case settings.constants.AND:
					result = result && clause.result;
					break;
				case settings.constants.ANDOR:
					result = result || clause.result;
					break;
			}

			return result;
		}, false );

		return result;
	};

	Conditionals.prototype.getPartByID = function( partID, formID ) {
		partID = partID.split( ':' );

		var idParts = [ 'happyforms-', formID, '_', partID[0] ];

		if ( partID.length > 1 ) {
			idParts.push( '_' + partID[1] );
		} else {
			idParts.push( '-part' );
		}

		var id = idParts.join( '' );
		var $part = $( '#' + id );

		return $part;
	}

	Conditionals.prototype.applyThen = function( result, then, formID ) {
		var $part = this.getPartByID( then.key, formID );
		var callback = this.callbacks[then.cb];

		if ( ! callback ) {
			return;
		}

		callback.call( this, $part, result, then );

		$part.attr( this.visitedAttribute, true );
	};

	Conditionals.prototype.getPartValue = function( part ) {
		var type = part.getType();
		var $inputs = $( [] );

		switch( type ) {
			case 'radio':
			case 'checkbox':
				$inputs = $( 'input:checked', part.$el );
				break;
			default:
				$inputs = part.$input;
				break;
		}

		var value = $inputs.map( function() {
			return $( this ).val();
		} ).toArray().sort().join( ', ' );

		return value;
	}

	Conditionals.prototype.comparePartValue = function( value, comparison, comparator ) {
		var result = false;

		switch( comparator ) {
			case settings.constants.EQUAL:
				result = result || ( value == comparison );
				break;
		}

		return result;
	}

	Conditionals.prototype.evaluateClause = function( clause, formID ) {
		var $part = this.getPartByID( clause.key, formID );
		var part = $part.data( 'HappyFormPart' );
		var result = false;

		if ( part ) {
			var value = this.getPartValue( part );
			result = this.comparePartValue( value, clause.comparison, clause.cmp );
		}

		var clause = {
			op: clause.op,
			result: result,
		};

		return clause;
	};

	Conditionals.prototype.callbacks.show = function( $part, result, then ) {
		if ( ! $part.attr( this.visitedAttribute ) ) {
			$part.hide();
		}

		if ( result ) {
			$part.show();
		}
	};

	Conditionals.prototype.callbacks.hide = function( $part, result, then ) {
		if ( ! $part.attr( this.visitedAttribute ) ) {
			$part.show();
		}

		if ( result ) {
			$part.hide();
		}
	};

	Conditionals.prototype.callbacks.set = function( $part, result, then ) {
		var data = {};

		if ( result ) {
			data.value = then.args[0];
		}

		if ( ! $part.attr( this.visitedAttribute ) || result ) {
			$part.trigger( 'condition-update', data );
		}
	};

	HappyForms.conditionals = null;

	$( function() {
		HappyForms.conditionals = new Conditionals( settings.conditions );
		HappyForms.conditionals.bind();
	} );

} )( jQuery, _happyFormsSettings.conditionals );
