/**
 * Common jquery plugins - used both in inner frame and main frame
 */
module.exports = {
	tcbShow: function ( display = 'block' ) {
		return this.each( function () {
			this.style.display = display;
		} );
	},
	tcbHide: function () {
		return this.each( function () {
			this.style.display = 'none';
		} );
	},
	tcbRemoveClass: function ( cls ) {
		cls = cls.split( ' ' );
		return this.each( function () {
			this.classList.remove.apply( this.classList, cls );
		} );
	},
	tcbAddClass: function ( cls ) {
		cls = cls.split( ' ' );
		return this.each( function () {
			this.classList.add.apply( this.classList, cls );
		} );
	},
	/**
	 *
	 * @param cls
	 * @param {Boolean} atLeasOne check that at least one class exists if multiple classes are provided
	 * @return {*|boolean}
	 */
	tcbHasClass: function ( cls, atLeasOne = false ) {
		if ( ! this.length ) {
			return false;
		}
		cls = cls.split( ' ' );

		if ( atLeasOne ) {
			return cls.some( item => this[ 0 ].classList.contains( item ) );
		}

		/* check if element has every class from the provided list */
		return cls.every( item => this[ 0 ].classList.contains( item ) );
	},
	tcbToggleClass: function ( cls, state ) {
		let fn = false;
		if ( typeof state !== 'undefined' ) {
			fn = state ? 'add' : 'remove';
		}

		return this.each( function () {
			if ( ! fn ) {
				const localFn = this.classList.contains( cls ) ? 'remove' : 'add';
				this.classList[ localFn ]( cls );
			} else {
				this.classList[ fn ]( cls );
			}

		} );
	},
};
